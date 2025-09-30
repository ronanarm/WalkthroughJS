/**
 * Walkthrough.js - Advanced Tutorial/Walkthrough Library
 * Lightweight, powerful, and flexible with multiple configuration methods
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Walkthrough = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    class Walkthrough {
        constructor(options = {}) {
            this.steps = [];
            this.currentStep = 0;
            this.isActive = false;
            this.callbacks = {};
            this.templates = {};

            // Default options
            this.options = {
                // Visual
                overlayColor: 'rgba(0, 0, 0, 0.5)',
                highlightPadding: 10,
                animationDuration: 300,
                scrollDuration: 500,
                scrollOffset: 100,
                zIndex: 99999,

                // Popup configuration
                popupWidth: 380,
                popupOffset: 15,
                popupClass: 'wt-popup',

                // Progress
                showProgress: true,
                progressColor: '#4CAF50',

                // Buttons
                showButtons: true,
                showSkip: true,
                skipText: 'Skip',
                prevText: '← Previous',
                nextText: 'Next →',
                finishText: 'Finish',

                // Keyboard navigation
                keyboard: true,
                escapeToExit: true,
                arrowNavigation: true,

                // Storage
                cookieName: 'walkthrough_progress',
                cookieExpiry: 30, // days
                rememberProgress: false,

                // Behavior
                closeOnOverlay: true,
                autoStart: false,
                startDelay: 0,

                // Attribute names for HTML config
                attributePrefix: 'wt',
                stepAttribute: 'step',
                titleAttribute: 'title',
                textAttribute: 'text',
                positionAttribute: 'position',

                ...options
            };

            this.elements = {};
            this.init();
        }

        init() {
            this.createElements();
            this.bindEvents();

            // Auto-start if configured
            if (this.options.autoStart) {
                setTimeout(() => {
                    this.scanForAttributeSteps();
                    if (this.steps.length > 0) {
                        this.start();
                    }
                }, this.options.startDelay);
            }
        }

        createElements() {
            // Main overlay
            const overlay = document.createElement('div');
            overlay.className = 'wt-overlay';
            overlay.innerHTML = `
                <style>
                    .wt-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        /* Height will be set dynamically */
                        z-index: ${this.options.zIndex};
                        opacity: 0;
                        visibility: hidden;
                        transition: opacity ${this.options.animationDuration}ms ease;
                        pointer-events: none;
                    }
                    .wt-overlay.active {
                        opacity: 1;
                        visibility: visible;
                        pointer-events: none;
                    }
                    .wt-highlight {
                        position: absolute;
                        border-radius: 8px;
                        transition: all ${this.options.animationDuration}ms ease;
                        box-shadow: 0 0 0 99999px ${this.options.overlayColor};
                        background: transparent;
                        pointer-events: none;
                        z-index: ${this.options.zIndex};
                    }
                    .wt-popup {
                        position: absolute;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                        z-index: ${this.options.zIndex + 1};
                        max-width: ${this.options.popupWidth}px;
                        opacity: 0;
                        transform: scale(0.9);
                        transition: all ${this.options.animationDuration}ms ease;
                        pointer-events: auto;
                    }
                    .wt-popup.active {
                        opacity: 1;
                        transform: scale(1);
                    }
                    .wt-popup-arrow {
                        position: absolute;
                        width: 0;
                        height: 0;
                        border-style: solid;
                        border-color: transparent;
                    }
                    .wt-popup-arrow.top {
                        bottom: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        border-width: 0 10px 10px 10px;
                        border-bottom-color: white;
                    }
                    .wt-popup-arrow.bottom {
                        top: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        border-width: 10px 10px 0 10px;
                        border-top-color: white;
                    }
                    .wt-popup-arrow.left {
                        right: 100%;
                        top: 50%;
                        transform: translateY(-50%);
                        border-width: 10px 10px 10px 0;
                        border-right-color: white;
                    }
                    .wt-popup-arrow.right {
                        left: 100%;
                        top: 50%;
                        transform: translateY(-50%);
                        border-width: 10px 0 10px 10px;
                        border-left-color: white;
                    }
                    .wt-popup-content {
                        padding: 24px;
                    }
                    .wt-popup-header {
                        margin-bottom: 16px;
                    }
                    .wt-popup-title {
                        font-size: 20px;
                        font-weight: 600;
                        color: #1a1a1a;
                        margin: 0 0 8px 0;
                        line-height: 1.3;
                    }
                    .wt-popup-step-count {
                        font-size: 12px;
                        color: #666;
                        font-weight: 500;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .wt-popup-body {
                        font-size: 15px;
                        line-height: 1.6;
                        color: #444;
                        margin-bottom: 20px;
                    }
                    .wt-progress {
                        height: 4px;
                        background: #e0e0e0;
                        border-radius: 2px;
                        overflow: hidden;
                        margin-bottom: 20px;
                    }
                    .wt-progress-bar {
                        height: 100%;
                        background: ${this.options.progressColor};
                        border-radius: 2px;
                        transition: width ${this.options.animationDuration}ms ease;
                    }
                    .wt-popup-footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .wt-btn {
                        padding: 10px 20px;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        border: none;
                        outline: none;
                    }
                    .wt-btn:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    }
                    .wt-btn:active {
                        transform: translateY(0);
                    }
                    .wt-btn-skip {
                        background: none;
                        color: #666;
                        padding: 10px;
                    }
                    .wt-btn-skip:hover {
                        color: #333;
                        background: rgba(0,0,0,0.05);
                    }
                    .wt-btn-prev {
                        background: #f5f5f5;
                        color: #666;
                        border: 1px solid #ddd;
                    }
                    .wt-btn-prev:hover {
                        background: #e8e8e8;
                    }
                    .wt-btn-next, .wt-btn-finish {
                        background: ${this.options.progressColor};
                        color: white;
                    }
                    .wt-btn-next:hover, .wt-btn-finish:hover {
                        background: ${this.adjustColor(this.options.progressColor, -20)};
                    }
                    .wt-btn-group {
                        display: flex;
                        gap: 12px;
                    }
                </style>
            `;

            // Highlight element
            const highlight = document.createElement('div');
            highlight.className = 'wt-highlight';

            // Popup element
            const popup = document.createElement('div');
            popup.className = this.options.popupClass;

            // Append elements
            overlay.appendChild(highlight);
            overlay.appendChild(popup);
            document.body.appendChild(overlay);

            // Store references
            this.elements = {
                overlay,
                highlight,
                popup
            };
        }

        bindEvents() {
            // Overlay click
            if (this.options.closeOnOverlay) {
                this.elements.overlay.addEventListener('click', (e) => {
                    if (e.target === this.elements.overlay) {
                        this.end();
                    }
                });
            }

            // Keyboard navigation
            if (this.options.keyboard) {
                this.keyHandler = (e) => {
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

            // Add scroll and resize handler for layout changes
            this.positionHandler = () => {
                if (this.isActive && this.currentStep < this.steps.length) {
                    this.positionElements();
                }
            };
            this.throttledPositionHandler = this.throttle(this.positionHandler, 100);
            window.addEventListener('resize', this.throttledPositionHandler);
            // The scroll handler is now mainly for edge cases like lazy-loaded content changing page height
            window.addEventListener('scroll', this.throttledPositionHandler, true);
        }

        // Scan DOM for attribute-based configuration
        scanForAttributeSteps() {
            const prefix = this.options.attributePrefix;
            const stepAttr = `data-${prefix}-${this.options.stepAttribute}`;
            const elements = document.querySelectorAll(`[${stepAttr}]`);

            const steps = Array.from(elements).map(el => {
                const step = parseInt(el.getAttribute(stepAttr));
                const title = el.getAttribute(`data-${prefix}-${this.options.titleAttribute}`);
                const text = el.getAttribute(`data-${prefix}-${this.options.textAttribute}`);
                const position = el.getAttribute(`data-${prefix}-${this.options.positionAttribute}`);

                return {
                    element: el,
                    step: step,
                    title: title,
                    text: text,
                    position: position
                };
            });

            // Sort by step number
            steps.sort((a, b) => a.step - b.step);

            this.steps = steps;
        }

        // Configure with JSON
        configure(config) {
            if (config.steps) {
                this.steps = config.steps.map(step => {
                    if (typeof step.element === 'string') {
                        step.element = document.querySelector(step.element);
                    }
                    return step;
                });
            }

            if (config.options) {
                Object.assign(this.options, config.options);
            }

            if (config.callbacks) {
                this.callbacks = { ...this.callbacks, ...config.callbacks };
            }

            if (config.templates) {
                this.templates = { ...this.templates, ...config.templates };
            }
        }

        // Start walkthrough
        start(stepIndex = null) {
            if (this.steps.length === 0) {
                console.warn('Walkthrough: No steps configured');
                return;
            }
            
            // MODIFICATION: Set the overlay height to match the document
            this.elements.overlay.style.height = `${document.documentElement.scrollHeight}px`;

            // Check for saved progress
            if (stepIndex === null && this.options.rememberProgress) {
                stepIndex = this.loadProgress();
            }

            this.currentStep = stepIndex || 0;
            this.isActive = true;

            // Trigger callback
            this.triggerCallback('onStart');

            // Show overlay
            this.elements.overlay.classList.add('active');

            // Show current step
            setTimeout(() => {
                this.showStep(this.currentStep);
            }, 50);
        }

        // Show specific step
        showStep(index) {
            if (index < 0 || index >= this.steps.length) return;
            
            this.elements.popup.classList.remove('active');

            const step = this.steps[index];
            this.currentStep = index;

            // Save progress
            if (this.options.rememberProgress) {
                this.saveProgress(index);
            }

            // Trigger callback
            this.triggerCallback('onStep', step, index);

            // Scroll to element
            if (step.element) {
                this.scrollToElement(step.element, () => {
                    // Position elements
                    this.positionElements();

                    // Update popup content
                    this.updatePopup(step, index);

                    // Show popup
                    setTimeout(() => {
                        this.elements.popup.classList.add('active');
                    }, 50); 
                });
            }
        }

        // Position highlight and popup
        positionElements() {
            const step = this.steps[this.currentStep];
            if (!step || !step.element) return;
            
            // MODIFICATION: Update overlay height on reposition in case document size changed
            this.elements.overlay.style.height = `${document.documentElement.scrollHeight}px`;

            const element = step.element;
            const rect = element.getBoundingClientRect();
            const padding = this.options.highlightPadding;
            
            // MODIFICATION: Calculate position relative to the document, not viewport
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

            // Position highlight
            const highlight = this.elements.highlight;
            highlight.style.left = `${rect.left + scrollLeft - padding}px`;
            highlight.style.top = `${rect.top + scrollTop - padding}px`;
            highlight.style.width = `${rect.width + padding * 2}px`;
            highlight.style.height = `${rect.height + padding * 2}px`;

            // Position popup
            this.positionPopup(rect, step.position);
        }

        // Position popup relative to target
        positionPopup(targetRect, preferredPosition) {
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
                height: window.innerHeight
            };

            // Determine best position (relative to viewport for fitting logic)
            const positions = {
                bottom: {
                    left: targetRect.left + targetRect.width / 2 - popupRect.width / 2,
                    top: targetRect.bottom + padding + offset,
                    arrow: 'top',
                    fits: targetRect.bottom + padding + offset + popupRect.height < viewport.height
                },
                top: {
                    left: targetRect.left + targetRect.width / 2 - popupRect.width / 2,
                    top: targetRect.top - padding - offset - popupRect.height,
                    arrow: 'bottom',
                    fits: targetRect.top - padding - offset - popupRect.height > 0
                },
                right: {
                    left: targetRect.right + padding + offset,
                    top: targetRect.top + targetRect.height / 2 - popupRect.height / 2,
                    arrow: 'left',
                    fits: targetRect.right + padding + offset + popupRect.width < viewport.width
                },
                left: {
                    left: targetRect.left - padding - offset - popupRect.width,
                    top: targetRect.top + targetRect.height / 2 - popupRect.height / 2,
                    arrow: 'right',
                    fits: targetRect.left - padding - offset - popupRect.width > 0
                }
            };
            
            let position = preferredPosition && positions[preferredPosition] ?.fits ?
                preferredPosition :
                Object.keys(positions).find(pos => positions[pos].fits) || 'bottom';

            const chosen = positions[position];
            
            // MODIFICATION: Adjust final position with scroll offset to be page-relative
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            const finalLeft = Math.max(10, Math.min(chosen.left, viewport.width - popupRect.width - 10)) + scrollLeft;
            const finalTop = Math.max(10, Math.min(chosen.top, viewport.height - popupRect.height - 10)) + scrollTop;

            popup.style.left = `${finalLeft}px`;
            popup.style.top = `${finalTop}px`;

            this.updateArrow(chosen.arrow);
        }

        // Update arrow direction
        updateArrow(direction) {
            const popup = this.elements.popup;
            const existingArrow = popup.querySelector('.wt-popup-arrow');
            if (existingArrow) {
                existingArrow.remove();
            }

            const arrow = document.createElement('div');
            arrow.className = `wt-popup-arrow ${direction}`;
            popup.appendChild(arrow);
        }

        // Update popup content
        updatePopup(step, index) {
            const popup = this.elements.popup;
            const isFirst = index === 0;
            const isLast = index === this.steps.length - 1;

            let content;
            if (this.templates.popup) {
                content = this.templates.popup(step, index, this.steps.length);
            } else {
                content = this.getDefaultPopupContent(step, index, isFirst, isLast);
            }

            popup.innerHTML = content;

            this.bindPopupButtons();
        }

        // Default popup content
        getDefaultPopupContent(step, index, isFirst, isLast) {
            return `
                <div class="wt-popup-content">
                    ${step.title || this.options.showProgress ? `
                        <div class="wt-popup-header">
                            ${step.title ? `<h3 class="wt-popup-title">${step.title}</h3>` : ''}
                            ${this.options.showProgress ? `
                                <div class="wt-popup-step-count">
                                    Step ${index + 1} of ${this.steps.length}
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}

                    ${step.text ? `
                        <div class="wt-popup-body">
                            ${step.text}
                        </div>
                    ` : ''}

                    ${this.options.showProgress ? `
                        <div class="wt-progress">
                            <div class="wt-progress-bar" style="width: ${((index + 1) / this.steps.length) * 100}%"></div>
                        </div>
                    ` : ''}

                    ${this.options.showButtons ? `
                        <div class="wt-popup-footer">
                            ${this.options.showSkip ? `
                                <button class="wt-btn wt-btn-skip" data-wt-action="skip">
                                    ${step.skipText || this.options.skipText}
                                </button>
                            ` : '<div></div>'}

                            <div class="wt-btn-group">
                                ${!isFirst ? `
                                    <button class="wt-btn wt-btn-prev" data-wt-action="prev">
                                        ${step.prevText || this.options.prevText}
                                    </button>
                                ` : ''}

                                <button class="wt-btn ${isLast ? 'wt-btn-finish' : 'wt-btn-next'}"
                                        data-wt-action="${isLast ? 'finish' : 'next'}">
                                    ${isLast ? (step.finishText || this.options.finishText) : (step.nextText || this.options.nextText)}
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // Bind popup button events
        bindPopupButtons() {
            const popup = this.elements.popup;

            popup.querySelectorAll('[data-wt-action]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = e.currentTarget.getAttribute('data-wt-action');
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

        // Navigate to next step
        next() {
            if (this.currentStep < this.steps.length - 1) {
                this.showStep(this.currentStep + 1);
            } else {
                 this.finish();
            }
        }

        // Navigate to previous step
        prev() {
            if (this.currentStep > 0) {
                this.showStep(this.currentStep - 1);
            }
        }

        // Finish walkthrough
        finish() {
            this.triggerCallback('onFinish');
            this.clearProgress();
            this.end();
        }

        // End walkthrough
        end() {
            if (!this.isActive) return;

            this.isActive = false;
            this.triggerCallback('onEnd');

            this.elements.popup.classList.remove('active');

            setTimeout(() => {
                this.elements.overlay.classList.remove('active');
            }, this.options.animationDuration);
        }

        // Scroll to element
        scrollToElement(element, callback) {
            const rect = element.getBoundingClientRect();
            
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                 callback();
                 return;
            }

            const offset = this.options.scrollOffset;
            const targetY = window.pageYOffset + rect.top - offset;

            const startY = window.pageYOffset;
            const diff = targetY - startY;
            const duration = this.options.scrollDuration;
            let start;

            const scroll = (timestamp) => {
                if (!start) start = timestamp;
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);

                window.scrollTo(0, startY + diff * this.easeInOut(progress));

                if (elapsed < duration) {
                    requestAnimationFrame(scroll);
                } else {
                    callback();
                }
            };

            requestAnimationFrame(scroll);
        }

        // Easing function
        easeInOut(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        // Cookie management
        saveProgress(step) {
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + this.options.cookieExpiry);
            document.cookie = `${this.options.cookieName}=${step};expires=${expiry.toUTCString()};path=/`;
        }

        loadProgress() {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === this.options.cookieName) {
                    return parseInt(value) || 0;
                }
            }
            return 0;
        }

        clearProgress() {
            document.cookie = `${this.options.cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
        }

        // Trigger callback
        triggerCallback(name, ...args) {
            if (typeof this.callbacks[name] === 'function') {
                this.callbacks[name](...args);
            }
        }
        
        // Throttle utility
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }

        // Utility: Adjust color brightness
        adjustColor(color, amount) {
            const usePound = color[0] === '#';
            const col = usePound ? color.slice(1) : color;
            const num = parseInt(col, 16);
            let r = (num >> 16) + amount;
            let g = ((num >> 8) & 0x00FF) + amount;
            let b = (num & 0x0000FF) + amount;
            r = r > 255 ? 255 : r < 0 ? 0 : r;
            g = g > 255 ? 255 : g < 0 ? 0 : g;
            b = b > 255 ? 255 : b < 0 ? 0 : b;
            return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
        }

        // Public API
        destroy() {
            // Remove event listeners
            if (this.keyHandler) {
                document.removeEventListener('keydown', this.keyHandler);
            }
            if (this.throttledPositionHandler) {
                window.removeEventListener('resize', this.throttledPositionHandler);
                window.removeEventListener('scroll', this.throttledPositionHandler, true);
            }

            // Remove elements
            if (this.elements.overlay) {
                this.elements.overlay.remove();
            }

            // Clear data
            this.steps = [];
            this.currentStep = 0;
            this.isActive = false;
        }
    }

    return Walkthrough;
}));

// Convenience functions (unchanged)
window.walkthrough = {
    fromAttributes: function(options = {}) {
        const wt = new Walkthrough(options);
        wt.scanForAttributeSteps();
        return wt;
    },
    fromJSON: function(config) {
        const wt = new Walkthrough(config.options || {});
        wt.configure(config);
        return wt;
    },
    start: function(steps, options = {}) {
        const wt = new Walkthrough(options);
        wt.configure({
            steps
        });
        wt.start();
        return wt;
    }
};