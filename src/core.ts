import {
  WalkthroughOptions,
  WalkthroughStep,
  WalkthroughCallbacks,
  WalkthroughTemplates,
  WalkthroughConfig,
  WalkthroughElements,
  PopupPosition,
  PositionInfo,
} from './types';
import { throttle, scrollToElement, setCookie, getCookie, deleteCookie } from './utils';
import { generateStyles } from './styles';

/**
 * Default options for Walkthrough
 */
const DEFAULT_OPTIONS: Required<WalkthroughOptions> = {
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
  positionAttribute: 'position',
};

/**
 * Main Walkthrough class
 */
export class Core {
  private steps: WalkthroughStep[] = [];
  private currentStep = 0;
  private isActive = false;
  private callbacks: WalkthroughCallbacks = {};
  private templates: WalkthroughTemplates = {};
  private options: Required<WalkthroughOptions>;
  private elements!: WalkthroughElements;
  private keyHandler?: (e: KeyboardEvent) => void;
  private positionHandler?: () => void;
  private throttledPositionHandler?: () => void;

  constructor(options: WalkthroughOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.init();
  }

  /**
   * Initialize the walkthrough
   */
  private init(): void {
    this.createElements();
    this.bindEvents();

    if (this.options.autoStart) {
      setTimeout(() => {
        this.scanForAttributeSteps();
        if (this.steps.length > 0) {
          this.start();
        }
      }, this.options.startDelay);
    }
  }

  /**
   * Create DOM elements
   */
  private createElements(): void {
    const overlay = document.createElement('div');
    overlay.className = 'wt-overlay';

    const style = document.createElement('style');
    style.textContent = generateStyles(this.options);
    overlay.appendChild(style);

    const highlight = document.createElement('div');
    highlight.className = 'wt-highlight';

    const popup = document.createElement('div');
    popup.className = this.options.popupClass;

    overlay.appendChild(highlight);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    this.elements = { overlay, highlight, popup };
  }

  /**
   * Bind event listeners
   */
  private bindEvents(): void {
    if (this.options.closeOnOverlay) {
      this.elements.overlay.addEventListener('click', (e) => {
        if (e.target === this.elements.overlay) {
          this.end();
        }
      });
    }

    if (this.options.keyboard) {
      this.keyHandler = (e: KeyboardEvent) => {
        if (!this.isActive) return;

        if (this.options.escapeToExit && e.key === 'Escape') {
          this.end();
        } else if (this.options.arrowNavigation) {
          if (e.key === 'ArrowRight' || e.key === 'Enter') {
            this.next();
          } else if (e.key === 'ArrowLeft') {
            this.prev();
          }
        }
      };
      document.addEventListener('keydown', this.keyHandler);
    }

    this.positionHandler = () => {
      if (this.isActive && this.currentStep < this.steps.length) {
        this.positionElements();
      }
    };
    this.throttledPositionHandler = throttle(this.positionHandler, 100);
    window.addEventListener('resize', this.throttledPositionHandler);
    window.addEventListener('scroll', this.throttledPositionHandler, true);
  }

  /**
   * Scan DOM for attribute-based steps
   */
  public scanForAttributeSteps(): void {
    const prefix = this.options.attributePrefix;
    const stepAttr = `data-${prefix}-${this.options.stepAttribute}`;
    const elements = document.querySelectorAll<HTMLElement>(`[${stepAttr}]`);

    const steps = Array.from(elements).map((el) => {
      const step = parseInt(el.getAttribute(stepAttr) || '0', 10);
      const title = el.getAttribute(`data-${prefix}-${this.options.titleAttribute}`) || undefined;
      const text = el.getAttribute(`data-${prefix}-${this.options.textAttribute}`) || undefined;
      const position =
        (el.getAttribute(`data-${prefix}-${this.options.positionAttribute}`) as PopupPosition) ||
        undefined;

      return {
        element: el,
        step,
        title,
        text,
        position,
      };
    });

    steps.sort((a, b) => (a.step || 0) - (b.step || 0));
    this.steps = steps;
  }

  /**
   * Configure walkthrough with JSON
   */
  public configure(config: WalkthroughConfig): void {
    if (config.steps) {
      this.steps = config.steps.map((step) => {
        if (typeof step.element === 'string') {
          const el = document.querySelector<HTMLElement>(step.element);
          if (!el) {
            throw new Error(`Element not found: ${step.element}`);
          }
          return { ...step, element: el };
        }
        return step;
      });
    }

    if (config.options) {
      this.options = { ...this.options, ...config.options };
    }

    if (config.callbacks) {
      this.callbacks = { ...this.callbacks, ...config.callbacks };
    }

    if (config.templates) {
      this.templates = { ...this.templates, ...config.templates };
    }
  }

