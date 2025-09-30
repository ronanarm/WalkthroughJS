# Walkthrough.js

Create beautiful, interactive tutorials and onboarding experiences for your web applications with zero dependencies.

![Walkthrough.js Demo](https://img.shields.io/badge/demo-live-brightgreen) ![Version](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-LGPL-green)

## ✨ Features

- **🎨 Beautiful Design** - Modern, polished UI with smooth animations
- **⌨️ Keyboard Navigation** - Full support for arrow keys, Enter, and Escape
- **📱 Responsive** - Works perfectly on all screen sizes and devices
- **🎯 Smart Positioning** - Automatic popup positioning to stay visible
- **💾 Progress Tracking** - Remember where users left off
- **🔌 Event Callbacks** - Hook into lifecycle events for custom behavior
- **🎨 Customizable** - Colors, positions, templates, and styling options
- **⚡ Multiple Setup Methods** - HTML attributes, JSON config, or quick start
- **🧩 Custom Templates** - Complete control over popup HTML structure

## 🚀 Quick Start

### 1\. Include the Library

#### A\. Local
```html
<script src="walkthrough.js"></script>  
```

#### B\. UNPKG CDN
```html
<script src="https://unpkg.com/@ronanarm/walkthroughjs@latest"></script>  
```

#### C\. jsDelivr CDN
```html
<script src="https://cdn.jsdelivr.net/gh/ronanarm/WalkthroughJS@main/src/walkthrough.min.js"></script>  
```

#### D\. NPM (Preferred)
```bash
npm install @ronanarm/walkthroughjs
```

### 2\. Add Data Attributes (Easiest Method)

```HTML
<div data-wt-step="1"   
     data-wt-title="Welcome!"   
     data-wt-text="This is your first step."   
     data-wt-position="bottom">  
  Content to highlight  
</div>  
  
<button data-wt-step="2"   
        data-wt-title="Click Here"   
        data-wt-text="This button does something important.">  
  Action Button  
</button>  
```

### 3\. Start the Walkthrough

```javascript
// Start from HTML attributes  
const tour = walkthrough.fromAttributes();  
tour.start();  
  
// Or use the quick start method  
walkthrough.start([  
  {  
    element: '.my-element',  
    title: 'Step 1',  
    text: 'This is the first step',  
    position: 'bottom'  
  },  
  {  
    element: '#my-button',  
    title: 'Step 2',   
    text: 'Click this button to continue',  
    position: 'top'  
  }  
]);  
```

## 📖 Usage Methods

### Method 1: HTML Data Attributes

The simplest way to add walkthroughs. Just add data attributes to your HTML elements:

```HTML
<div data-wt-step="1"   
     data-wt-title="Welcome"   
     data-wt-text="This is your dashboard"   
     data-wt-position="bottom">  
  Dashboard Content  
</div>  
  
<script>  
const tour = walkthrough.fromAttributes({  
  progressColor: '#667eea',  
  rememberProgress: true  
});  
tour.start();  
</script>  
```

### Method 2: JSON Configuration

Use JavaScript objects for programmatic control:

```javascript
const tour = walkthrough.fromJSON({  
  steps: [  
    {  
      element: '.header',  
      title: 'Navigation',  
      text: 'This is your main navigation area',  
      position: 'bottom'  
    },  
    {  
      element: '#sidebar',  
      title: 'Sidebar',  
      text: 'Access tools and settings here',  
      position: 'right',  
      nextText: 'Got it! →'  
    }  
  ],  
  options: {  
    progressColor: '#764ba2',  
    highlightPadding: 15,  
    animationDuration: 400  
  },  
  callbacks: {  
    onStart: () => console.log('Tour started'),  
    onFinish: () => console.log('Tour completed')  
  }  
});  
  
tour.start();  
```

### Method 3: Quick Start

Perfect for rapid prototyping:

```javascript
walkthrough.start([  
  {  
    element: '.feature',  
    title: 'New Feature',  
    text: 'Check out this new feature!',  
    position: 'bottom'  
  }  
], {  
  progressColor: '#28a745',  
  onFinish: () => alert('Tour complete!')  
});  
```

## 🎛️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `progressColor` | string | `'#007bff'` | Color of the progress indicator |
| `highlightPadding` | number | `10` | Padding around highlighted elements |
| `animationDuration` | number | `300` | Animation duration in milliseconds |
| `rememberProgress` | boolean | `true` | Remember user's progress in localStorage |
| `showProgress` | boolean | `true` | Show step progress indicator |
| `allowClose` | boolean | `true` | Allow users to close the walkthrough |
| `backdrop` | boolean | `true` | Show backdrop overlay |
| `backdropColor` | string | `'rgba(0,0,0,0.5)'` | Backdrop overlay color |

## 📍 Position Options

- `'top'` - Above the element
- `'bottom'` - Below the element
- `'left'` - To the left of the element
- `'right'` - To the right of the element
- `'center'` - Centered on screen

## 🎨 Custom Templates

Take full control of the popup HTML:

```javascript
const tour = walkthrough.fromJSON({  
  steps: [...],  
  templates: {  
    popup: (step, index, total) => {  
      const isLast = index === total - 1;  
      return `  
        <div class="my-custom-popup">  
          <h2>${step.title}</h2>  
          <p>${step.text}</p>  
          <div class="buttons">  
            ${index > 0 ? `<button onclick="currentWalkthrough.prev()">Back</button>` : ''}  
            <button onclick="currentWalkthrough.${isLast ? 'finish' : 'next'}()">  
              ${isLast ? 'Finish' : 'Next'}  
            </button>  
          </div>  
        </div>  
      `;  
    }  
  }  
});  
```

## 🔌 Event Callbacks

```javascript
const tour = walkthrough.fromJSON({  
  steps: [...],  
  callbacks: {  
    onStart: () => {  
      console.log('Walkthrough started');  
    },  
    onStep: (step, index) => {  
      console.log(`Now on step ${index + 1}: ${step.title}`);  
    },  
    onNext: (step, index) => {  
      console.log('Moving to next step');  
    },  
    onPrev: (step, index) => {  
      console.log('Moving to previous step');  
    },  
    onFinish: () => {  
      console.log('Walkthrough completed');  
    },  
    onClose: () => {  
      console.log('Walkthrough closed');  
    }  
  }  
});  
```

## 🎮 API Methods

```javascript
	const tour = walkthrough.fromJSON({...});  
  
// Control methods  
tour.start();           // Start the walkthrough  
tour.next();            // Go to next step  
tour.prev();            // Go to previous step  
tour.goTo(stepIndex);   // Jump to specific step  
tour.finish();          // Complete the walkthrough  
tour.close();           // Close without completing  
tour.destroy();         // Clean up and remove  
  
// State methods  
tour.getCurrentStep();  // Get current step object  
tour.getCurrentIndex(); // Get current step index  
tour.getTotalSteps();   // Get total number of steps  
tour.isActive();        // Check if walkthrough is running  
```

## ⌨️ Keyboard Navigation

- **→ / ↓** - Next step
- **← / ↑** - Previous step
- **Enter** - Next step
- **Escape** - Close walkthrough
- **Home** - Go to first step
- **End** - Go to last step

## 🎯 HTML Data Attributes Reference

| Attribute | Description | Example |
|-----------|-------------|---------|
| `data-wt-step` | Step number (required) | `data-wt-step="1"` |
| `data-wt-title` | Step title | `data-wt-title="Welcome"` |
| `data-wt-text` | Step description | `data-wt-text="This is the main menu"` |
| `data-wt-position` | Popup position | `data-wt-position="bottom"` |
| `data-wt-next-text` | Custom next button text | `data-wt-next-text="Continue →"` |
| `data-wt-prev-text` | Custom previous button text | `data-wt-prev-text="← Back"` |

## 🌟 Examples

Check out the demo files for comprehensive examples of all features and configuration methods.
- [demo-quickstart.html](/src/demo-quickstart.html)
- [demo-attributes.html](/src/demo-attributes.html)
- [demo-json.html](/src/demo-json.html)
- [demo-custom-template.html](/src/demo-custom-template.html)

## 📄 License

LGPL License - see [LICENSE](LICENSE.md) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/walkthrough-js/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/walkthrough-js/discussions)
