// Constants
import { MENU_RECIPE_LIST_COLUMNS, MENU_RECIPE_LIST_REQUEST, MENU_RECIPE_DELETE_REQUEST } from '../constants';

// Interfaces
import type { DataTableSortEvent } from 'primevue';
import type { IMenuRecipeListQueryParams, IMenuRecipeListProvided } from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useMenuRecipeStore } from '../store';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useMenuRecipeListService = (): IMenuRecipeListProvided => {
  /**
   * @description Injected variables
   */
  const store = useMenuRecipeStore(); // Instance of the store
  const { httpAbort_registerAbort } = useHttpAbort();
  const { menuRecipe_isLoading, menuRecipe_lists } = storeToRefs(store);

  /**
   * @description Reactive data binding
   */
  const menuRecipeList_queryParams = reactive<IMenuRecipeListQueryParams>({
    page: 1,
    pageSize: 10,
    search: '',
    orderBy: 'updated_at',
    orderDirection: 'desc',
  });

  /**
   * @description Handle fetch api menu recipe - list
   */
  const menuRecipeList_fetchList = async (): Promise<unknown> => {
    try {
      await store.menuRecipe_list(menuRecipeList_queryParams, {
        ...httpAbort_registerAbort(MENU_RECIPE_LIST_REQUEST),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle on sort change for data table
   */
  const menuRecipeList_handleOnSortChange = (event: DataTableSortEvent): void => {
    if (event.sortField && event.sortOrder) {
      menuRecipeList_queryParams.orderBy = event.sortField as string;
      menuRecipeList_queryParams.orderDirection = event.sortOrder === 1 ? 'asc' : 'desc';
      menuRecipeList_fetchList();
    }
  };

  /**
   * @description Handle on page change for pagination
   */
  const menuRecipeList_onChangePage = (page: number): void => {
    menuRecipeList_queryParams.page = page;
    menuRecipeList_fetchList();
  };

  /**
   * @description Handle business logic for showing pop up confirmation delete recipe
   */
  const menuRecipeList_onShowDialogCancel = (id: string) => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'menu-recipe-list-dialog-delete',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            This action will permanently delete this recipe and cannot be undone.
          </p>
        </div>`,
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        eventBus.emit('AppBaseDialog', { id: 'menu-recipe-list-dialog-delete', isOpen: false });
      },
      onClickButtonSecondary: async () => {
        try {
          await store.menuRecipe_delete(id, {
            ...httpAbort_registerAbort(MENU_RECIPE_DELETE_REQUEST),
          });
          eventBus.emit('AppBaseDialog', { id: 'menu-recipe-list-dialog-delete', isOpen: false });
          await menuRecipeList_fetchList(); // Refresh list after delete
        } catch (error) {
          console.error('Error deleting recipe:', error);
          eventBus.emit('AppBaseDialog', { id: 'menu-recipe-list-dialog-delete', isOpen: false });
        }
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete',
      title: 'Delete Recipe',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  return {
    menuRecipeList_columns: MENU_RECIPE_LIST_COLUMNS,
    menuRecipeList_fetchList,
    menuRecipeList_handleOnSortChange,
    menuRecipeList_isLoading: menuRecipe_isLoading,
    menuRecipeList_onChangePage,
    menuRecipeList_onShowDialogCancel,
    menuRecipeList_queryParams,
    menuRecipeList_values: menuRecipe_lists,
  };
};
