define([
  'knockout', 'ojs/ojcontext', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils',
  'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter',
  'ojs/ojurlparamadapter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils',
  'ojs/ojarraytreedataprovider',
  'ojs/ojdrawerpopup', 'ojs/ojmodule-element', 'ojs/ojknockout'
], function (
  ko, Context, moduleUtils, KnockoutTemplateUtils,
  CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter,
  UrlParamAdapter, ResponsiveUtils, ResponsiveKnockoutUtils,
  ArrayTreeDataProvider
) {
  function ControllerViewModel() {
    this.KnockoutTemplateUtils = KnockoutTemplateUtils;

    // Accessibility announcer
    this.manner = ko.observable('polite');
    this.message = ko.observable();
    const announcementHandler = (event) => {
      this.message(event.detail.message);
      this.manner(event.detail.manner);
    };
    document.getElementById('globalBody')
      .addEventListener('announce', announcementHandler, false);

    // Responsive
    const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
    this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
    const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
    this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

    // Router setup
    let router = new CoreRouter(
      [
        { path: '', redirect: 'login' },
        { path: 'login', detail: { label: 'login', iconClass: '' } },
        { path: 'register', detail: { label: 'register', iconClass: '' } },
        { path: 'home', detail: { label: 'home', iconClass: 'oj-ux-ico-bar-chart' } },
        { path: 'account-details', detail: { label: 'account-details', iconClass: 'oj-ux-ico-info' } },
        { path: 'transfer', detail: { label: 'transfer', iconClass: 'oj-ux-ico-money' } },
        { path: 'deposit', detail: { label: 'deposit', iconClass: 'oj-ux-ico-money' } },
        { path: 'withdrawal', detail: { label: 'withdrawal', iconClass: 'oj-ux-ico-money' } }
      ],
      {
        urlAdapter: new UrlParamAdapter()
      }
    );

    router.sync();
    this.router = router;
    window.appRouter = router;
    
    // Store appController globally for use in other ViewModels
    window.appController = this;
    
    // Test function to verify binding works
    this.testUserMenu = () => {
      console.log('Test function called - binding works!');
    };

    this.moduleAdapter = new ModuleRouterAdapter(router, { defaultPath: 'login' });
    this.selection = new KnockoutRouterAdapter(router);

    // Navigation data
    let navData = [
      {
        id: 'home',
        name: 'Home',
        icons: 'oj-ux-ico-bar-chart'
      },
      { 
        id: 'transfer', 
        name: 'Transfer Money', 
        icons: 'oj-ux-ico-transfer' 
      },
      {
        id: 'deposit',
        name: 'Deposit Funds',
        icons: 'oj-ux-ico-plus'
      },
      {
        id: 'withdrawal',
        name: 'Withdraw Cash',
        icons: 'oj-ux-ico-minus'
      },
      
      {
        id: 'signout',
        name: 'Sign Out',
        icons: 'oj-ux-ico-sign-out'
      }
    ];
    this.navDataProvider = new ArrayTreeDataProvider(navData, { keyAttributes: 'id' });
this.onNavSelectionChanged = (event) => {
  const selectedKey = event.detail.value;
  if (selectedKey) {
    if (selectedKey === 'signout') {
      // Handle sign out
      this.signOut();
    } else {
      router.go({ path: selectedKey }); // Navigate to the route
    }
    this.sideDrawerOn(false);         // Close drawer on mobile
  }
};
    // Drawer
    this.sideDrawerOn = ko.observable(false);
    this.mdScreen.subscribe(() => { this.sideDrawerOn(false); });
    this.toggleDrawer = () => { this.sideDrawerOn(!this.sideDrawerOn()); };
    
    // Close drawer when clicking outside
    this.closeDrawer = () => { this.sideDrawerOn(false); };

    // Handle user menu selection - Revamped with proper event handling
    this.onUserMenuSelectionChanged = (event) => {
      try {
        console.log('User menu event triggered:', event);
        
        // Extract the selected value from the event
        const selectedValue = this.extractSelectedValue(event);
        console.log('Selected menu item:', selectedValue);
        
        if (!selectedValue) {
          console.warn('No selection value found in event');
          return;
        }
        
        // Handle different menu selections
        switch (selectedValue) {
          case 'about':
            this.navigateToAbout();
            break;
          case 'out':
            this.handleSignOut();
            break;
          default:
            console.log('Unknown menu selection:', selectedValue);
        }
      } catch (error) {
        console.error('Error in user menu selection:', error);
      }
    };

    // Extract selected value from Oracle JET menu event
    this.extractSelectedValue = (event) => {
      // Try multiple possible locations for the selected value
      const possibleValues = [
        event.detail?.selectedValue,
        event.detail?.value,
        event.detail?.item?.value,
        event.detail?.item?.id,
        event.target?.value,
        event.target?.id
      ];
      
      // Return the first non-undefined value
      return possibleValues.find(value => value !== undefined && value !== null);
    };

    // Navigate to about page
    this.navigateToAbout = () => {
      console.log('Navigating to about page');
      if (window.appRouter) {
        window.appRouter.go({ path: 'about' });
      } else {
        console.error('Router not available for navigation');
      }
    };

    // Handle sign out process
    this.handleSignOut = () => {
      console.log('=== SIGN OUT INITIATED ===');
      
      // Show confirmation (optional)
      if (confirm('Are you sure you want to sign out?')) {
        this.signOut();
      } else {
        console.log('Sign out cancelled by user');
      }
    };

    // Enhanced sign out functionality
    this.signOut = () => {
      try {
        console.log('Executing sign out process...');
        
        // Clear all user data from localStorage
        this.clearUserData();
        
        // Reset UI state
        this.resetUIState();
        
        // Navigate to login page
        this.navigateToLogin();
        
        console.log('Sign out completed successfully');
        
      } catch (error) {
        console.error('Error during sign out:', error);
        // Even if there's an error, try to navigate to login
        this.navigateToLogin();
      }
    };

    // Clear user data from localStorage
    this.clearUserData = () => {
      const keysToRemove = [
        'token',
        'userAccountNumber', 
        'userEmail',
        'userName',
        'userBalance',
        'sessionId'
      ];
      
      keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`Removed ${key} from localStorage`);
        }
      });
    };

    // Reset UI state
    this.resetUIState = () => {
      // Reset user email in header
      this.userLogin("customer@oracle.com");
      console.log('UI state reset to default');
    };

    // Navigate to login page
    this.navigateToLogin = () => {
      console.log('Navigating to login page...');
      
      if (window.appRouter) {
        window.appRouter.go({ path: 'login' });
        console.log('Navigation to login page successful');
      } else {
        console.error('Router not available - attempting page reload');
        // Fallback: reload the page to go to login
        window.location.href = window.location.origin + window.location.pathname;
      }
    };

    // Header/Footer
    this.appName = ko.observable("ABCD BANK");
    this.userLogin = ko.observable(localStorage.getItem('userEmail') || "customer@oracle.com");
    this.footerLinks = [
      { name: 'About ABCD Banking', linkId: 'aboutBanking', linkTarget: '#' },
      { name: "Customer Support", linkId: "customerSupport", linkTarget: '#' },
      { name: "Security Center", linkId: "securityCenter", linkTarget: '#' },
      { name: "Privacy Policy", linkId: "privacyPolicy", linkTarget: '#' },
      { name: "Terms & Conditions", linkId: "termsConditions", linkTarget: '#' },
      { name: "Contact Us", linkId: "contactUs", linkTarget: '#' }
    ];
  }

  Context.getPageContext().getBusyContext().applicationBootstrapComplete();
  return new ControllerViewModel();
});
