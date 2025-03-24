// Store / Pinia
import { useStaffStore } from '../store';

// interfaces
import type { IStaffProvided } from '../interfaces/staff-service';

// Vue
import { ref } from 'vue';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useStaffService = (): IStaffProvided => {
  /**
   * @description Injected variables
   */
  const store = useStaffStore();

  /**
   * @description Reactive data binding
   */
  const staff_searchQuery = ref<string>('');
  const staff_isLoading = ref<boolean>(false);
  const staff_filterTitle = ref<string>('');
  const staff_filterPermission = ref<string>('');

  /**
   * @description Handle fetch api staff search. We call the fetchStaffSearch function from the store to handle the request.
   */
  const staff_onSearchData = async (searchData: string): Promise<void> => {
    staff_searchQuery.value = searchData;
    staff_isLoading.value = true;
    await store.staff_fetchSearch(searchData);
    staff_isLoading.value = false;
  };

  const staff_onFilterData = async (filterTitleData: string, filterPermissionData: string): Promise<void> => {
    staff_filterTitle.value = filterTitleData;
    staff_filterPermission.value = filterPermissionData;
    staff_isLoading.value = true;
    await store.staff_fetchFilter(filterTitleData, filterPermissionData);
    staff_isLoading.value = false;
  };

  return {
    staff_searchQuery,
    staff_isLoading,
    staff_filterTitle,
    staff_filterPermission,
    staff_onSearchData,
    staff_onFilterData,
  };
}

