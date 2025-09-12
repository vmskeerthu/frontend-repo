define(['knockout', 'ojs/ojinputtext', 'ojs/ojinputnumber',
  'ojs/ojbutton', 'ojs/ojformlayout'], function(ko) {
  function TransferViewModel() {
    var self = this;
    self.sourceAccountNumber = ko.observable('');
    self.destinationAccountNumber = ko.observable('');
    self.amount = ko.observable(0);
    self.description = ko.observable('');

    self.makeTransfer = function() {
      const token = localStorage.getItem('token');
      console.log("Using token:", token);

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
        alert("Transfer Successful: " + data.amount + " sent to " + data.destinationAccountNumber);
        // Clear form
        self.sourceAccountNumber('');
        self.destinationAccountNumber('');
        self.amount(0);
        self.description('');
      })
      .catch(err => console.error("Error:", err));
    };
  }
  return TransferViewModel;
});
