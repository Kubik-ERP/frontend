import { createApp } from 'vue';
import App from './App.vue';

// MITT
import { Emitter } from 'mitt';

// Configurations
import components from './app/components';
import loadAllRoutes from './app/router';
import pinia from './app/store';
import autoLoadLocalization from './plugins/i18n';

// Socket
import SocketPlugin from './plugins/socket/index';

// Plugins
import eventBus from './plugins/mitt';

// Primevue
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import FocusTrap from 'primevue/focustrap';

// Stylesheets
import 'primeicons/primeicons.css';
import './style.css';

// SVG Icons
import 'virtual:svg-icons-register';

// RBAC Directive
import { installRbacDirective } from './app/directives/rbac.directive';

// Loading Store
import { useLoadingStore } from './app/store/loading.store';

const initialize = async () => {
  const app = createApp(App);

  // Setup pinia first so we can use stores
  app.use(pinia);

  // Get loading store instance
  const loadingStore = useLoadingStore();

  // Set initial progress
  loadingStore.setInitializationProgress(10);

  // Load localization
  const localization = await autoLoadLocalization();
  loadingStore.setInitializationProgress(30);

  // Load router
  const router = await loadAllRoutes();
  loadingStore.setInitializationProgress(50);

  /**
   * @description Initialize primevue and set the configurations on it
   */
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: 'class',
        cssLayer: {
          name: 'primevue',
          order: 'theme, base, primevue',
        },
      },
    },
  });
  loadingStore.setInitializationProgress(60);

  // Use everything what we have
  app.use(localization);
  loadingStore.setInitializationProgress(70);

  app.use(router);
  loadingStore.setInitializationProgress(80);

  app.use(SocketPlugin);
  loadingStore.setInitializationProgress(85);

  // Register global event bus
  app.provide<Emitter<IBusEvent>>('eventBus', eventBus);
  loadingStore.setInitializationProgress(90);

  // Register global components
  components(app);
  loadingStore.setInitializationProgress(95);

  // Register RBAC directive
  installRbacDirective(app);
  loadingStore.setInitializationProgress(98);

  // Register FocusTrap directive
  app.directive('focustrap', FocusTrap);

  // Mount app
  app.mount('#main-content');
  loadingStore.setInitializationProgress(100);

  // Complete initialization after a short delay to ensure everything is rendered
  setTimeout(() => {
    loadingStore.completeInitialization();
  }, 200);
};

(async () => {
  await initialize();
})();
