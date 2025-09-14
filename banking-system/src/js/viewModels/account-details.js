/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Account Details ViewModel
 */
define(['../accUtils', 'knockout'],
 function(accUtils, ko) {
    function AccountDetailsViewModel() {
      let self = this;
      
      // Observable for account details
      self.accountDetails = ko.observable({
        accountNumber: '',
        accountType: '',
        balance: '',
        status: '',
        createdDate: '',
        lastUpdated: ''
      });

      // Loading state
      self.isLoading = ko.observable(false);

      // Get account details function
      self.getAccountDetails = function() {
        const accountNumber = '0f076df3ae9e479'; // Using the specified account number
        console.log('Fetching account details for:', accountNumber);
        
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          alert('Please login first to view account details');
          return;
        }

        // Show loading state
        self.isLoading(true);
        self.accountDetails({
          accountNumber: 'Loading...',
          accountType: 'Loading...',
          balance: 'Loading...',
          status: 'Loading...',
          createdDate: 'Loading...',
          lastUpdated: 'Loading...'
        });

        fetch(`http://localhost:8080/api/accounts/${accountNumber}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log('Response status:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Account details received:', data);
          
          // Format the data for display
          const formattedData = {
            accountNumber: data.accountNumber || data.id || accountNumber,
            accountType: data.accountType || data.type || 'Savings',
            balance: data.balance ? `₹${new Intl.NumberFormat('en-IN').format(data.balance)}` : 'N/A',
            status: data.status || data.accountStatus || 'Active',
            createdDate: data.createdDate ? new Date(data.createdDate).toLocaleDateString('en-IN') : 'N/A',
            lastUpdated: data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString('en-IN') : 'N/A'
          };
          
          self.accountDetails(formattedData);
          console.log('Account details updated:', formattedData);
        })
        .catch(error => {
          console.error('Error fetching account details:', error);
          self.accountDetails({
            accountNumber: 'Error',
            accountType: 'Error loading details',
            balance: 'Error',
            status: 'Error',
            createdDate: 'Error',
            lastUpdated: 'Error'
          });
          alert('Failed to fetch account details. Please try again.');
        })
        .finally(() => {
          self.isLoading(false);
        });
      };

      // Refresh account details
      self.refreshAccountDetails = function() {
        console.log('Refreshing account details...');
        self.getAccountDetails();
      };

      // Navigate to home
      self.goToHome = function() {
        if (window.appRouter) {
          window.appRouter.go({ path: 'home' });
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
        accUtils.announce('Account details page loaded.', 'assertive');
        document.title = "Oracle Banking - Account Details";
        
        // Fetch account details when page loads
        self.getAccountDetails();
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
    return AccountDetailsViewModel;
  }
);
