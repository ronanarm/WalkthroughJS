# WalkthroughJS - TypeScript Edition

Create beautiful, interactive tutorials and onboarding experiences for your web applications with zero dependencies. Now fully rewritten in TypeScript with modern tooling!

[![npm version](https://img.shields.io/npm/v/@walkthroughjs/core.svg)](https://www.npmjs.com/package/@walkthroughjs/core)
[![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

## ✨ Features

- **🔷 TypeScript First** - Full type safety and IntelliSense support
- **📦 Modern Build** - ESM and CJS support with tsup
- **🎨 Beautiful Design** - Modern, polished UI with smooth animations
- **⌨️ Keyboard Navigation** - Full support for arrow keys, Enter, and Escape
- **📱 Responsive** - Works perfectly on all screen sizes and devices
- **🎯 Smart Positioning** - Automatic popup positioning to stay visible
- **💾 Progress Tracking** - Remember where users left off
- **🔌 Event Callbacks** - Hook into lifecycle events for custom behavior
- **🎨 Customizable** - Colors, positions, templates, and styling options
- **⚡ Multiple Setup Methods** - HTML attributes, JSON config, or quick start
- **🧩 Custom Templates** - Complete control over popup HTML structure
- **0️⃣ Zero Dependencies** - Lightweight and fast

## 📦 Installation

### NPM (Recommended)

```bash
npm install @walkthroughjs/core
```

### Yarn

```bash
yarn add @walkthroughjs/core
```

### PNPM

```bash
pnpm add @walkthroughjs/core
```

## 🚀 Quick Start

### TypeScript/JavaScript Module

```typescript
import { walkthrough } from '@walkthroughjs/core';

// Quick start method
walkthrough.start([
  {
    element: '.welcome-section',
    title: 'Welcome! 👋',
    text: 'Let me show you around.',
    position: 'bottom'
  },
  {
    element: '#main-button',
    title: 'Main Action',
    text: 'Click here to get started.',
    position: 'top'
  }
]);
```

### Using TypeScript Class

```typescript
import { Walkthrough, WalkthroughOptions } from '@walkthroughjs/core';

const options: WalkthroughOptions = {
  progressColor: '#667eea',
  showProgress: true,
  rememberProgress: true
};

const tour = new Walkthrough(options);

tour.configure({
  steps: [
    {
      element: '.feature-1',
      title: 'Feature 1',
      text: 'This is an amazing feature.'
    }
  ],
  callbacks: {
    onStart: () => console.log('Tour started!'),
    onFinish: () => console.log('Tour completed!')
  }
});

tour.start();
```

### HTML Attributes Method

```html
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

<script type="module">
  import { walkthrough } from '@walkthroughjs/core';
  
  const tour = walkthrough.fromAttributes();
  tour.start();
</script>
```

## 📚 API Reference

### `walkthrough.start(steps, options?)`

Quick start method to create and start a walkthrough immediately.

```typescript
walkthrough.start([
  { element: '.header', title: 'Header', text: 'This is the header' }
], { 
  progressColor: '#28a745',
  showProgress: true
});
```

### `walkthrough.fromAttributes(options?)`

Creates a walkthrough from HTML data attributes.

```typescript
const tour = walkthrough.fromAttributes({
  progressColor: '#667eea',
  rememberProgress: false
});
tour.start();
```

### `walkthrough.fromJSON(config)`

Creates a walkthrough from a JSON configuration object.

```typescript
const tour = walkthrough.fromJSON({
  steps: [...],
  options: {...},
  callbacks: {...}
});
tour.start();
```

### Configuration Options

```typescript
interface WalkthroughOptions {
  // Visual
  overlayColor?: string;           // Default: 'rgba(0, 0, 0, 0.5)'
  highlightPadding?: number;       // Default: 10
  animationDuration?: number;      // Default: 300
  progressColor?: string;          // Default: '#4CAF50'
  
  // Progress
  showProgress?: boolean;          // Default: true
  
  // Buttons
  showButtons?: boolean;           // Default: true
  showSkip?: boolean;              // Default: true
  skipText?: string;               // Default: 'Skip'
  prevText?: string;               // Default: '← Previous'
  nextText?: string;               // Default: 'Next →'
  finishText?: string;             // Default: 'Finish'
  
  // Keyboard
  keyboard?: boolean;              // Default: true
  escapeToExit?: boolean;          // Default: true
  arrowNavigation?: boolean;       // Default: true
  
  // Storage
  rememberProgress?: boolean;      // Default: false
  cookieName?: string;             // Default: 'walkthrough_progress'
  
  // Behavior
  closeOnOverlay?: boolean;        // Default: true
  autoStart?: boolean;             // Default: false
}
```

### Step Configuration

```typescript
interface WalkthroughStep {
  element: string | HTMLElement;   // Target element
  title?: string;                  // Step title
  text?: string;                   // Step description
  position?: 'top' | 'bottom' | 'left' | 'right';  // Popup position
}
```

### Callbacks

```typescript
tour.configure({
  callbacks: {
    onStart: () => console.log('Started'),
    onStep: (step, index) => console.log(`Step ${index}`),
    onFinish: () => console.log('Finished'),
    onEnd: () => console.log('Ended')
  }
});
```

### Methods

```typescript
const tour = new Walkthrough();

tour.start();           // Start the walkthrough
tour.next();            // Go to next step
tour.prev();            // Go to previous step
tour.finish();          // Finish the walkthrough
tour.end();             // End/close the walkthrough
tour.destroy();         // Clean up and remove all elements
```

## 🎨 Customization

### Custom Colors

```typescript
const tour = new Walkthrough({
  progressColor: '#667eea',
  overlayColor: 'rgba(0, 0, 0, 0.7)'
});
```

### Custom Templates

```typescript
tour.configure({
  templates: {
    popup: (step, index, total) => `
      <div class="custom-popup">
        <h2>${step.title}</h2>
        <p>${step.text}</p>
        <div>Step ${index + 1} of ${total}</div>
      </div>
    `
  }
});
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Development mode (watch)
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 📝 License

LGPL-3.0-or-later

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 🙏 Credits

Originally created by Ronan Armstrong, rebuilt in TypeScript by Benjamin Rast.

