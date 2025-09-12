// /**
//  * @license
//  * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
//  * Licensed under The Universal Permissive License (UPL), Version 1.0
//  * as shown at https://oss.oracle.com/licenses/upl/
//  * @ignore
//  */
// /*
//  * Your application specific code will go here
//  */
// define(['knockout', 'ojs/ojcontext', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider',
//         'ojs/ojdrawerpopup', 'ojs/ojmodule-element', 'ojs/ojknockout'],
//   function(ko, Context, moduleUtils, KnockoutTemplateUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter, ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider) {

//      function ControllerViewModel() {

//       this.KnockoutTemplateUtils = KnockoutTemplateUtils;

//       // Handle announcements sent when pages change, for Accessibility.
//       this.manner = ko.observable('polite');
//       this.message = ko.observable();
//       announcementHandler = (event) => {
//           this.message(event.detail.message);
//           this.manner(event.detail.manner);
//       };

//       document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);


//       // Media queries for responsive layouts
//       const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
//       this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
//       const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
//       this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);
// // Router setup
// let router = new CoreRouter(
//   [
//     { path: '', redirect: 'login' },
//     { path: 'login', detail: { label: 'Login' } },
//     { path: 'register', detail: { label: 'Register' } },
//     { path: 'dashboard', detail: { label: 'Dashboard', iconClass: 'oj-ux-ico-bar-chart' } },
//     { path: 'transactions', detail: { label: 'Transactions', iconClass: 'oj-ux-ico-money' } }
//   ],
//   {
//     urlAdapter: new UrlParamAdapter()
//   }
// );

// router.sync();
// this.router = router;              // ✅ keep in controller
// window.appRouter = router;
// // Module Adapter (maps router states to module files in /js/views and /js/viewModels)
// this.moduleAdapter = new ModuleRouterAdapter(router, {
//   defaultPath: 'login'
// });

// // For selection binding
// this.selection = new KnockoutRouterAdapter(router);


// this.navDataProvider = new ArrayDataProvider(
//   [
//     { path: 'dashboard', detail: { label: 'Dashboard', iconClass: 'oj-ux-ico-bar-chart' } },
//     { path: 'transactions', detail: { label: 'Transactions', iconClass: 'oj-ux-ico-money' } }
//   ],
//   { keyAttributes: 'path' }
// );

// // Drawer
// this.sideDrawerOn = ko.observable(false);
// this.mdScreen.subscribe(() => { this.sideDrawerOn(false); });

// this.toggleDrawer = () => {
//   this.sideDrawerOn(!this.sideDrawerOn());
// };

// //       let navData = [
// //          { path: '', redirect: 'login' },
// //          { path: 'login', detail: { label: 'Login' } },
// //   { path: 'register', detail: { label: 'Register' } },
// //     { path: 'dashboard', detail: { label: 'Dashboard', iconClass: 'oj-ux-ico-bar-chart' } },
// //   { path: 'transactions', detail: { label: 'Transactions', iconClass: 'oj-ux-ico-money' } },
// // ];
      
      

// //       // Router setup
// //       let router = new CoreRouter(navData, {
// //         urlAdapter: new UrlParamAdapter()
// //       });
// //       router.sync();

// //       this.moduleAdapter = new ModuleRouterAdapter(router);

// //       this.selection = new KnockoutRouterAdapter(router);

// //       // Setup the navDataProvider with the routes, excluding the first redirected
// //       // route.
// //       // this.navDataProvider = new ArrayDataProvider(navData.slice(1), {keyAttributes: "path"});
// // this.navDataProvider = new ArrayDataProvider(
// //   navData.filter(item => ['dashboard','transactions'].includes(item.path)),
// //   {keyAttributes: "path"}
// // );
// //       // Drawer
// //       self.sideDrawerOn = ko.observable(false);

// //       // Close drawer on medium and larger screens
// //       this.mdScreen.subscribe(() => { self.sideDrawerOn(false) });

// //       // Called by navigation drawer toggle button and after selection of nav drawer item
// //       this.toggleDrawer = () => {
// //         self.sideDrawerOn(!self.sideDrawerOn());
// //       }

//       // Header
//       // Application Name used in Branding Area
//       this.appName = ko.observable("App Name");
//       // User Info used in Global Navigation area
//       this.userLogin = ko.observable("john.hancock@oracle.com");

//       // Footer
//       this.footerLinks = [
//         {name: 'About Oracle', linkId: 'aboutOracle', linkTarget:'http://www.oracle.com/us/corporate/index.html#menu-about'},
//         { name: "Contact Us", id: "contactUs", linkTarget: "http://www.oracle.com/us/corporate/contact/index.html" },
//         { name: "Legal Notices", id: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html" },
//         { name: "Terms Of Use", id: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html" },
//         { name: "Your Privacy Rights", id: "yourPrivacyRights", linkTarget: "http://www.oracle.com/us/legal/privacy/index.html" },
//       ];
//      }
//      // release the application bootstrap busy state
//      Context.getPageContext().getBusyContext().applicationBootstrapComplete();

//      return new ControllerViewModel();
//   }
// );

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

    this.moduleAdapter = new ModuleRouterAdapter(router, { defaultPath: 'login' });
    this.selection = new KnockoutRouterAdapter(router);

    // Navigation data
    let navData = [
      {
        id: 'home',
        name: 'Home',
        icons: 'oj-ux-ico-bar-chart'
      },
        { id: 'transfer', name: 'Transfer', icons: 'oj-ux-ico-money' },
   
       {
        id: 'deposit',
        name: 'Deposit',
        icons: 'oj-ux-ico-money'
      },
        {
        id: 'withdrawal',
        name: 'Withdrawal',
        icons: 'oj-ux-ico-money'
      }
    ];
    this.navDataProvider = new ArrayTreeDataProvider(navData, { keyAttributes: 'id' });
this.onNavSelectionChanged = (event) => {
  const selectedKey = event.detail.value;
  if (selectedKey) {
    router.go({ path: selectedKey }); // Navigate to the route
    this.sideDrawerOn(false);         // Close drawer on mobile
  }
};
    // Drawer
    this.sideDrawerOn = ko.observable(false);
    this.mdScreen.subscribe(() => { this.sideDrawerOn(false); });
    this.toggleDrawer = () => { this.sideDrawerOn(!this.sideDrawerOn()); };

    // Header/Footer
    this.appName = ko.observable("App Name");
    this.userLogin = ko.observable("john.hancock@oracle.com");
    this.footerLinks = [
      { name: 'About Oracle', linkId: 'aboutOracle', linkTarget: 'http://www.oracle.com/us/corporate/index.html#menu-about' },
      { name: "Contact Us", linkId: "contactUs", linkTarget: "http://www.oracle.com/us/corporate/contact/index.html" },
      { name: "Legal Notices", linkId: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html" },
      { name: "Terms Of Use", linkId: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html" },
      { name: "Your Privacy Rights", linkId: "yourPrivacyRights", linkTarget: "http://www.oracle.com/us/legal/privacy/index.html" }
    ];
  }

  Context.getPageContext().getBusyContext().applicationBootstrapComplete();
  return new ControllerViewModel();
});
