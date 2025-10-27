// Constants
import { OUTLET_LIST_REQUEST } from '../constants';
import { EToastPosition, EToastType } from '@/app/constants';

// Interfaces
import type { IOutlet, IOutletListProvided, IOutletListResponse } from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Services
import { useAuthenticationSignInService } from '@/modules/authentication/services/authentication-sign-in.service';

// Store
import { useOutletStore } from '../store';
import { useAuthenticationStore } from '@/modules/authentication/store';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useOutletListService = (): IOutletListProvided => {
  /**
   * @description Injected variables
   */
  const router = useRouter();
  const store = useOutletStore(); // Instance of the store
  const authStore = useAuthenticationStore(); // Instance of the authentication store
  const { authenticationSignIn_fetchAuthenticationPermissions } = useAuthenticationSignInService();
  const { outlet_isLoading, outlet_lists, outlet_currentOutlet } = storeToRefs(store);
  const { authentication_userData } = storeToRefs(authStore);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const outletList_selectedOutlet = ref<IOutlet | null>(null);

  /**
   * @description Handle business logic for set dynamic class of selected outlet
   */
  const outletList_dynamicClassOfSelectedOutlet = (outlet: IOutlet) => {
    if (outletList_selectedOutlet.value?.id === outlet.id) {
      return 'bg-secondary outlet-selecter-shadow';
    }

    return '';
  };

  /**
   * @description Handle fetch api outlet. We call the fetchOutlet_lists function from the store to handle the request.
   */
  const outletList_fetchOutletLists = async (): Promise<IOutletListResponse> => {
    try {
      const result = await store.fetchOutlet_lists({
        ...httpAbort_registerAbort(OUTLET_LIST_REQUEST),
      });

      return Promise.resolve(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for event click button continue
   */
  const outletList_onContinue = async (): Promise<void> => {
    await authenticationSignIn_fetchAuthenticationPermissions();
    router.push({ name: 'dashboard' });
  };

  /**
   * @description Handle business logic for navigating to create new store with validation
   */
  const outletList_onNavigateToCreateStore = (): void => {
    if (outletList_validateStoreLimit()) {
      router.push({ name: 'outlet.create' });
    }
  };

  /**
   * @description Handle business logic for selecting outlet
   */
  const outletList_onSelectOutlet = (outlet: IOutlet) => {
    outletList_selectedOutlet.value = outlet;
    outlet_currentOutlet.value = outlet;
  };

  /**
   * @description Handle business logic for validating store limit before creating new store
   * @returns boolean - true if can create new store, false if limit reached
   */
  const outletList_validateStoreLimit = (): boolean => {
    // Check if user data exists
    if (!authentication_userData.value) {
      eventBus.emit('AppBaseToast', {
        isOpen: true,
        message: 'Unable to verify your account. Please refresh the page and try again.',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.DANGER,
      });
      return false;
    }

    const currentStoreCount = outlet_lists.value.items.length;
    const storeLimit = authentication_userData.value.limitStore || 0;

    if (currentStoreCount >= storeLimit) {
      // Show toast error message
      eventBus.emit('AppBaseToast', {
        isOpen: true,
        message: `You have reached the maximum limit of ${storeLimit} store${storeLimit > 1 ? 's' : ''}. Please upgrade your plan to add more stores.`,
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.DANGER,
      });
      return false;
    }

    return true;
  };

  return {
    outletList_dynamicClassOfSelectedOutlet,
    outletList_fetchOutletLists,
    outletList_isLoading: outlet_isLoading,
    outletList_lists: outlet_lists,
    outletList_onContinue,
    outletList_onNavigateToCreateStore,
    outletList_onSelectOutlet,
    outletList_selectedOutlet,
  };
};
