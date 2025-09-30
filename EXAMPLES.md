# Walkthrough.js Examples

Comprehensive examples showing different use cases and configurations.

## Basic Examples

### Simple HTML Attributes

```html
<!DOCTYPE html>  
<html>  
<head>  
    <title>Basic Walkthrough</title>  
</head>  
<body>  
    <header data-wt-step="1"   
            data-wt-title="Welcome!"   
            data-wt-text="This is your dashboard header">  
        <h1>My App</h1>  
    </header>  
      
    <nav data-wt-step="2"   
         data-wt-title="Navigation"   
         data-wt-text="Use this menu to navigate around">  
        <a href="#home">Home</a>  
        <a href="#profile">Profile</a>  
    </nav>  
      
    <main data-wt-step="3"   
          data-wt-title="Main Content"   
          data-wt-text="Your main content appears here">  
        <p>Welcome to the app!</p>  
    </main>  
  
    <script src="walkthrough.js"></script>  
    <script>  
        // Start the walkthrough  
        const tour = walkthrough.fromAttributes();  
        tour.start();  
    </script>  
</body>  
</html> 
```

### JSON Configuration

```javascript
const onboardingTour = walkthrough.fromJSON({  
  steps: [  
    {  
      element: '.dashboard-header',  
      title: '👋 Welcome to Your Dashboard',  
      text: 'This is your personal dashboard where you can see all your important information at a glance.',  
      position: 'bottom'  
    },  
    {  
      element: '.sidebar-menu',  
      title: '🧭 Navigation Menu',  
      text: 'Use this sidebar to navigate between different sections of the application.',  
      position: 'right'  
    },  
    {  
      element: '.notification-bell',  
      title: '🔔 Notifications',  
      text: 'Click here to see your latest notifications and updates.',  
      position: 'bottom'  
    },  
    {  
      element: '.user-profile',  
      title: '👤 Your Profile',  
      text: 'Access your profile settings and account information here.',  
      position: 'left'  
    }  
  ],  
  options: {  
    progressColor: '#4CAF50',  
    highlightPadding: 12,  
    rememberProgress: true  
  },  
  callbacks: {  
    onFinish: () => {  
      // Mark onboarding as complete  
      localStorage.setItem('onboarding_complete', 'true');  
      showWelcomeMessage();  
    }  
  }  
});  
  
// Start only for new users  
if (!localStorage.getItem('onboarding_complete')) {  
  onboardingTour.start();  
}  
```

## Advanced Examples

### Form Walkthrough with Validation

```javascript
const formTour = walkthrough.fromJSON({  
  steps: [  
    {  
      element: '#user-name',  
      title: 'Enter Your Name',  
      text: 'Please enter your full name as it appears on official documents.',  
      position: 'right',  
      validate: () => {  
        const input = document.getElementById('user-name');  
        return input.value.trim().length >= 2;  
      },  
      validationMessage: 'Please enter at least 2 characters for your name.'  
    },  
    {  
      element: '#email',  
      title: 'Email Address',  
      text: 'We\'ll use this email for important account notifications.',  
      position: 'right',  
      validate: () => {  
        const email = document.getElementById('email').value;  
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);  
      },  
      validationMessage: 'Please enter a valid email address.'  
    },  
    {  
      element: '#password',  
      title: 'Secure Password',  
      text: 'Choose a strong password with at least 8 characters.',  
      position: 'right',  
      validate: () => {  
        const password = document.getElementById('password').value;  
        return password.length >= 8;  
      },  
      validationMessage: 'Password must be at least 8 characters long.'  
    }  
  ],  
  callbacks: {  
    canNext: (step, index, tour) => {  
      if (step.validate) {  
        const isValid = step.validate();  
        if (!isValid && step.validationMessage) {  
          alert(step.validationMessage);  
        }  
        return isValid;  
      }  
      return true;  
    }  
  }  
});  
```

### Dynamic Content Walkthrough

```javascript
const dynamicTour = walkthrough.fromJSON({  
  steps: [  
    {  
      element: () => document.querySelector('.current-tab'),  
      title: 'Current Tab',  
      text: 'This highlights whatever tab is currently active.',  
      position: 'bottom'  
    },  
    {  
      element: '.data-table',  
      title: 'Your Data',  
      text: 'This table shows your personalized data.',  
      position: 'top',  
      condition: () => document.querySelector('.data-table tbody tr'),  
      beforeShow: (step, tour) => {  
        // Load data if not already loaded  
        if (!document.querySelector('.data-table tbody tr')) {  
          loadUserData();  
        }  
      }  
    },  
    {  
      element: '.add-button',  
      title: 'Add New Item',  
      text: 'Click here to add new items to your collection.',  
      position: 'left',  
      waitFor: '.add-button:not([disabled])',  
      waitTimeout: 3000  
    }  
  ]  
});  
```

