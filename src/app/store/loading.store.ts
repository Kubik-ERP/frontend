import { defineStore } from 'pinia';

interface ILoadingState {
  isLoading: boolean;
  activeRequests: Set<string>;
  requestCounter: number;
}

export const useLoadingStore = defineStore('loading', {
  state: (): ILoadingState => ({
    isLoading: false,
    activeRequests: new Set(),
    requestCounter: 0,
  }),

  getters: {
    /**
     * @description Check if there are any active requests
     */
    hasActiveRequests: (state): boolean => state.activeRequests.size > 0,

    /**
     * @description Get the count of active requests
     */
    activeRequestsCount: (state): number => state.activeRequests.size,
  },

  actions: {
    /**
     * @description Start tracking a new request
     */
    startRequest(requestId?: string): string {
      this.requestCounter += 1;
      const id = requestId || `req_${this.requestCounter}_${Date.now()}`;
      this.activeRequests.add(id);
      this.isLoading = true;
      return id;
    },

    /**
     * @description Stop tracking a request
     */
    endRequest(requestId: string): void {
      this.activeRequests.delete(requestId);
      this.isLoading = this.activeRequests.size > 0;
    },

    /**
     * @description Clear all active requests (useful for navigation)
     */
    clearAllRequests(): void {
      this.activeRequests.clear();
      this.isLoading = false;
    },

    /**
     * @description Force set loading state (useful for manual control)
     */
    setLoading(loading: boolean): void {
      this.isLoading = loading;
      if (!loading) {
        this.activeRequests.clear();
      }
    },
  },
});
