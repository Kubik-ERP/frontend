// import {} from './index';

export interface IStaffProvided {
  staff_searchQuery: Ref<string>;
  staff_isLoading: Ref<boolean>;

  staff_filterTitle: Ref<string>;
  staff_filterPermission: Ref<string>;

  staff_onSearchData: (searchData: string) => Promise<void>;
  staff_onFilterData: (filterTitleData: string, filterPermissionData: string) => Promise<void>;
}
