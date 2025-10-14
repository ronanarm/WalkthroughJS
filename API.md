# WalkthroughJS TypeScript API Reference

Complete TypeScript API documentation for WalkthroughJS library.

## Table of Contents

- [Core Classes](#core-classes)
- [Types & Interfaces](#types--interfaces)
- [Configuration](#configuration)
- [Methods](#methods)
- [Callbacks](#callbacks)
- [Utilities](#utilities)

## Core Classes

### `Walkthrough`

Main class for creating and managing walkthroughs.

```typescript
import { Walkthrough, WalkthroughOptions } from '@walkthroughjs/core';

const options: WalkthroughOptions = {
  progressColor: '#4CAF50',
  showProgress: true
};

const tour = new Walkthrough(options);
```

## Types & Interfaces

### `WalkthroughOptions`

Complete configuration options interface.

```typescript
interface WalkthroughOptions {
  // Visual
  overlayColor?: string;
  highlightPadding?: number;
  animationDuration?: number;
  scrollDuration?: number;
  scrollOffset?: number;
  zIndex?: number;

  // Popup configuration
  popupWidth?: number;
  popupOffset?: number;
  popupClass?: string;

  // Progress
  showProgress?: boolean;
  progressColor?: string;

  // Buttons
  showButtons?: boolean;
  showSkip?: boolean;
  skipText?: string;
  prevText?: string;
  nextText?: string;
  finishText?: string;

  // Keyboard navigation
  keyboard?: boolean;
  escapeToExit?: boolean;
  arrowNavigation?: boolean;

  // Storage
  cookieName?: string;
  cookieExpiry?: number;
  rememberProgress?: boolean;

  // Behavior
  closeOnOverlay?: boolean;
  autoStart?: boolean;
  startDelay?: number;

  // Attribute names for HTML config
  attributePrefix?: string;
  stepAttribute?: string;
  titleAttribute?: string;
  textAttribute?: string;
  positionAttribute?: string;
}
```

### `WalkthroughStep`

Step configuration interface.

```typescript
interface WalkthroughStep {
  element: string | HTMLElement;
  title?: string;
  text?: string;
  position?: PopupPosition;
  step?: number;
  skipText?: string;
  prevText?: string;
  nextText?: string;
  finishText?: string;
}
```

### `PopupPosition`

Valid popup positions.

```typescript
type PopupPosition = 'top' | 'bottom' | 'left' | 'right';
```

### `WalkthroughCallbacks`

Event callback functions.

```typescript
interface WalkthroughCallbacks {
  onStart?: () => void;
  onStep?: (step: WalkthroughStep, index: number) => void;
  onFinish?: () => void;
  onEnd?: () => void;
}
```

### `WalkthroughTemplates`

Custom template functions.

```typescript
interface WalkthroughTemplates {
  popup?: (step: WalkthroughStep, index: number, totalSteps: number) => string;
}
```

### `WalkthroughConfig`

Complete configuration object.

```typescript
interface WalkthroughConfig {
  steps?: WalkthroughStep[];
  options?: WalkthroughOptions;
  callbacks?: WalkthroughCallbacks;
  templates?: WalkthroughTemplates;
}
```

## Configuration

### Using the Constructor

```typescript
const tour = new Walkthrough({
  progressColor: '#667eea',
  showProgress: true,
  keyboard: true,
  rememberProgress: true
});
```

### Using `configure()` Method

```typescript
tour.configure({
  steps: [
    { element: '.step-1', title: 'Step 1', text: 'First step' },
    { element: '.step-2', title: 'Step 2', text: 'Second step' }
  ],
  options: {
    progressColor: '#28a745'
  },
  callbacks: {
    onStart: () => console.log('Started'),
    onFinish: () => console.log('Finished')
  }
});
```

## Methods

### Instance Methods

#### `start(stepIndex?: number | null): void`

Start the walkthrough from a specific step (or from the beginning).

```typescript
tour.start();      // Start from beginning
tour.start(2);     // Start from step 2 (0-indexed)
```

#### `next(): void`

Navigate to the next step.

```typescript
tour.next();
```

#### `prev(): void`

Navigate to the previous step.

```typescript
tour.prev();
```

#### `finish(): void`

Complete the walkthrough normally.

```typescript
tour.finish();
```

#### `end(): void`

End/close the walkthrough.

```typescript
tour.end();
```

#### `destroy(): void`

Clean up and remove all walkthrough elements.

```typescript
tour.destroy();
```

#### `scanForAttributeSteps(): void`

Scan the DOM for elements with walkthrough attributes.

```typescript
tour.scanForAttributeSteps();
```

#### `configure(config: WalkthroughConfig): void`

Configure the walkthrough with steps, options, callbacks, and templates.

```typescript
tour.configure({
  steps: [...],
  options: {...},
  callbacks: {...}
});
```

### Static Helper Methods

#### `walkthrough.start(steps, options?)`

Quick start method.

```typescript
import { walkthrough } from '@walkthroughjs/core';

walkthrough.start([
  { element: '.header', title: 'Header' }
], {
  progressColor: '#667eea'
});
```

#### `walkthrough.fromAttributes(options?)`

Create from HTML attributes.

```typescript
const tour = walkthrough.fromAttributes({
  progressColor: '#667eea'
});
```

#### `walkthrough.fromJSON(config)`

Create from JSON configuration.

```typescript
const tour = walkthrough.fromJSON({
  steps: [...],
  options: {...}
});
```

## Callbacks

### Event Lifecycle

```typescript
tour.configure({
  callbacks: {
    // Called when tour starts
    onStart: () => {
      console.log('Tour started!');
    },
    
    // Called on each step
    onStep: (step, index) => {
      console.log(`Now on step ${index + 1}: ${step.title}`);
      analytics.track('walkthrough_step', { step: index });
    },
    
    // Called when tour finishes normally
    onFinish: () => {
      console.log('Tour completed!');
      analytics.track('walkthrough_completed');
    },
    
    // Called when tour ends (finish or skip)
    onEnd: () => {
      console.log('Tour ended');
    }
  }
});
```

## Utilities

The library includes several utility functions (internal use, but exported):

### `easeInOut(t: number): number`

Easing function for animations.

### `throttle<T>(func: T, limit: number)`

Throttle function execution.

### `adjustColor(color: string, amount: number): string`

Adjust color brightness.

### `scrollToElement(element, offset, duration, callback)`

Smooth scroll to element.

## TypeScript Usage Examples

### Basic TypeScript Setup

```typescript
import { Walkthrough, WalkthroughOptions, WalkthroughStep } from '@walkthroughjs/core';

const steps: WalkthroughStep[] = [
  {
    element: '#feature-1',
    title: 'Feature 1',
    text: 'Description of feature 1',
    position: 'bottom'
  },
  {
    element: document.querySelector('.feature-2') as HTMLElement,
    title: 'Feature 2',
    text: 'Description of feature 2',
    position: 'top'
  }
];

const options: WalkthroughOptions = {
  progressColor: '#667eea',
  showProgress: true,
  keyboard: true
};

const tour = new Walkthrough(options);
tour.configure({ steps });
tour.start();
```

### With Full Type Safety

```typescript
import type { 
  WalkthroughConfig, 
  WalkthroughCallbacks,
  WalkthroughStep 
} from '@walkthroughjs/core';

const callbacks: WalkthroughCallbacks = {
  onStart: () => console.log('Started'),
  onStep: (step: WalkthroughStep, index: number) => {
    console.log(`Step ${index}: ${step.title}`);
  },
  onFinish: () => console.log('Finished')
};

const config: WalkthroughConfig = {
  steps: [
    { element: '.step-1', title: 'Step 1' }
  ],
  options: {
    progressColor: '#4CAF50'
  },
  callbacks
};
```

## Default Values

All options have sensible defaults:

```typescript
{
  overlayColor: 'rgba(0, 0, 0, 0.5)',
  highlightPadding: 10,
  animationDuration: 300,
  scrollDuration: 500,
  scrollOffset: 100,
  zIndex: 99999,
  popupWidth: 380,
  popupOffset: 15,
  popupClass: 'wt-popup',
  showProgress: true,
  progressColor: '#4CAF50',
  showButtons: true,
  showSkip: true,
  skipText: 'Skip',
  prevText: '← Previous',
  nextText: 'Next →',
  finishText: 'Finish',
  keyboard: true,
  escapeToExit: true,
  arrowNavigation: true,
  cookieName: 'walkthrough_progress',
  cookieExpiry: 30,
  rememberProgress: false,
  closeOnOverlay: true,
  autoStart: false,
  startDelay: 0,
  attributePrefix: 'wt',
  stepAttribute: 'step',
  titleAttribute: 'title',
  textAttribute: 'text',
  positionAttribute: 'position'
}
```

