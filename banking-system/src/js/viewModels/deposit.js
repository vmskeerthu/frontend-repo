define(['knockout', 'ojs/ojinputtext',  'ojs/ojinputnumber',
  'ojs/ojbutton',
  'ojs/ojformlayout'], function(ko) {
  function DepositViewModel() {
    var self = this; 
    self.accountNumber = ko.observable('');
    self.amount = ko.observable(0);
    self.description = ko.observable('');

    self.makeDeposit = function() {
      const token = localStorage.getItem('token'); 
      console.log(token);

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
        alert("Deposit Successful: " + data.amount);
        // Clear form
        self.accountNumber('');
        self.amount(0);
        self.description('');
      })
      .catch(err => console.error("Error:", err));
    };
  }
  return DepositViewModel;
});
