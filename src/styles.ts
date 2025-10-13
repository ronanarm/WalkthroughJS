import { WalkthroughOptions } from './types';
import { adjustColor } from './utils';

/**
 * Generate CSS styles for the walkthrough
 */
export function generateStyles(options: Required<WalkthroughOptions>): string {
  return `
    .wt-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: ${options.zIndex};
      opacity: 0;
      visibility: hidden;
      transition: opacity ${options.animationDuration}ms ease;
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
      transition: all ${options.animationDuration}ms ease;
      box-shadow: 0 0 0 99999px ${options.overlayColor};
      background: transparent;
      pointer-events: none;
      z-index: ${options.zIndex};
    }
    .wt-popup {
      position: absolute;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: ${options.zIndex + 1};
      max-width: ${options.popupWidth}px;
      opacity: 0;
      transform: scale(0.9);
      transition: all ${options.animationDuration}ms ease;
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
      background: ${options.progressColor};
      border-radius: 2px;
      transition: width ${options.animationDuration}ms ease;
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
      background: ${options.progressColor};
      color: white;
    }
    .wt-btn-next:hover, .wt-btn-finish:hover {
      background: ${adjustColor(options.progressColor, -20)};
    }
    .wt-btn-group {
      display: flex;
      gap: 12px;
    }
  `;
}
