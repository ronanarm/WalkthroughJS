/**
 * WalkthroughJS - TypeScript Edition
 * Lightweight, powerful walkthrough library with zero dependencies
 */

export { Core } from './core';
export type {
  WalkthroughOptions,
  WalkthroughStep,
  WalkthroughCallbacks,
  WalkthroughTemplates,
  WalkthroughConfig,
  PopupPosition,
} from './types';

import { Core } from './core';
import { WalkthroughOptions, WalkthroughStep, WalkthroughConfig } from './types';

/**
 * Convenience API for creating walkthroughs
 */
export const walkthrough = {
  /**
   * Create walkthrough from HTML attributes
   */
  fromAttributes(options?: WalkthroughOptions): Core {
    const wt = new Core(options);
    wt.scanForAttributeSteps();
    return wt;
  },

  /**
   * Create walkthrough from JSON configuration
   */
  fromJSON(config: WalkthroughConfig): Core {
    const wt = new Core(config.options);
    wt.configure(config);
    return wt;
  },

  /**
   * Quick start a walkthrough
   */
  start(steps: WalkthroughStep[], options?: WalkthroughOptions): Core {
    const wt = new Core(options);
    wt.configure({ steps });
    wt.start();
    return wt;
  },
};

// Make available globally for browser usage
if (typeof window !== 'undefined') {
  (window as unknown as { Walkthrough: typeof Core }).Walkthrough = Core;
  (window as unknown as { walkthrough: typeof walkthrough }).walkthrough = walkthrough;
}
