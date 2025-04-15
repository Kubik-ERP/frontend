// Constants
import { OUTLET_LIST_REQUEST } from '../constants';

// Interfaces
import type { IOutlet, IOutletListProvided, IOutletListResponse } from '../interfaces';

// Store
import { useOutletStore } from '../store';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useOutletListService = (): IOutletListProvided => {
  /**
   * @description Injected variables
   */
  const router = useRouter();
  const store = useOutletStore(); // Instance of the store
  const { outlet_isLoading, outlet_lists } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const outletList_selectedOutlet = ref<IOutlet | null>(null);

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
   * @description Handle business logic for set dynamic class of selected outlet
   */
  const outletList_dynamicClassOfSelectedOutlet = (outlet: IOutlet) => {
    if (outletList_selectedOutlet.value?.id === outlet.id) {
      return 'border border-solid border-primary-border bg-primary-background outlet-selecter-shadow';
    }

    return '';
  };

  /**
   * @description Handle business logic for event click button continue
   */
  const outletList_onContinue = (): void => {
    router.push({ name: 'dashboard' });
  };

  /**
   * @description Handle business logic for selecting outlet
   */
  const outletList_onSelectOutlet = (outlet: IOutlet) => {
    outletList_selectedOutlet.value = outlet;
  };

  return {
    outletList_onContinue,
    outletList_dynamicClassOfSelectedOutlet,
    outletList_fetchOutletLists,
    outletList_isLoading: outlet_isLoading,
    outletList_lists: outlet_lists,
    outletList_onSelectOutlet,
    outletList_selectedOutlet,
  };
};
