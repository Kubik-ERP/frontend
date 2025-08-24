import { defineStore } from 'pinia';

interface IMobileState {
  isSidebarOpen: boolean;
  isMobile: boolean;
}

export const useMobileStore = defineStore('mobile', {
  state: (): IMobileState => ({
    isSidebarOpen: false,
    isMobile: false,
  }),

  getters: {
    /**
     * @description Check if we're in mobile view
     */
    isCurrentlyMobile: (state): boolean => state.isMobile,

    /**
     * @description Check if sidebar should be shown as overlay
     */
    shouldShowOverlay: (state): boolean => state.isMobile && state.isSidebarOpen,
  },

  actions: {
    /**
     * @description Toggle sidebar visibility on mobile
     */
    toggleSidebar(): void {
      this.isSidebarOpen = !this.isSidebarOpen;
    },

    /**
     * @description Close sidebar (useful for mobile when clicking outside)
     */
    closeSidebar(): void {
      this.isSidebarOpen = false;
    },

    /**
     * @description Open sidebar
     */
    openSidebar(): void {
      this.isSidebarOpen = true;
    },

    /**
     * @description Set mobile state based on screen size
     */
    setMobileState(isMobile: boolean): void {
      this.isMobile = isMobile;
      // Close sidebar when switching to desktop
      if (!isMobile) {
        this.isSidebarOpen = false;
      }
    },

    /**
     * @description Initialize mobile detection
     */
    initializeMobileDetection(): () => void {
      const checkMobile = () => {
        const isMobile = window.innerWidth < 1024; // lg breakpoint
        this.setMobileState(isMobile);
      };

      // Initial check
      checkMobile();

      // Listen for resize events
      window.addEventListener('resize', checkMobile);

      // Return cleanup function
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    },
  },
});
