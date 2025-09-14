define([
  'knockout',
  'ojs/ojinputtext',
  'ojs/ojbutton',
  'ojs/ojformlayout',
  'ojs/ojcheckboxset'
], function (ko) {
  function LoginViewModel() {
    let self = this;

    self.email = ko.observable();
    self.password = ko.observable();
    self.errorMessage = ko.observable();

    // Debug: Log when view model is created
    console.log('LoginViewModel created successfully');

    self.login = () => {
      // Clear previous error messages
      self.errorMessage('');
      
      // Basic validation
      if (!self.email() || !self.password()) {
        self.errorMessage('Please enter both email and password');
        return;
      }

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
        console.log("value : ",data);
        localStorage.setItem("token", data.token);
        
        // Store user email
        localStorage.setItem("userEmail", self.email());
        
        // Store user account number (assuming the API returns it)
        if (data.accountNumber) {
          localStorage.setItem("userAccountNumber", data.accountNumber);
        } else {
          // Default account number if not provided by API
          localStorage.setItem("userAccountNumber", "0f076df3ae9e479");
        }
        
        // Update the header with user email
        if (window.appController) {
          window.appController.userLogin(self.email());
        }
        
        const token = localStorage.getItem('token'); 
        console.log('Login successful, token:', token);
        console.log('User email:', localStorage.getItem('userEmail'));
        console.log('User account number:', localStorage.getItem('userAccountNumber'));
        
        if (window.appRouter) {
          window.appRouter.go({ path: 'home' });
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

    // Connected method for proper initialization
    self.connected = function() {
      console.log('Login page connected');
      document.title = "Oracle Banking - Login";
      // Add login-page class to body
      document.body.classList.add('login-page');
    };

    // Disconnected method
    self.disconnected = function() {
      console.log('Login page disconnected');
      // Remove login-page class from body
      document.body.classList.remove('login-page');
    };

    // Transition completed method
    self.transitionCompleted = function() {
      console.log('Login page transition completed');
    };
  }

  return LoginViewModel;
});