### Multi-Page Walkthrough

```javascript
class MultiPageTour {  
  constructor() {  
    this.currentPage = 1;  
    this.totalPages = 3;  
  }  
  
  startPage1() {  
    const tour = walkthrough.fromJSON({  
      steps: [  
        {  
          element: '.welcome-section',  
          title: 'Welcome to Page 1',  
          text: 'This is the first page of our multi-page tour.',  
          position: 'bottom'  
        },  
        {  
          element: '.next-page-btn',  
          title: 'Continue to Next Page',  
          text: 'Click this button to go to the next page and continue the tour.',  
          position: 'top'  
        }  
      ],  
      callbacks: {  
        onFinish: () => {  
          // Navigate to next page and continue tour  
          window.location.href = '/page2?tour=continue';  
        }  
      }  
    });  
    tour.start();  
  }  
  
  startPage2() {  
    const tour = walkthrough.fromJSON({  
      steps: [  
        {  
          element: '.page2-feature',  
          title: 'Page 2 Features',  
          text: 'Here are the main features available on this page.',  
          position: 'bottom'  
        }  
      ],  
      callbacks: {  
        onFinish: () => {  
          window.location.href = '/page3?tour=continue';  
        }  
      }  
    });  
    tour.start();  
  }  
  
  // Auto-continue tour based on URL parameter  
  init() {  
    const urlParams = new URLSearchParams(window.location.search);  
    if (urlParams.get('tour') === 'continue') {  
      const page = window.location.pathname;  
      if (page === '/page2') {  
        this.startPage2();  
      } else if (page === '/page3') {  
        this.startPage3();  
      }  
    }  
  }  
}  
  
const multiPageTour = new MultiPageTour();  
multiPageTour.init();  
```

### Custom Styled Walkthrough

```javascript
const customTour = walkthrough.fromJSON({  
  steps: [  
    {  
      element: '.feature-card',  
      title: '🚀 New Feature',  
      text: 'Check out this amazing new feature we just launched!',  
      position: 'bottom'  
    }  
  ],  
  templates: {  
    popup: (step, index, total, tour) => {  
      const isLast = index === total - 1;  
      return `  
        <div class="custom-walkthrough-popup">  
          <div class="popup-header">  
            <div class="popup-icon">✨</div>  
            <h3 class="popup-title">${step.title}</h3>  
            <button class="popup-close" onclick="tour.close()">×</button>  
          </div>  
          <div class="popup-body">  
            <p class="popup-text">${step.text}</p>  
          </div>  
          <div class="popup-footer">  
            <div class="progress-dots">  
              ${Array.from({length: total}, (_, i) =>   
                `<span class="dot ${i === index ? 'active' : ''}">${i + 1}</span>`  
              ).join('')}  
            </div>  
            <div class="popup-buttons">  
              ${index > 0 ?   
                `<button class="btn btn-secondary" onclick="tour.prev()">  
                  ← Previous  
                </button>` : ''  
              }  
              <button class="btn btn-primary" onclick="tour.${isLast ? 'finish' : 'next'}()">  
                ${isLast ? 'Finish 🎉' : 'Next →'}  
              </button>  
            </div>  
          </div>  
        </div>  
      `;  
    }  
  },  
  options: {  
    progressColor: '#FF6B6B',  
    highlightPadding: 15,  
    animationDuration: 400  
  }  
});  
```

### Interactive Tutorial with Tasks

```javascript
const interactiveTour = walkthrough.fromJSON({  
  steps: [  
    {  
      element: '.search-box',  
      title: 'Try the Search',  
      text: 'Type "hello" in the search box to continue.',  
      position: 'bottom',  
      validate: () => {  
        return document.querySelector('.search-box').value.toLowerCase() === 'hello';  
      },  
      nextText: 'I typed "hello"'  
    },  
    {  
      element: '.filter-dropdown',  
      title: 'Select a Filter',  
      text: 'Choose any filter from this dropdown.',  
      position: 'right',  
      validate: () => {  
        return document.querySelector('.filter-dropdown').value !== '';  
      },  
      nextText: 'Filter selected'  
    },  
    {  
      element: '.results-area',  
      title: 'View Results',  
      text: 'Great! You can see the filtered results here.',  
      position: 'top',  
      beforeShow: () => {  
        // Simulate search results  
        document.querySelector('.results-area').innerHTML =   
          '<div class="result-item">Sample result based on your search</div>';  
      }  
    }  
  ],  
  callbacks: {  
    canNext: (step, index, tour) => {  
      if (step.validate && !step.validate()) {  
        // Highlight the required action  
        const element = document.querySelector(step.element);  
        element.style.border = '2px solid #ff4444';  
        setTimeout(() => {  
          element.style.border = '';  
        }, 2000);  
        return false;  
      }  
      return true;  
    }  
  }  
});  
```

