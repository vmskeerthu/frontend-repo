define(['knockout', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojbutton', 'ojs/ojformlayout', 'ojs/ojcheckboxset'],
  function(ko) {
    function TransferViewModel() {
      var self = this;
      self.sourceAccountNumber = ko.observable('');
      self.destinationAccountNumber = ko.observable('');
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

      // Transfer type selection
      self.selectTransferType = function(type) {
        console.log('Selected transfer type:', type);
      };

      // Quick transfer options
      self.selectQuickOption = function(option) {
        console.log('Selected quick option:', option);
      };

      // Recipient tab selection
      self.selectRecipientTab = function(tab) {
        // Remove active class from all tabs
        const tabs = document.querySelectorAll('.recipient-tab');
        tabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        event.target.classList.add('active');
        
        // Update placeholder based on tab
        const input = document.querySelector('#destinationAccountNumber');
        if (tab === 'account') {
          input.placeholder = 'Enter recipient account number';
        } else if (tab === 'email') {
          input.placeholder = 'Enter recipient email address';
        } else if (tab === 'phone') {
          input.placeholder = 'Enter recipient phone number';
        }
      };

      self.makeTransfer = function() {
        // Clear previous messages
        self.successMessage('');
        self.errorMessage('');

        // Validation
        if (!self.sourceAccountNumber() || !self.destinationAccountNumber() || !self.amount() || self.amount() <= 0) {
          self.errorMessage('Please fill in all required fields with valid values.');
          return;
        }

        const token = localStorage.getItem('token');
        console.log("Making transfer with token:", token);

        fetch("http://localhost:8080/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            sourceAccountNumber: self.sourceAccountNumber(),
            destinationAccountNumber: self.destinationAccountNumber(),
            amount: self.amount(),
            type: "TRANSFER",
            description: self.description()
          })
        })
        .then(r => {
          if (!r.ok) throw new Error("Request failed " + r.status);
          return r.json();
        })
        .then(data => {
          self.successMessage(`Transfer Successful! ₹${data.amount} has been sent to ${data.destinationAccountNumber}.`);
          
          // Refresh the account balance after successful transfer
          self.fetchAccountBalance(self.currentAccountNumber());
          
          // Clear form
          self.sourceAccountNumber(self.currentAccountNumber());
          self.destinationAccountNumber('');
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
          self.errorMessage('Transfer failed. Please try again or contact support.');
        });
      };

      // Get current user's account number (you might need to adjust this based on your user data structure)
      self.getCurrentUserAccount = function() {
        // For now, using a default account number. In a real app, this would come from user profile
        // You might want to store this in localStorage or get it from user profile API
        const userAccount = localStorage.getItem('userAccountNumber') || '1234567890';
        return userAccount;
      };

      // Initialize page
      self.connected = function() {
        // Get current user's account number
        const currentAccount = self.getCurrentUserAccount();
        self.currentAccountNumber(currentAccount);
        self.sourceAccountNumber(currentAccount);
        
        // Fetch the account balance
        self.fetchAccountBalance(currentAccount);
        
        // Add event listeners for preset buttons
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(button => {
          button.addEventListener('click', function() {
            const amount = parseFloat(this.getAttribute('data-amount'));
            self.setAmount(amount);
          });
        });

        // Add event listeners for transfer types
        const typeOptions = document.querySelectorAll('.type-option');
        typeOptions.forEach(option => {
          option.addEventListener('click', function() {
            // Remove active class from all options
            typeOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            
            const type = this.getAttribute('data-type');
            self.selectTransferType(type);
          });
        });

        // Add event listeners for quick options
        const quickOptions = document.querySelectorAll('.quick-option');
        quickOptions.forEach(option => {
          option.addEventListener('click', function() {
            const optionType = this.getAttribute('data-type');
            self.selectQuickOption(optionType);
          });
        });

        // Add event listeners for recipient tabs
        const recipientTabs = document.querySelectorAll('.recipient-tab');
        recipientTabs.forEach(tab => {
          tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            self.selectRecipientTab(tabType);
          });
        });
      };
    }
    return TransferViewModel;
  }
);
