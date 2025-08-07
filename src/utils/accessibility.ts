/**
 * Accessibility utilities and helpers
 */

/**
 * Announces message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Manages focus trap within a container
 */
export class FocusTrap {
  private container: HTMLElement;
  private focusableElements: HTMLElement[];
  private firstFocusableElement: HTMLElement | null;
  private lastFocusableElement: HTMLElement | null;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.focusableElements = this.getFocusableElements();
    this.firstFocusableElement = this.focusableElements[0] || null;
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1] || null;
  }
  
  private getFocusableElements(): HTMLElement[] {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    
    return Array.from(this.container.querySelectorAll(focusableSelectors));
  }
  
  activate(): void {
    this.container.addEventListener('keydown', this.handleKeyDown);
    this.firstFocusableElement?.focus();
  }
  
  deactivate(): void {
    this.container.removeEventListener('keydown', this.handleKeyDown);
  }
  
  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusableElement) {
        e.preventDefault();
        this.lastFocusableElement?.focus();
      }
    } else {
      if (document.activeElement === this.lastFocusableElement) {
        e.preventDefault();
        this.firstFocusableElement?.focus();
      }
    }
  };
}

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Gets appropriate animation duration based on user preference
 */
export function getAnimationDuration(defaultDuration: number): number {
  return prefersReducedMotion() ? 0 : defaultDuration;
}

/**
 * Creates unique ID for accessibility attributes
 */
export function generateId(prefix: string = 'a11y'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Keyboard navigation helper
 */
export function handleArrowKeyNavigation(
  e: KeyboardEvent,
  currentIndex: number,
  totalItems: number,
  onNavigate: (newIndex: number) => void,
  options: {
    vertical?: boolean;
    wrap?: boolean;
  } = {}
): void {
  const { vertical = false, wrap = false } = options;
  const previousKey = vertical ? 'ArrowUp' : 'ArrowLeft';
  const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
  
  let newIndex = currentIndex;
  
  switch (e.key) {
    case previousKey:
      e.preventDefault();
      newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = wrap ? totalItems - 1 : 0;
      }
      break;
      
    case nextKey:
      e.preventDefault();
      newIndex = currentIndex + 1;
      if (newIndex >= totalItems) {
        newIndex = wrap ? 0 : totalItems - 1;
      }
      break;
      
    case 'Home':
      e.preventDefault();
      newIndex = 0;
      break;
      
    case 'End':
      e.preventDefault();
      newIndex = totalItems - 1;
      break;
      
    default:
      return;
  }
  
  if (newIndex !== currentIndex) {
    onNavigate(newIndex);
  }
}

/**
 * High contrast mode detection
 */
export function isHighContrastMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  const testElement = document.createElement('div');
  testElement.style.backgroundColor = 'rgb(255, 255, 255)';
  testElement.style.display = 'none';
  document.body.appendChild(testElement);
  
  const computedStyle = window.getComputedStyle(testElement);
  const isHighContrast = computedStyle.backgroundColor !== 'rgb(255, 255, 255)';
  
  document.body.removeChild(testElement);
  return isHighContrast;
}

/**
 * Live region manager for dynamic content updates
 */
export class LiveRegionManager {
  private region: HTMLElement;
  
  constructor(priority: 'polite' | 'assertive' = 'polite') {
    this.region = document.createElement('div');
    this.region.setAttribute('role', 'status');
    this.region.setAttribute('aria-live', priority);
    this.region.setAttribute('aria-atomic', 'true');
    this.region.className = 'sr-only'; // Visually hidden class
    document.body.appendChild(this.region);
  }
  
  announce(message: string): void {
    this.region.textContent = message;
    
    // Clear after a delay to allow re-announcement of same message
    setTimeout(() => {
      this.region.textContent = '';
    }, 100);
  }
  
  destroy(): void {
    document.body.removeChild(this.region);
  }
}