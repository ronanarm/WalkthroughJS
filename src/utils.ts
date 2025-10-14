/**
 * Utility functions for Walkthrough
 */

/**
 * Easing function for smooth animations
 */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Throttle function to limit execution frequency
 */
export function throttle<T extends (...args: never[]) => void>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Adjust color brightness
 */
export function adjustColor(color: string, amount: number): string {
  const usePound = color[0] === '#';
  const col = usePound ? color.slice(1) : color;
  const num = parseInt(col, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;
  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;
  return (usePound ? '#' : '') + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

/**
 * Save data to cookie
 */
export function setCookie(name: string, value: string, days: number): void {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  document.cookie = `${name}=${value};expires=${expiry.toUTCString()};path=/`;
}

/**
 * Get data from cookie
 */
export function getCookie(name: string): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, value] = cookie.trim().split('=');
    if (cookieName === name) {
      return value;
    }
  }
  return null;
}

/**
 * Delete cookie
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

/**
 * Scroll to element smoothly
 */
export function scrollToElement(
  element: HTMLElement,
  offset: number,
  duration: number,
  callback: () => void,
): void {
  const rect = element.getBoundingClientRect();

  if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
    callback();
    return;
  }

  const targetY = window.pageYOffset + rect.top - offset;
  const startY = window.pageYOffset;
  const diff = targetY - startY;
  let start: number;

  const scroll = (timestamp: number) => {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);

    window.scrollTo(0, startY + diff * easeInOut(progress));

    if (elapsed < duration) {
      requestAnimationFrame(scroll);
    } else {
      callback();
    }
  };

  requestAnimationFrame(scroll);
}
