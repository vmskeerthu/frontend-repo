/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['../accUtils', 'knockout', 'ojs/ojswitch'],
 function(accUtils, ko) {
    function DashboardViewModel() {
      let self = this;
      
      // Observable for show balance toggle
      self.showBalance = ko.observable(false);
      
      // Subscribe to showBalance changes to refresh balance when toggled on
      self.showBalance.subscribe(function(newValue) {
        if (newValue && self.currentAccountNumber()) {
          self.fetchAccountBalance(self.currentAccountNumber());
        }
      });
      
      // Observable for account balance
      self.accountBalance = ko.observable('Loading...');
      self.currentAccountNumber = ko.observable('');
      
      // Navigation handler for quick actions
      self.navigateToAction = (action) => {
        if (window.appRouter) {
          window.appRouter.go({ path: action });
        }
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

      // Navigate to account details page
      self.getAccountDetails = function() {
        console.log('Navigating to account details page...');
        if (window.appRouter) {
          window.appRouter.go({ path: 'account-details' });
        } else {
          console.error('Router not available');
        }
      };

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      this.connected = () => {
        accUtils.announce('Home dashboard loaded.', 'assertive');
        document.title = "Oracle Banking - Home";
        
        // Get current user's account number and fetch balance
        const userAccountNumber = localStorage.getItem('userAccountNumber') || '0f076df3ae9e479';
        self.currentAccountNumber(userAccountNumber);
        self.fetchAccountBalance(userAccountNumber);
        
        // Add click handlers for quick actions
        const actionItems = document.querySelectorAll('.action-item');
        actionItems.forEach(item => {
          item.addEventListener('click', () => {
            const action = item.getAttribute('data-action');
            self.navigateToAction(action);
          });
        });
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      this.disconnected = () => {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      this.transitionCompleted = () => {
        // Implement if needed
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return DashboardViewModel;
  }
);
