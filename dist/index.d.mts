/**
 * Position options for popup placement
 */
type PopupPosition = 'top' | 'bottom' | 'left' | 'right';
/**
 * Step configuration
 */
interface WalkthroughStep {
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
interface WalkthroughOptions {
    overlayColor?: string;
    highlightPadding?: number;
    animationDuration?: number;
    scrollDuration?: number;
    scrollOffset?: number;
    zIndex?: number;
    popupWidth?: number;
    popupOffset?: number;
    popupClass?: string;
    showProgress?: boolean;
    progressColor?: string;
    showButtons?: boolean;
    showSkip?: boolean;
    skipText?: string;
    prevText?: string;
    nextText?: string;
    finishText?: string;
    keyboard?: boolean;
    escapeToExit?: boolean;
    arrowNavigation?: boolean;
    cookieName?: string;
    cookieExpiry?: number;
    rememberProgress?: boolean;
    closeOnOverlay?: boolean;
    autoStart?: boolean;
    startDelay?: number;
    attributePrefix?: string;
    stepAttribute?: string;
    titleAttribute?: string;
    textAttribute?: string;
    positionAttribute?: string;
}
/**
 * Callback functions
 */
interface WalkthroughCallbacks {
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
interface WalkthroughTemplates {
    /** Custom popup template */
    popup?: (step: WalkthroughStep, index: number, totalSteps: number) => string;
}
/**
 * Complete configuration object for JSON-based setup
 */
interface WalkthroughConfig {
    steps?: WalkthroughStep[];
    options?: WalkthroughOptions;
    callbacks?: WalkthroughCallbacks;
    templates?: WalkthroughTemplates;
}

/**
 * Main Walkthrough class
 */
declare class Core {
    private steps;
    private currentStep;
    private isActive;
    private callbacks;
    private templates;
    private options;
    private elements;
    private keyHandler?;
    private positionHandler?;
    private throttledPositionHandler?;
    constructor(options?: WalkthroughOptions);
    /**
     * Initialize the walkthrough
     */
    private init;
    /**
     * Create DOM elements
     */
    private createElements;
    /**
     * Bind event listeners
     */
    private bindEvents;
    /**
     * Scan DOM for attribute-based steps
     */
    scanForAttributeSteps(): void;
    /**
     * Configure walkthrough with JSON
     */
    configure(config: WalkthroughConfig): void;
    /**
     * Start the walkthrough
     */
    start(stepIndex?: number | null): void;
    /**
     * Show a specific step
     */
    private showStep;
    /**
     * Position highlight and popup elements
     */
    private positionElements;
    /**
     * Position popup relative to target element
     */
    private positionPopup;
    /**
     * Update arrow direction
     */
    private updateArrow;
    /**
     * Update popup content
     */
    private updatePopup;
    /**
     * Get default popup content
     */
    private getDefaultPopupContent;
    /**
     * Bind popup button events
     */
    private bindPopupButtons;
    /**
     * Navigate to next step
     */
    next(): void;
    /**
     * Navigate to previous step
     */
    prev(): void;
    /**
     * Finish the walkthrough
     */
    finish(): void;
    /**
     * End the walkthrough
     */
    end(): void;
    /**
     * Save progress to cookie
     */
    private saveProgress;
    /**
     * Load progress from cookie
     */
    private loadProgress;
    /**
     * Clear saved progress
     */
    private clearProgress;
    /**
     * Trigger callback function
     */
    private triggerCallback;
    /**
     * Destroy the walkthrough and clean up
     */
    destroy(): void;
}

/**
 * WalkthroughJS - TypeScript Edition
 * Lightweight, powerful walkthrough library with zero dependencies
 */

/**
 * Convenience API for creating walkthroughs
 */
declare const walkthrough: {
    /**
     * Create walkthrough from HTML attributes
     */
    fromAttributes(options?: WalkthroughOptions): Core;
    /**
     * Create walkthrough from JSON configuration
     */
    fromJSON(config: WalkthroughConfig): Core;
    /**
     * Quick start a walkthrough
     */
    start(steps: WalkthroughStep[], options?: WalkthroughOptions): Core;
};

export { Core, type PopupPosition, type WalkthroughCallbacks, type WalkthroughConfig, type WalkthroughOptions, type WalkthroughStep, type WalkthroughTemplates, walkthrough };