### Conditional Walkthrough Paths

```javascript
const conditionalTour = walkthrough.fromJSON({  
  steps: [  
    {  
      element: '.user-type-selector',  
      title: 'Select Your Role',  
      text: 'Choose whether you\'re a beginner or advanced user.',  
      position: 'bottom'  
    },  
    // Beginner path  
    {  
      element: '.basic-features',  
      title: 'Basic Features',  
      text: 'These are the essential features to get you started.',  
      position: 'right',  
      condition: () => document.querySelector('.user-type-selector').value === 'beginner'  
    },  
    {  
      element: '.help-section',  
      title: 'Getting Help',  
      text: 'Don\'t forget to check our help section if you need assistance.',  
      position: 'bottom',  
      condition: () => document.querySelector('.user-type-selector').value === 'beginner'  
    },  
    // Advanced path  
    {  
      element: '.advanced-tools',  
      title: 'Advanced Tools',  
      text: 'Here are the power-user features you might be interested in.',  
      position: 'left',  
      condition: () => document.querySelector('.user-type-selector').value === 'advanced'  
    },  
    {  
      element: '.api-section',  
      title: 'API Access',  
      text: 'You can also integrate with our API for custom solutions.',  
      position: 'top',  
      condition: () => document.querySelector('.user-type-selector').value === 'advanced'  
    }  
  ]  
});  
```

### Mobile-Responsive Walkthrough

```javascript
const responsiveTour = walkthrough.fromJSON({  
  steps: [  
    {  
      element: '.mobile-menu-toggle',  
      title: 'Mobile Menu',  
      text: 'On mobile devices, tap here to open the navigation menu.',  
      position: window.innerWidth < 768 ? 'bottom' : 'right',  
      condition: () => window.innerWidth < 768  
    },  
    {  
      element: '.desktop-sidebar',  
      title: 'Desktop Navigation',  
      text: 'On desktop, your navigation is always visible in this sidebar.',  
      position: 'right',  
      condition: () => window.innerWidth >= 768  
    }  
  ],  
  options: {  
    highlightPadding: window.innerWidth < 768 ? 8 : 12,  
    animationDuration: window.innerWidth < 768 ? 200 : 300  
  }  
});  
  
// Restart tour on window resize  
let resizeTimeout;  
window.addEventListener('resize', () => {  
  clearTimeout(resizeTimeout);  
  resizeTimeout = setTimeout(() => {  
    if (responsiveTour.isActive()) {  
      const currentIndex = responsiveTour.getCurrentIndex();  
      responsiveTour.destroy();  
      // Recreate with new responsive settings  
      const newTour = walkthrough.fromJSON({...});  
      newTour.goTo(currentIndex);  
    }  
  }, 250);  
});  
```

## Integration Examples

### React Integration

```javascript
import React, { useEffect, useRef } from 'react';  
  
const WalkthroughComponent = ({ steps, onComplete }) => {  
  const tourRef = useRef(null);  
  
  useEffect(() => {  
    if (steps && steps.length > 0) {  
      tourRef.current = walkthrough.fromJSON({  
        steps,  
        callbacks: {  
          onFinish: onComplete  
        }  
      });  
      tourRef.current.start();  
    }  
  
    return () => {  
      if (tourRef.current) {  
        tourRef.current.destroy();  
      }  
    };  
  }, [steps, onComplete]);  
  
  return null; // This component doesn't render anything  
};  
  
// Usage  
const App = () => {  
  const tourSteps = [  
    {  
      element: '.header',  
      title: 'Welcome',  
      text: 'This is your app header',  
      position: 'bottom'  
    }  
  ];  
  
  return (  
    <div>  
      <WalkthroughComponent   
        steps={tourSteps}  
        onComplete={() => console.log('Tour completed!')}  
      />  
      <header className="header">My App</header>  
    </div>  
  );  
};  
```

### Vue.js Integration

```html
<template>  
  <div>  
    <header ref="header" class="header">My App</header>  
    <nav ref="navigation" class="nav">Navigation</nav>  
  </div>  
</template>  
  
<script>  
export default {  
  name: 'App',  
  mounted() {  
    this.startTour();  
  },  
  methods: {  
    startTour() {  
      const tour = walkthrough.fromJSON({  
        steps: [  
          {  
            element: this.$refs.header,  
            title: 'Header',  
            text: 'This is your app header',  
            position: 'bottom'  
          },  
          {  
            element: this.$refs.navigation,  
            title: 'Navigation',  
            text: 'Use this to navigate',  
            position: 'bottom'  
          }  
        ]  
      });  
      tour.start();  
    }  
  }  
};  
</script>  
```
