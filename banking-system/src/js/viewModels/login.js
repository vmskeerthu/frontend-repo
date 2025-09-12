define([
  'knockout',
  'ojs/ojinputtext',   // covers both oj-input-text and oj-input-password
  'ojs/ojbutton',
  'ojs/ojformlayout'
], function (ko) {
  function LoginViewModel() {
    let self = this;

    self.email = ko.observable();
    self.password = ko.observable();
    self.errorMessage = ko.observable();

    self.login = () => {
      const payload = {
        email: self.email(),
        password: self.password()
      };

      fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (!response.ok) throw new Error("Invalid login");
        return response.json();
      })
      .then(data => {
        localStorage.setItem("token", data.token);
         const token = localStorage.getItem('token'); 
      console.log(token);
          if (window.appRouter) {
          window.appRouter.go({ path: 'deposit' });
        } else {
          console.error('Router is not defined');
        }
        // Router.rootInstance.go("dashboard");
        //  app.moduleAdapter.router.go({ path: 'dashboard' }); 
        //   appController.router.go({ path: 'dashboard' });
      })
      .catch(err => {
        self.errorMessage("Login failed: " + err.message);
      });
    };
  }

  return LoginViewModel;
});
