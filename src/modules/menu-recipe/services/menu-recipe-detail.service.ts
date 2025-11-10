// Constants
import {
  MENU_RECIPE_DETAIL_LIST_INGREDIENTS_COLUMNS,
  MENU_RECIPE_DETAIL_FETCH_REQUEST,
  MENU_RECIPE_DETAIL_DELETE_REQUEST,
  MENU_RECIPE_DETAIL_FETCH_VERSIONS_REQUEST,
  MENU_RECIPE_DETAIL_FETCH_VERSION_DETAIL_REQUEST,
} from '../constants';
import { EToastType, EToastPosition } from '@/app/constants';

// Interfaces
import type { IMenuRecipeDetailProvided } from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useMenuRecipeStore } from '../store';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useMenuRecipeDetailService = (): IMenuRecipeDetailProvided => {
  /**
   * @description Injected variables
   */
  const router = useRouter();
  const route = useRoute();
  const store = useMenuRecipeStore();
  const { menuRecipe_selectedData, menuRecipe_isLoading, menuRecipe_versions } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const menuRecipeDetail_selectedVersionId = ref<string | null>(null);

  /**
   * @description Handle fetch api menu recipe - detail
   */
  const menuRecipeDetail_fetchDetails = async (): Promise<unknown> => {
    if (!route.params.id) {
      return Promise.reject(new Error('Menu recipe ID is required'));
    }

    try {
      await store.menuRecipe_detail(String(route.params.id), {
        ...httpAbort_registerAbort(MENU_RECIPE_DETAIL_FETCH_REQUEST),
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
   * @description Handle fetch api menu recipe - delete
   */
  const menuRecipeDetail_fetchDelete = async (): Promise<unknown> => {
    if (!route.params.id) {
      return Promise.reject(new Error('Menu recipe ID is required'));
    }

    try {
      await store.menuRecipe_delete(String(route.params.id), {
        ...httpAbort_registerAbort(MENU_RECIPE_DETAIL_DELETE_REQUEST),
      });

      // Show success toast
      eventBus.emit('AppBaseToast', {
        isOpen: true,
        message: 'Recipe deleted successfully!',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.SUCCESS,
      });

      // Navigate back to list after successful delete
      router.push({ name: 'menu-recipe.index' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api menu recipe - detail version
   */
  const menuRecipeDetail_fetchVersionDetail = async (versionId: string): Promise<unknown> => {
    if (!route.params.id) {
      return Promise.reject(new Error('Menu recipe ID is required'));
    }

    try {
      await store.menuRecipe_detailVersion(String(route.params.id), versionId, {
        ...httpAbort_registerAbort(MENU_RECIPE_DETAIL_FETCH_VERSION_DETAIL_REQUEST),
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
   * @description Handle fetch api menu recipe - list versions
   */
  const menuRecipeDetail_fetchVersions = async (): Promise<unknown> => {
    if (!route.params.id) {
      return Promise.reject(new Error('Menu recipe ID is required'));
    }

    try {
      await store.menuRecipe_listVersions(String(route.params.id), {
        ...httpAbort_registerAbort(MENU_RECIPE_DETAIL_FETCH_VERSIONS_REQUEST),
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
   * @description Handle load initial data
   */
  const menuRecipeDetail_onLoadInitialData = async (): Promise<void> => {
    await menuRecipeDetail_fetchDetails();
    await menuRecipeDetail_fetchVersions();
  };

  /**
   * @description Handle business logic for back to previous page
   */
  const menuRecipeDetail_onBack = (): void => {
    router.back();
  };

  /**
   * @description Handle business logic for edit menu recipe
   */
  const menuRecipeDetail_onEdit = (): void => {
    router.push({
      name: 'menu-recipe.edit',
      params: { id: route.params.id },
    });
  };

  /**
   * @description Handle reset selected version to current version
   */
  const menuRecipeDetail_onResetToCurrentVersion = (): void => {
    menuRecipeDetail_selectedVersionId.value = null;
    // Refetch current recipe data
    menuRecipeDetail_fetchDetails();
  };

  /**
   * @description Handle on select version
   */
  const menuRecipeDetail_onSelectVersion = (versionId: string): void => {
    menuRecipeDetail_selectedVersionId.value = versionId;
    menuRecipeDetail_fetchVersionDetail(versionId);
  };

  /**
   * @description Handle business logic for showing dialog delete confirmation
   */
  const menuRecipeDetail_onShowDialogDeleteConfirmation = (): void => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'menu-recipe-detail-dialog-delete',
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
        eventBus.emit('AppBaseDialog', { id: 'menu-recipe-detail-dialog-delete', isOpen: false });
      },
      onClickButtonSecondary: async () => {
        try {
          await menuRecipeDetail_fetchDelete();
          eventBus.emit('AppBaseDialog', { id: 'menu-recipe-detail-dialog-delete', isOpen: false });
        } catch (error) {
          console.error('Error deleting recipe:', error);
          eventBus.emit('AppBaseDialog', { id: 'menu-recipe-detail-dialog-delete', isOpen: false });
        }
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle business logic for canceling dialog delete confirmation
   */
  const menuRecipeDetail_onCancelDialogDeleteConfirmation = (): void => {
    eventBus.emit('AppBaseDialog', { id: 'menu-recipe-detail-dialog-delete', isOpen: false });
  };

  return {
    menuRecipeDetail_data: menuRecipe_selectedData,
    menuRecipeDetail_fetchDetails,
    menuRecipeDetail_fetchDelete,
    menuRecipeDetail_fetchVersionDetail,
    menuRecipeDetail_fetchVersions,
    menuRecipeDetail_isLoading: menuRecipe_isLoading,
    menuRecipeDetail_listColumns: MENU_RECIPE_DETAIL_LIST_INGREDIENTS_COLUMNS,
    menuRecipeDetail_onBack,
    menuRecipeDetail_onCancelDialogDeleteConfirmation,
    menuRecipeDetail_onEdit,
    menuRecipeDetail_onLoadInitialData,
    menuRecipeDetail_onResetToCurrentVersion,
    menuRecipeDetail_onSelectVersion,
    menuRecipeDetail_onShowDialogDeleteConfirmation,
    menuRecipeDetail_selectedVersionId,
    menuRecipeDetail_versions: menuRecipe_versions,
  };
};
