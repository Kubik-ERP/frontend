import { useLoadingStore } from '@/app/store/loading.store';

interface IUseGlobalLoadingOptions {
  /**
   * @description Minimum loading time in milliseconds to prevent flickering
   */
  minLoadingTime?: number;
  /**
   * @description Custom request identifier
   */
  requestId?: string;
  /**
   * @description Whether to automatically manage loading state for promises
   */
  autoManage?: boolean;
}

interface IUseGlobalLoadingReturn {
  /**
   * @description Current loading state
   */
  isLoading: ComputedRef<boolean>;
  /**
   * @description Active requests count
   */
  activeRequestsCount: ComputedRef<number>;
  /**
   * @description Start tracking a request manually
   */
  startLoading: (requestId?: string) => string;
  /**
   * @description Stop tracking a request manually
   */
  stopLoading: (requestId: string) => void;
  /**
   * @description Wrap a promise with automatic loading management
   */
  withLoading: <T>(promise: Promise<T>, options?: IUseGlobalLoadingOptions) => Promise<T>;
  /**
   * @description Clear all active requests
   */
  clearAllLoading: () => void;
  /**
   * @description Force set loading state
   */
  setLoading: (loading: boolean) => void;
}

/**
 * @description Composable for managing global loading state across the application
 */
export const useGlobalLoading = (options: IUseGlobalLoadingOptions = {}): IUseGlobalLoadingReturn => {
  const { minLoadingTime = 300 } = options;
  const loadingStore = useLoadingStore();

  const isLoading = computed(() => loadingStore.isLoading);
  const activeRequestsCount = computed(() => loadingStore.activeRequestsCount);

  /**
   * @description Start tracking a request
   */
  const startLoading = (requestId?: string): string => {
    return loadingStore.startRequest(requestId);
  };

  /**
   * @description Stop tracking a request with minimum loading time
   */
  const stopLoading = async (requestId: string): Promise<void> => {
    if (minLoadingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, minLoadingTime));
    }
    loadingStore.endRequest(requestId);
  };

  /**
   * @description Wrap a promise with automatic loading management
   */
  const withLoading = async <T>(
    promise: Promise<T>,
    promiseOptions: IUseGlobalLoadingOptions = {},
  ): Promise<T> => {
    const { requestId: customRequestId, minLoadingTime: customMinTime } = promiseOptions;
    const requestId = startLoading(customRequestId);
    const startTime = Date.now();

    try {
      const result = await promise;

      // Ensure minimum loading time
      const elapsed = Date.now() - startTime;
      const minTime = customMinTime ?? minLoadingTime;

      if (minTime > elapsed) {
        await new Promise(resolve => setTimeout(resolve, minTime - elapsed));
      }

      loadingStore.endRequest(requestId);
      return result;
    } catch (error) {
      // Still ensure minimum loading time even on error
      const elapsed = Date.now() - startTime;
      const minTime = customMinTime ?? minLoadingTime;

      if (minTime > elapsed) {
        await new Promise(resolve => setTimeout(resolve, minTime - elapsed));
      }

      loadingStore.endRequest(requestId);
      throw error;
    }
  };

  /**
   * @description Clear all active requests
   */
  const clearAllLoading = (): void => {
    loadingStore.clearAllRequests();
  };

  /**
   * @description Force set loading state
   */
  const setLoading = (loading: boolean): void => {
    loadingStore.setLoading(loading);
  };

  return {
    isLoading,
    activeRequestsCount,
    startLoading,
    stopLoading,
    withLoading,
    clearAllLoading,
    setLoading,
  };
};
