/**
 * 성능 모니터링 및 메모리 누수 감지 유틸리티
 */

import React from 'react';

interface PerformanceMetrics {
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
  timestamp: number;
}

interface ComponentPerformance {
  renderCount: number;
  renderTime: number;
  mountTime: number;
  updateTime: number;
  unmountTime: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private componentMetrics: Map<string, ComponentPerformance> = new Map();
  private observers: PerformanceObserver[] = [];
  private memoryLeakThreshold = 50 * 1024 * 1024; // 50MB
  private isMonitoring = false;

  /**
   * 성능 모니터링 시작
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // Performance Observer 설정
    this.setupPerformanceObservers();

    // 메모리 사용량 추적
    this.startMemoryTracking();

    // Long Task 감지
    this.detectLongTasks();

    console.log('Performance monitoring started');
  }

  /**
   * 성능 모니터링 중지
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    console.log('Performance monitoring stopped');
  }

  /**
   * Performance Observer 설정
   */
  private setupPerformanceObservers(): void {
    // Navigation Timing
    if ('PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            console.log('Navigation performance:', {
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
            });
          });
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (e) {
        console.warn('Navigation observer not supported');
      }

      // Resource Timing
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 100) { // 100ms 이상 걸린 리소스만 로깅
              console.warn('Slow resource load:', {
                name: entry.name,
                duration: entry.duration,
                size: (entry as any).transferSize,
              });
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (e) {
        console.warn('Resource observer not supported');
      }

      // Layout Shift 감지
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (entry.value > 0.1) {
              console.warn('Layout shift detected:', {
                value: entry.value,
                sources: entry.sources,
              });
            }
          });
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutShiftObserver);
      } catch (e) {
        console.warn('Layout shift observer not supported');
      }
    }
  }

  /**
   * 메모리 사용량 추적
   */
  private startMemoryTracking(): void {
    if (!('memory' in performance)) {
      console.warn('Memory tracking not supported in this browser');
      return;
    }

    const trackMemory = () => {
      if (!this.isMonitoring) return;

      const memory = (performance as any).memory;
      const currentMetrics: PerformanceMetrics = {
        heapUsed: memory.usedJSHeapSize,
        heapTotal: memory.totalJSHeapSize,
        external: memory.jsHeapSizeLimit,
        arrayBuffers: 0,
        timestamp: Date.now(),
      };

      this.metrics.push(currentMetrics);

      // 최근 100개 메트릭만 유지
      if (this.metrics.length > 100) {
        this.metrics.shift();
      }

      // 메모리 누수 감지
      this.detectMemoryLeak();

      // 5초마다 체크
      setTimeout(trackMemory, 5000);
    };

    trackMemory();
  }

  /**
   * 메모리 누수 감지
   */
  private detectMemoryLeak(): void {
    if (this.metrics.length < 10) return;

    const recentMetrics = this.metrics.slice(-10);
    const oldestMetric = recentMetrics[0];
    const newestMetric = recentMetrics[recentMetrics.length - 1];

    const memoryIncrease = newestMetric.heapUsed - oldestMetric.heapUsed;
    const timeElapsed = newestMetric.timestamp - oldestMetric.timestamp;

    // 50초 동안 50MB 이상 증가하면 경고
    if (memoryIncrease > this.memoryLeakThreshold && timeElapsed > 50000) {
      console.error('Possible memory leak detected:', {
        increase: `${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`,
        timeElapsed: `${(timeElapsed / 1000).toFixed(2)} seconds`,
        currentUsage: `${(newestMetric.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      });
    }
  }

  /**
   * Long Task 감지
   */
  private detectLongTasks(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          console.warn('Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
            attribution: entry.attribution,
          });
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (e) {
      console.warn('Long task observer not supported');
    }
  }

  /**
   * 컴포넌트 성능 측정
   */
  measureComponent(componentName: string, phase: 'mount' | 'update' | 'unmount', duration: number): void {
    if (!this.componentMetrics.has(componentName)) {
      this.componentMetrics.set(componentName, {
        renderCount: 0,
        renderTime: 0,
        mountTime: 0,
        updateTime: 0,
        unmountTime: 0,
      });
    }

    const metrics = this.componentMetrics.get(componentName)!;
    
    switch (phase) {
      case 'mount':
        metrics.mountTime = duration;
        break;
      case 'update':
        metrics.updateTime = duration;
        metrics.renderCount++;
        metrics.renderTime += duration;
        break;
      case 'unmount':
        metrics.unmountTime = duration;
        break;
    }

    // 느린 렌더링 경고
    if (duration > 16) { // 60fps = 16.67ms per frame
      console.warn(`Slow ${phase} in ${componentName}: ${duration.toFixed(2)}ms`);
    }
  }

  /**
   * 성능 리포트 생성
   */
  generateReport(): object {
    const currentMemory = (performance as any).memory;
    const report = {
      memory: currentMemory ? {
        used: `${(currentMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(currentMemory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(currentMemory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
      } : 'Not supported',
      components: Array.from(this.componentMetrics.entries()).map(([name, metrics]) => ({
        name,
        renderCount: metrics.renderCount,
        avgRenderTime: metrics.renderCount > 0 ? (metrics.renderTime / metrics.renderCount).toFixed(2) : 0,
        mountTime: metrics.mountTime.toFixed(2),
        updateTime: metrics.updateTime.toFixed(2),
        unmountTime: metrics.unmountTime.toFixed(2),
      })),
      metrics: {
        firstContentfulPaint: this.getMetric('first-contentful-paint'),
        largestContentfulPaint: this.getMetric('largest-contentful-paint'),
        cumulativeLayoutShift: this.getCLS(),
        totalBlockingTime: this.getTBT(),
      },
    };

    console.log('Performance Report:', report);
    return report;
  }

  /**
   * 특정 메트릭 가져오기
   */
  private getMetric(name: string): string {
    const entries = performance.getEntriesByName(name, 'paint');
    if (entries.length > 0) {
      return `${entries[0].startTime.toFixed(2)}ms`;
    }
    return 'Not measured';
  }

  /**
   * Cumulative Layout Shift 계산
   */
  private getCLS(): number {
    let cls = 0;
    const entries = performance.getEntriesByType('layout-shift') as any[];
    entries.forEach(entry => {
      if (!entry.hadRecentInput) {
        cls += entry.value;
      }
    });
    return parseFloat(cls.toFixed(3));
  }

  /**
   * Total Blocking Time 계산
   */
  private getTBT(): string {
    const entries = performance.getEntriesByType('measure');
    let tbt = 0;
    entries.forEach(entry => {
      if (entry.duration > 50) {
        tbt += entry.duration - 50;
      }
    });
    return `${tbt.toFixed(2)}ms`;
  }

  /**
   * 메모리 사용량 체크
   */
  checkMemoryUsage(): void {
    if (!('memory' in performance)) {
      console.warn('Memory API not supported');
      return;
    }

    const memory = (performance as any).memory;
    const used = memory.usedJSHeapSize / 1024 / 1024;
    const total = memory.totalJSHeapSize / 1024 / 1024;
    const limit = memory.jsHeapSizeLimit / 1024 / 1024;

    console.log('Memory Usage:', {
      used: `${used.toFixed(2)} MB`,
      total: `${total.toFixed(2)} MB`,
      limit: `${limit.toFixed(2)} MB`,
      percentage: `${((used / limit) * 100).toFixed(2)}%`,
    });

    // 메모리 사용량이 80% 이상이면 경고
    if (used / limit > 0.8) {
      console.warn('High memory usage detected!');
    }
  }

  /**
   * 이벤트 리스너 추적
   */
  trackEventListeners(): void {
    const getEventListeners = (window as any).getEventListeners;
    if (!getEventListeners) {
      console.warn('Event listener tracking not supported');
      return;
    }

    const elements = document.querySelectorAll('*');
    let totalListeners = 0;

    elements.forEach(element => {
      const listeners = getEventListeners(element);
      const listenerCount = Object.keys(listeners).reduce((sum, event) => {
        return sum + listeners[event].length;
      }, 0);
      totalListeners += listenerCount;

      if (listenerCount > 10) {
        console.warn('Element with many listeners:', {
          element,
          count: listenerCount,
          events: Object.keys(listeners),
        });
      }
    });

    console.log('Total event listeners:', totalListeners);
  }
}

// 싱글톤 인스턴스
export const performanceMonitor = new PerformanceMonitor();

// React 컴포넌트를 위한 훅
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    const startTime = performance.now();
    performanceMonitor.measureComponent(componentName, 'mount', performance.now() - startTime);

    return () => {
      const unmountTime = performance.now();
      performanceMonitor.measureComponent(componentName, 'unmount', performance.now() - unmountTime);
    };
  }, [componentName]);

  const measureUpdate = (callback: () => void) => {
    const startTime = performance.now();
    callback();
    performanceMonitor.measureComponent(componentName, 'update', performance.now() - startTime);
  };

  return { measureUpdate };
}

// 개발 환경에서만 자동 시작
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.startMonitoring();
  
  // 30초마다 리포트 생성
  setInterval(() => {
    performanceMonitor.generateReport();
  }, 30000);
}

export default performanceMonitor;