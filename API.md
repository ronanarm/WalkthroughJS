# Walkthrough.js API Reference

Complete API documentation for Walkthrough.js library.

## Table of Contents

- [Core Methods](#core-methods)
- [Configuration Objects](#configuration-objects)
- [Step Objects](#step-objects)
- [Template Functions](#template-functions)
- [Event Callbacks](#event-callbacks)
- [Utility Methods](#utility-methods)

## Core Methods

### `walkthrough.fromAttributes(options?)`

Creates a walkthrough from HTML data attributes.

**Parameters:**

- `options` (Object, optional) - Configuration options

**Returns:** Walkthrough instance

**Example:**

```javascript
const tour = walkthrough.fromAttributes({  
  progressColor: '#667eea',  
  rememberProgress: false  
});  
```

### `walkthrough.fromJSON(config)`

Creates a walkthrough from a JSON configuration object.

**Parameters:**

- `config` (Object) - Complete configuration object

**Returns:** Walkthrough instance

**Example:**

```javascript
const tour = walkthrough.fromJSON({  
  steps: [...],  
  options: {...},  
  callbacks: {...}  
});  
```

### `walkthrough.start(steps, options?)`

Quick start method to create and start a walkthrough immediately.

**Parameters:**

- `steps` (Array) - Array of step objects
- `options` (Object, optional) - Configuration options

**Returns:** Walkthrough instance

**Example:**

```javascript
const tour = walkthrough.start([  
  { element: '.header', title: 'Header', text: 'This is the header' }  
], { progressColor: '#28a745' });  
```

## Configuration Objects

### Options Object

```javascript
{  
  // Visual options  
  progressColor: '#007bff',        // Progress indicator color  
  highlightPadding: 10,            // Padding around highlighted elements  
  animationDuration: 300,          // Animation duration (ms)  
  backdrop: true,                  // Show backdrop overlay  
  backdropColor: 'rgba(0,0,0,0.5)', // Backdrop color  
    
  // Behavior options  
  rememberProgress: true,          // Save progress to localStorage  
  showProgress: true,              // Show step counter  
  allowClose: true,                // Allow closing walkthrough  
  autoStart: false,                // Start automatically  
    
  // Navigation options  
  showButtons: true,               // Show next/prev buttons  
  showSkip: true,                  // Show skip button  
  keyboardNavigation: true,        // Enable keyboard controls  
    
  // Positioning  
  defaultPosition: 'bottom',       // Default popup position  
  offset: 10,                      // Distance from target element  
    
  // Text customization  
  nextText: 'Next',               // Default next button text  
  prevText: 'Previous',           // Default previous button text  
  skipText: 'Skip',               // Skip button text  
  finishText: 'Finish',           // Finish button text  
  closeText: '×'                  // Close button text  
}  
```

### Callbacks Object

```javascript
{  
  onStart: (tour) => {},           // Called when tour starts  
  onStep: (step, index, tour) => {}, // Called on each step  
  onNext: (step, index, tour) => {}, // Called when going to next step  
  onPrev: (step, index, tour) => {}, // Called when going to previous step  
  onFinish: (tour) => {},          // Called when tour completes  
  onClose: (tour) => {},           // Called when tour is closed  
  onDestroy: (tour) => {},         // Called when tour is destroyed  
    
  // Step-specific callbacks  
  beforeStep: (step, index, tour) => {}, // Before showing step  
  afterStep: (step, index, tour) => {},  // After showing step  
    
  // Validation callbacks  
  canNext: (step, index, tour) => true,  // Return false to prevent next  
  canPrev: (step, index, tour) => true,  // Return false to prevent prev  
  canClose: (tour) => true               // Return false to prevent close  
}  
```

## Step Objects

### Basic Step Object

```javascript
{  
  element: '.my-element',          // CSS selector or DOM element  
  title: 'Step Title',             // Step title (optional)  
  text: 'Step description',        // Step description (optional)  
  position: 'bottom',              // Popup position  
    
  // Custom button text  
  nextText: 'Continue',            // Custom next button text  
  prevText: 'Go Back',             // Custom previous button text  
    
  // Step-specific options  
  highlightPadding: 15,            // Override global padding  
  showButtons: true,               // Show/hide buttons for this step  
  allowClose: true,                // Allow closing on this step  
    
  // Custom data  
  data: {                          // Custom data for callbacks  
    category: 'onboarding',  
    importance: 'high'  
  }  
}  
```

### Advanced Step Properties

```javascript
{  
  // Element targeting  
  element: '#my-id',               // By ID  
  element: '.my-class',            // By class  
  element: document.querySelector('.my-element'), // DOM element  
  element: () => document.querySelector('.dynamic'), // Function  
    
  // Conditional steps  
  condition: () => true,           // Only show if function returns true  
    
  // Custom positioning  
  position: {  
    my: 'top center',              // Popup anchor point  
    at: 'bottom center',           // Target anchor point  
    offset: '0 10'                 // X Y offset  
  },  
    
  // Wait conditions  
  waitFor: '.async-element',       // Wait for element to exist  
  waitTimeout: 5000,               // Timeout for wait condition  
    
  // Actions  
  beforeShow: (step, tour) => {},  // Before showing this step  
  afterShow: (step, tour) => {},   // After showing this step  
  onNext: (step, tour) => {},      // When leaving this step  
    
  // Validation  
  validate: () => true,            // Validate before proceeding  
  validationMessage: 'Please complete this field'  
}  
```

## Template Functions

### Popup Template

```javascript
templates: {  
  popup: (step, index, total, tour) => {  
    return `  
      <div class="walkthrough-popup">  
        <div class="walkthrough-header">  
          <h3>${step.title || `Step ${index + 1}`}</h3>  
          <button class="walkthrough-close" onclick="tour.close()">×</button>  
        </div>  
        <div class="walkthrough-body">  
          <p>${step.text || ''}</p>  
        </div>  
        <div class="walkthrough-footer">  
          <div class="walkthrough-progress">  
            ${index + 1} of ${total}  
          </div>  
          <div class="walkthrough-buttons">  
            ${index > 0 ? `<button onclick="tour.prev()">Previous</button>` : ''}  
            <button onclick="tour.${index === total - 1 ? 'finish' : 'next'}()">  
              ${index === total - 1 ? 'Finish' : 'Next'}  
            </button>  
          </div>  
        </div>  
      </div>  
    `;  
  }  
}  
```

### Progress Template

```javascript
templates: {  
  progress: (current, total, tour) => {  
    const percentage = (current / total) * 100;  
    return `  
      <div class="walkthrough-progress-bar">  
        <div class="walkthrough-progress-fill" style="width: ${percentage}%"></div>  
        <span class="walkthrough-progress-text">${current} / ${total}</span>  
      </div>  
    `;  
  }  
}  
```

## Instance Methods

### Navigation Methods

```javascript
// Basic navigation  
tour.start()                     // Start the walkthrough  
tour.next()                      // Go to next step  
tour.prev()                      // Go to previous step  
tour.goTo(index)                 // Jump to specific step (0-based)  
tour.finish()                    // Complete the walkthrough  
tour.close()                     // Close without completing  
tour.destroy()                   // Clean up and remove  
  
// Advanced navigation  
tour.restart()                   // Restart from beginning  
tour.pause()                     // Pause the walkthrough  
tour.resume()                    // Resume paused walkthrough  
```

### State Methods

```javascript
// Current state  
tour.getCurrentStep()            // Get current step object  
tour.getCurrentIndex()           // Get current step index (0-based)  
tour.getTotalSteps()             // Get total number of steps  
tour.getProgress()               // Get progress percentage (0-100)  
  
// Status checks  
tour.isActive()                  // Check if walkthrough is running  
tour.isPaused()                  // Check if walkthrough is paused  
tour.isFinished()                // Check if walkthrough completed  
tour.canNext()                   // Check if can go to next step  
tour.canPrev()                   // Check if can go to previous step  
```

### Configuration Methods

```javascript
// Update options  
tour.setOptions(options)         // Update configuration options  
tour.getOptions()                // Get current options  
  
// Step management  
tour.addStep(step, index?)       // Add step at index (default: end)  
tour.removeStep(index)           // Remove step at index  
tour.updateStep(index, step)     // Update step at index  
tour.getStep(index)              // Get step at index  
```

### Event Methods

```javascript
// Event listeners  
tour.on(event, callback)         // Add event listener  
tour.off(event, callback?)       // Remove event listener  
tour.emit(event, ...args)        // Emit custom event  
  
// Available events  
tour.on('start', (tour) => {})  
tour.on('step', (step, index) => {})  
tour.on('next', (step, index) => {})  
tour.on('prev', (step, index) => {})  
tour.on('finish', (tour) => {})  
tour.on('close', (tour) => {})  
```

## Utility Methods

### Element Utilities

```javascript
// Element helpers  
walkthrough.utils.getElement(selector)     // Get DOM element  
walkthrough.utils.isVisible(element)       // Check if element visible  
walkthrough.utils.scrollToElement(element) // Scroll element into view  
walkthrough.utils.getElementPosition(element) // Get element position  
```

### Storage Utilities

```javascript
// Progress storage  
walkthrough.storage.save(key, data)       // Save to localStorage  
walkthrough.storage.load(key)             // Load from localStorage  
walkthrough.storage.remove(key)           // Remove from localStorage  
walkthrough.storage.clear()               // Clear all walkthrough data  
```

### Animation Utilities

```javascript
// Animation helpers  
walkthrough.animate.fadeIn(element, duration)  
walkthrough.animate.fadeOut(element, duration)  
walkthrough.animate.slideIn(element, direction, duration)  
walkthrough.animate.slideOut(element, direction, duration)  
```

## Error Handling

```javascript
try {  
  const tour = walkthrough.fromJSON(config);  
  tour.start();  
} catch (error) {  
  if (error instanceof walkthrough.WalkthroughError) {  
    console.error('Walkthrough error:', error.message);  
  } else {  
    console.error('Unexpected error:', error);  
  }  
}  
  
// Error types  
walkthrough.WalkthroughError         // Base error class  
walkthrough.ConfigurationError       // Configuration issues  
walkthrough.ElementNotFoundError     // Target element not found  
walkthrough.ValidationError          // Step validation failed 
```