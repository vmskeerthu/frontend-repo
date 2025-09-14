define(['knockout', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojbutton', 'ojs/ojformlayout', 'ojs/ojcheckboxset'],
  function(ko) {
    function DepositViewModel() {
      var self = this; 
      self.accountNumber = ko.observable('');
      self.amount = ko.observable(0);
      self.description = ko.observable('');
      self.successMessage = ko.observable('');
      self.errorMessage = ko.observable('');

      // Amount preset functionality
      self.setAmount = function(amount) {
        self.amount(amount);
      };

      // Account selection
      self.selectAccount = function(accountType) {
        // Update account number based on selection
        const userAccountNumber = localStorage.getItem('userAccountNumber') ;
        if (accountType === 'savings') {
          self.accountNumber(userAccountNumber);
        } else if (accountType === 'current') {
          // For current account, you might have a different account number
          // For now, using the same account number
          self.accountNumber(userAccountNumber);
        }
      };

      // Deposit method selection
      self.selectDepositMethod = function(method) {
        // Handle method selection logic
        console.log('Selected deposit method:', method);
      };

      self.makeDeposit = function() {
        // Clear previous messages
        self.successMessage('');
        self.errorMessage('');

        // Validation
        if (!self.accountNumber() || !self.amount() || self.amount() <= 0) {
          self.errorMessage('Please fill in all required fields with valid values.');
          return;
        }

        const token = localStorage.getItem('token'); 
        console.log('Making deposit with token:', token);

        fetch("http://localhost:8080/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            sourceAccountNumber: self.accountNumber(),
            amount: self.amount(),
            type: "DEPOSIT",
            description: self.description()
          })
        })
        .then(r => {
          if (!r.ok) throw new Error("Request failed " + r.status);
          return r.json();
        })
        .then(data => {
          self.successMessage(`Deposit Successful! ₹{data.amount} has been deposited to your account.`);
          // Clear form
          self.accountNumber('');
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
          self.errorMessage('Deposit failed. Please try again or contact support.');
        });
      };

      // Initialize page
      self.connected = function() {
        // Set current user's account number as default
        const userAccountNumber = localStorage.getItem('userAccountNumber') || '0f076df3ae9e479';
        self.accountNumber(userAccountNumber);
        
        // Add event listeners for preset buttons
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(button => {
          button.addEventListener('click', function() {
            const amount = parseFloat(this.getAttribute('data-amount'));
            self.setAmount(amount);
          });
        });

        // Add event listeners for account selection
        const accountOptions = document.querySelectorAll('.account-option');
        accountOptions.forEach(option => {
          option.addEventListener('click', function() {
            // Remove active class from all options
            accountOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            
            const accountType = this.getAttribute('data-account');
            self.selectAccount(accountType);
          });
        });

        // Add event listeners for deposit methods
        const methodOptions = document.querySelectorAll('.method-option');
        methodOptions.forEach(option => {
          option.addEventListener('click', function() {
            // Remove active class from all options
            methodOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            
            const method = this.getAttribute('data-method');
            self.selectDepositMethod(method);
          });
        });
      };
    }
    return DepositViewModel;
  }
);
