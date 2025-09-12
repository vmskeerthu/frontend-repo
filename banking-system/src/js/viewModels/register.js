define([
  'knockout',
  'ojs/ojrouter',
  'ojs/ojinputtext',
  'ojs/ojbutton',
  'ojs/ojformlayout',
  'ojs/ojselectcombobox'   
], function(ko, Router) {
  function RegisterViewModel() {
    let self = this;

    self.name = ko.observable();
    self.email = ko.observable();
    self.passwordHash = ko.observable();
    self.address = ko.observable();
    self.phoneNumber = ko.observable();
    self.accountType = ko.observable("SAVINGS");
    self.errorMessage = ko.observable();

    self.register = () => {
      const payload = {
        name: self.name(),
        email: self.email(),
        passwordHash: self.passwordHash(),
        address: self.address(),
        phoneNumber: self.phoneNumber(),
        accountType: self.accountType()
      };

      fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (!response.ok) throw new Error("Registration failed");
        return response.json();
      })
      .then(data => {
        alert("Registration successful! Please login.");
        // Router.rootInstance.go("login");
        // app.router.go('login');   // use the same name you registered above
// oj.Router.rootInstance.go('login'); 
window.appRouter.go('login');
      })
      .catch(err => {
        self.errorMessage("Error: " + err.message);
      });
    };
  }
  return RegisterViewModel;
});