  /**
   * Start the walkthrough
   */
  public start(stepIndex?: number | null): void {
    if (this.steps.length === 0) {
      console.warn('Walkthrough: No steps configured');
      return;
    }

    this.elements.overlay.style.height = `${document.documentElement.scrollHeight}px`;

    if (stepIndex === null || stepIndex === undefined) {
      if (this.options.rememberProgress) {
        stepIndex = this.loadProgress();
      } else {
        stepIndex = 0;
      }
    }

    this.currentStep = stepIndex;
    this.isActive = true;

    this.triggerCallback('onStart');
    this.elements.overlay.classList.add('active');

    setTimeout(() => {
      this.showStep(this.currentStep);
    }, 50);
  }

  /**
   * Show a specific step
   */
  private showStep(index: number): void {
    if (index < 0 || index >= this.steps.length) return;

    this.elements.popup.classList.remove('active');

    const step = this.steps[index];
    this.currentStep = index;

    if (this.options.rememberProgress) {
      this.saveProgress(index);
    }

    this.triggerCallback('onStep', step, index);

    const element =
      typeof step.element === 'string'
        ? document.querySelector<HTMLElement>(step.element)
        : step.element;

    if (element) {
      scrollToElement(element, this.options.scrollOffset, this.options.scrollDuration, () => {
        this.positionElements();
        this.updatePopup(step, index);
        setTimeout(() => {
          this.elements.popup.classList.add('active');
        }, 50);
      });
    }
  }

  /**
   * Position highlight and popup elements
   */
  private positionElements(): void {
    const step = this.steps[this.currentStep];
    if (!step) return;

    const element =
      typeof step.element === 'string'
        ? document.querySelector<HTMLElement>(step.element)
        : step.element;

    if (!element) return;

    this.elements.overlay.style.height = `${document.documentElement.scrollHeight}px`;

    const rect = element.getBoundingClientRect();
    const padding = this.options.highlightPadding;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    const highlight = this.elements.highlight;
    highlight.style.left = `${rect.left + scrollLeft - padding}px`;
    highlight.style.top = `${rect.top + scrollTop - padding}px`;
    highlight.style.width = `${rect.width + padding * 2}px`;
    highlight.style.height = `${rect.height + padding * 2}px`;

    this.positionPopup(rect, step.position);
  }

  /**
   * Position popup relative to target element
   */
  private positionPopup(targetRect: DOMRect, preferredPosition?: PopupPosition): void {
    const popup = this.elements.popup;
    popup.style.visibility = 'hidden';
    popup.style.display = 'block';
    const popupRect = popup.getBoundingClientRect();
    popup.style.visibility = '';
    popup.style.display = '';

    const offset = this.options.popupOffset;
    const padding = this.options.highlightPadding;

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const positions: Record<PopupPosition, PositionInfo> = {
      bottom: {
        left: targetRect.left + targetRect.width / 2 - popupRect.width / 2,
        top: targetRect.bottom + padding + offset,
        arrow: 'top',
        fits: targetRect.bottom + padding + offset + popupRect.height < viewport.height,
      },
      top: {
        left: targetRect.left + targetRect.width / 2 - popupRect.width / 2,
        top: targetRect.top - padding - offset - popupRect.height,
        arrow: 'bottom',
        fits: targetRect.top - padding - offset - popupRect.height > 0,
      },
      right: {
        left: targetRect.right + padding + offset,
        top: targetRect.top + targetRect.height / 2 - popupRect.height / 2,
        arrow: 'left',
        fits: targetRect.right + padding + offset + popupRect.width < viewport.width,
      },
      left: {
        left: targetRect.left - padding - offset - popupRect.width,
        top: targetRect.top + targetRect.height / 2 - popupRect.height / 2,
        arrow: 'right',
        fits: targetRect.left - padding - offset - popupRect.width > 0,
      },
    };

    const position: PopupPosition =
      preferredPosition && positions[preferredPosition]?.fits
        ? preferredPosition
        : (Object.keys(positions).find(
            (pos) => positions[pos as PopupPosition].fits,
          ) as PopupPosition) || 'bottom';

    const chosen = positions[position];

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    const finalLeft =
      Math.max(10, Math.min(chosen.left, viewport.width - popupRect.width - 10)) + scrollLeft;
    const finalTop =
      Math.max(10, Math.min(chosen.top, viewport.height - popupRect.height - 10)) + scrollTop;

    popup.style.left = `${finalLeft}px`;
    popup.style.top = `${finalTop}px`;

    this.updateArrow(chosen.arrow);
  }

  /**
   * Update arrow direction
   */
  private updateArrow(direction: PopupPosition): void {
    const popup = this.elements.popup;
    const existingArrow = popup.querySelector('.wt-popup-arrow');
    existingArrow?.remove();

    const arrow = document.createElement('div');
    arrow.className = `wt-popup-arrow ${direction}`;
    popup.appendChild(arrow);
  }

