define(['knockout', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojbutton', 'ojs/ojformlayout', 'ojs/ojcheckboxset'],
  function(ko) {
    function WithdrawalViewModel() {
      var self = this;
      self.accountNumber = ko.observable('');
      self.amount = ko.observable(0);
      self.description = ko.observable('');
      self.successMessage = ko.observable('');
      self.errorMessage = ko.observable('');
      self.accountBalance = ko.observable('Loading...');
      self.currentAccountNumber = ko.observable('');

      // Amount preset functionality
      self.setAmount = function(amount) {
        self.amount(amount);
      };

      // Handle account number changes
      self.accountNumber.subscribe(function(newAccountNumber) {
        if (newAccountNumber && newAccountNumber !== self.currentAccountNumber()) {
          self.fetchAccountBalance(newAccountNumber);
        }
      });

      // Fetch account balance
      self.fetchAccountBalance = function(accountNumber) {
        if (!accountNumber) {
          self.accountBalance('No account selected');
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          self.accountBalance('Please login first');
          return;
        }

        fetch(`http://localhost:8080/api/accounts/${accountNumber}/balance`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch balance');
          }
          return response.json();
        })
        .then(data => {
          // Format the balance with Indian number format
          const balance = data.balance || 0;
          const formattedBalance = new Intl.NumberFormat('en-IN').format(balance);
          self.accountBalance(`₹${formattedBalance}`);
        })
        .catch(error => {
          console.error('Error fetching balance:', error);
          self.accountBalance('Error loading balance');
        });
      };

      // Withdrawal method selection
      self.selectWithdrawalMethod = function(method) {
        console.log('Selected withdrawal method:', method);
        
        // Show/hide ATM location based on method
        const atmLocation = document.getElementById('atmLocation');
        if (method === 'atm' && atmLocation) {
          atmLocation.style.display = 'block';
        } else if (atmLocation) {
          atmLocation.style.display = 'none';
        }
      };

      self.makeWithdrawal = function() {
        // Clear previous messages
        self.successMessage('');
        self.errorMessage('');

        // Validation
        if (!self.accountNumber() || !self.amount() || self.amount() <= 0) {
          self.errorMessage('Please fill in all required fields with valid values.');
          return;
        }

        const token = localStorage.getItem('token');
        console.log("Making withdrawal with token:", token);

        fetch("http://localhost:8080/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            sourceAccountNumber: self.accountNumber(),
            amount: self.amount(),
            type: "WITHDRAWAL",
            description: self.description()
          })
        })
        .then(r => {
          if (!r.ok) throw new Error("Request failed " + r.status);
          return r.json();
        })
        .then(data => {
          self.successMessage(`Withdrawal Successful! ₹${data.amount} has been withdrawn from your account.`);
          
          // Refresh the account balance after successful withdrawal
          self.fetchAccountBalance(self.currentAccountNumber());
          
          // Clear form
          self.accountNumber(self.currentAccountNumber());
          self.amount(0);
          self.description('');
          
          // Add auto-hide class and clear success message after 5 seconds
          setTimeout(() => {
            const successElement = document.querySelector('.success-message');
            if (successElement) {
              successElement.classList.add('auto-hide');
            }
            setTimeout(() => {
              self.successMessage('');
            }, 500);
          }, 4500);
        })
        .catch(err => {
          console.error("Error:", err);
          self.errorMessage('Withdrawal failed. Please try again or contact support.');
        });
      };

      // Initialize page
      self.connected = function() {
        // Get current user's account number
        const userAccountNumber = localStorage.getItem('userAccountNumber') || '0f076df3ae9e479';
        self.currentAccountNumber(userAccountNumber);
        self.accountNumber(userAccountNumber);
        
        // Fetch the account balance
        self.fetchAccountBalance(userAccountNumber);
        
        // Add event listeners for preset buttons
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(button => {
          button.addEventListener('click', function() {
            const amount = parseFloat(this.getAttribute('data-amount'));
            self.setAmount(amount);
          });
        });

        // Add event listeners for withdrawal methods
        const methodOptions = document.querySelectorAll('.method-option');
        methodOptions.forEach(option => {
          option.addEventListener('click', function() {
            // Remove active class from all options
            methodOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            
            const method = this.getAttribute('data-method');
            self.selectWithdrawalMethod(method);
          });
        });

        // Add event listeners for location options
        const locationOptions = document.querySelectorAll('.location-option');
        locationOptions.forEach(option => {
          option.addEventListener('click', function() {
            // Remove active class from all options
            locationOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
          });
        });
      };
    }
    return WithdrawalViewModel;
  }
);
