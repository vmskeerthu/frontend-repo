define(['knockout'], function(ko) {
  function AboutViewModel() {
    let self = this;

    // Page title
    self.pageTitle = ko.observable('About Oracle Banking');

    // Company information
    self.companyInfo = {
      name: 'Oracle Banking',
      tagline: 'Digital Banking Solutions for the Modern World',
      description: 'Oracle Banking provides comprehensive digital banking solutions that empower financial institutions to deliver exceptional customer experiences while maintaining the highest standards of security and reliability.',
      founded: '2020',
      headquarters: 'Bangalore, India',
      employees: '10,000+',
      customers: '50 Million+'
    };

    // Features
    self.features = [
      {
        title: 'Secure Banking',
        description: 'Bank-grade security with end-to-end encryption and multi-factor authentication.',
        icon: '🔒'
      },
      {
        title: '24/7 Support',
        description: 'Round-the-clock customer support to assist you with all your banking needs.',
        icon: '🕐'
      },
      {
        title: 'Mobile First',
        description: 'Seamless mobile banking experience across all devices and platforms.',
        icon: '📱'
      },
      {
        title: 'Real-time Processing',
        description: 'Instant transaction processing with real-time balance updates.',
        icon: '⚡'
      },
      {
        title: 'Global Reach',
        description: 'International banking services with competitive exchange rates.',
        icon: '🌍'
      },
      {
        title: 'AI-Powered',
        description: 'Smart financial insights and personalized recommendations.',
        icon: '🤖'
      }
    ];

    // Contact information
    self.contactInfo = {
      phone: '+91 80 1234 5678',
      email: 'support@oraclebanking.com',
      address: 'Oracle Tower, Brigade Road, Bangalore - 560001, India',
      website: 'www.oraclebanking.com'
    };

    // Social media links
    self.socialLinks = [
      { name: 'Facebook', url: '#', icon: '📘' },
      { name: 'Twitter', url: '#', icon: '🐦' },
      { name: 'LinkedIn', url: '#', icon: '💼' },
      { name: 'Instagram', url: '#', icon: '📷' }
    ];

    // Awards and certifications
    self.awards = [
      'Best Digital Bank 2024',
      'ISO 27001 Certified',
      'PCI DSS Compliant',
      'RBI Licensed Bank'
    ];

    // Lifecycle methods
    self.connected = function() {
      console.log('About page connected');
      document.title = "Oracle Banking - About Us";
    };

    self.disconnected = function() {
      console.log('About page disconnected');
    };

    self.transitionCompleted = function() {
      console.log('About page transition completed');
    };
  }

  return AboutViewModel;
});