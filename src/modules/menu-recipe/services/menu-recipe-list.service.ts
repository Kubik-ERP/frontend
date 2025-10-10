// Constants
import { MENU_RECIPE_LIST_COLUMNS, MENU_RECIPE_LIST_VALUES } from "../constants";

// Interfaces
import { IMenuRecipeListQueryParams, IMenuRecipeListProvided } from "../interfaces";

// Plugins
import eventBus from '@/plugins/mitt';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useMenuRecipeListService = (): IMenuRecipeListProvided => {
  /**
   * @description Reactive data binding
   */
  const menuRecipeList_queryParams = reactive<IMenuRecipeListQueryParams>({
    page: 1,
    perPage: 10,
    search: '',
    orderBy: 'updatedAt',
    orderDirection: 'desc'
  });

  /**
   * @description Handle business logic for showing pop up confirmation delete recipe
   */
  const menuRecipeList_onShowDialogDelete = (id: string) => {
    console.log(id);
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'menu-recipe-list-dialog-delete',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            This action will stop the current recording and discard any unsaved or draft data.
          </p>
        </div>`,
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        eventBus.emit('AppBaseDialog', { id: 'menu-recipe-list-dialog-delete', isOpen: false });
      },
      onClickButtonSecondary: () => {
        // Logic to delete the table goes here
        eventBus.emit('AppBaseDialog', { id: 'menu-recipe-list-dialog-delete', isOpen: false });
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete',
      title: 'Delete Recipe',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  }

  return {
    menuRecipeList_columns: MENU_RECIPE_LIST_COLUMNS,
    menuRecipeList_onShowDialogDelete,
    menuRecipeList_queryParams,
    menuRecipeList_values: MENU_RECIPE_LIST_VALUES,
  }
}