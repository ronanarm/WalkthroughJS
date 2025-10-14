/**
 * Position options for popup placement
 */
export type PopupPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Keyboard action types
 */
export type KeyboardAction = 'next' | 'prev' | 'exit';

/**
 * Step configuration
 */
export interface WalkthroughStep {
  /** Target element selector or HTMLElement */
  element: string | HTMLElement;
  /** Step title */
  title?: string;
  /** Step description text */
  text?: string;
  /** Preferred popup position */
  position?: PopupPosition;
  /** Step number (used for attribute-based configuration) */
  step?: number;
  /** Custom skip button text */
  skipText?: string;
  /** Custom previous button text */
  prevText?: string;
  /** Custom next button text */
  nextText?: string;
  /** Custom finish button text */
  finishText?: string;
}

/**
 * Walkthrough configuration options
 */
export interface WalkthroughOptions {
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

/**
 * Callback functions
 */
export interface WalkthroughCallbacks {
  /** Called when walkthrough starts */
  onStart?: () => void;
  /** Called on each step */
  onStep?: (step: WalkthroughStep, index: number) => void;
  /** Called when walkthrough finishes normally */
  onFinish?: () => void;
  /** Called when walkthrough ends (finish or skip) */
  onEnd?: () => void;
}

/**
 * Template functions
 */
export interface WalkthroughTemplates {
  /** Custom popup template */
  popup?: (step: WalkthroughStep, index: number, totalSteps: number) => string;
}

/**
 * Complete configuration object for JSON-based setup
 */
export interface WalkthroughConfig {
  steps?: WalkthroughStep[];
  options?: WalkthroughOptions;
  callbacks?: WalkthroughCallbacks;
  templates?: WalkthroughTemplates;
}

/**
 * Internal DOM elements
 */
export interface WalkthroughElements {
  overlay: HTMLDivElement;
  highlight: HTMLDivElement;
  popup: HTMLDivElement;
}

/**
 * Position calculation result
 */
export interface PositionInfo {
  left: number;
  top: number;
  arrow: PopupPosition;
  fits: boolean;
}