  /**
   * Update popup content
   */
  private updatePopup(step: WalkthroughStep, index: number): void {
    const popup = this.elements.popup;
    const isFirst = index === 0;
    const isLast = index === this.steps.length - 1;

    let content: string;
    if (this.templates.popup) {
      content = this.templates.popup(step, index, this.steps.length);
    } else {
      content = this.getDefaultPopupContent(step, index, isFirst, isLast);
    }

    popup.innerHTML = content;
    this.bindPopupButtons();
  }

  /**
   * Get default popup content
   */
  private getDefaultPopupContent(
    step: WalkthroughStep,
    index: number,
    isFirst: boolean,
    isLast: boolean,
  ): string {
    return `
      <div class="wt-popup-content">
        ${
          step.title || this.options.showProgress
            ? `
          <div class="wt-popup-header">
            ${step.title ? `<h3 class="wt-popup-title">${step.title}</h3>` : ''}
            ${
              this.options.showProgress
                ? `
              <div class="wt-popup-step-count">
                Step ${index + 1} of ${this.steps.length}
              </div>
            `
                : ''
            }
          </div>
        `
            : ''
        }

        ${
          step.text
            ? `
          <div class="wt-popup-body">
            ${step.text}
          </div>
        `
            : ''
        }

        ${
          this.options.showProgress
            ? `
          <div class="wt-progress">
            <div class="wt-progress-bar" style="width: ${((index + 1) / this.steps.length) * 100}%"></div>
          </div>
        `
            : ''
        }

        ${
          this.options.showButtons
            ? `
          <div class="wt-popup-footer">
            ${
              this.options.showSkip
                ? `
              <button class="wt-btn wt-btn-skip" data-wt-action="skip">
                ${step.skipText || this.options.skipText}
              </button>
            `
                : '<div></div>'
            }

            <div class="wt-btn-group">
              ${
                !isFirst
                  ? `
                <button class="wt-btn wt-btn-prev" data-wt-action="prev">
                  ${step.prevText || this.options.prevText}
                </button>
              `
                  : ''
              }

              <button class="wt-btn ${isLast ? 'wt-btn-finish' : 'wt-btn-next'}"
                      data-wt-action="${isLast ? 'finish' : 'next'}">
                ${isLast ? step.finishText || this.options.finishText : step.nextText || this.options.nextText}
              </button>
            </div>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  /**
   * Bind popup button events
   */
  private bindPopupButtons(): void {
    const popup = this.elements.popup;

    popup.querySelectorAll<HTMLButtonElement>('[data-wt-action]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const action = (e.currentTarget as HTMLElement).getAttribute('data-wt-action');
        switch (action) {
          case 'skip':
            this.end();
            break;
          case 'prev':
            this.prev();
            break;
          case 'next':
            this.next();
            break;
          case 'finish':
            this.finish();
            break;
        }
      });
    });
  }

  /**
   * Navigate to next step
   */
  public next(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.showStep(this.currentStep + 1);
    } else {
      this.finish();
    }
  }

  /**
   * Navigate to previous step
   */
  public prev(): void {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  }

  /**
   * Finish the walkthrough
   */
  public finish(): void {
    this.triggerCallback('onFinish');
    this.clearProgress();
    this.end();
  }

  /**
   * End the walkthrough
   */
  public end(): void {
    if (!this.isActive) return;

    this.isActive = false;
    this.triggerCallback('onEnd');

    this.elements.popup.classList.remove('active');

    setTimeout(() => {
      this.elements.overlay.classList.remove('active');
    }, this.options.animationDuration);
  }

  /**
   * Save progress to cookie
   */
  private saveProgress(step: number): void {
    setCookie(this.options.cookieName, step.toString(), this.options.cookieExpiry);
  }

  /**
   * Load progress from cookie
   */
  private loadProgress(): number {
    const value = getCookie(this.options.cookieName);
    return value ? parseInt(value, 10) || 0 : 0;
  }

  /**
   * Clear saved progress
   */
  private clearProgress(): void {
    deleteCookie(this.options.cookieName);
  }

  /**
   * Trigger callback function
   */
  private triggerCallback(name: keyof WalkthroughCallbacks, ...args: unknown[]): void {
    const callback = this.callbacks[name];
    if (typeof callback === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      (callback as (...args: unknown[]) => void)(...args);
    }
  }

  /**
   * Destroy the walkthrough and clean up
   */
  public destroy(): void {
    if (this.keyHandler) {
      document.removeEventListener('keydown', this.keyHandler);
    }
    if (this.throttledPositionHandler) {
      window.removeEventListener('resize', this.throttledPositionHandler);
      window.removeEventListener('scroll', this.throttledPositionHandler, true);
    }

    this.elements.overlay?.remove();

    this.steps = [];
    this.currentStep = 0;
    this.isActive = false;
  }
}
