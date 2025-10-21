// constant
import {
  BATCH_LIST_COLUMNS,
  BATCH_LIST_VALUES,
  BATCH_DETAILS_INGRIDIENTS_COLUMNS,
  BATCH_DETAILS_VALUES,
} from '../constants';

// type
import type { IBatchListProvided, IBatchFormData, IMenuRecipe } from '../interfaces';
import type { IMenuRecipeListQueryParams } from '@/modules/menu-recipe/interfaces';
// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
// Plugins
import eventBus from '@/plugins/mitt';

// store
import { useBatchStore } from '../store';
export const useBatchService = (): IBatchListProvided => {
  const store = useBatchStore();
  const { menuRecipe_lists, menuRecipeList_isLoading, menuRecipe_ingredients } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  const batch_formData = reactive<IBatchFormData>({
    recipe: {
      id: '',
      recipeName: '',
    } as IMenuRecipe,
    batchDate: new Date(),
    targetYield: 0,
    waste: 0,
    notes: '',
    ingredients: [],
  });

  const batch_formRules = computed(() => ({
    recipe: {
      required,
    },
    batchDate: {
      required,
    },
    targetYield: {
      required,
    },
    waste: {
      required,
    },
  }));

  const batch_formValidation = useVuelidate(batch_formRules, batch_formData, {
    $autoDirty: true,
  });

  const menuRecipeList_queryParams: IMenuRecipeListQueryParams = reactive({
    page: 1,
    pageSize: 100,
    search: '',
    orderBy: 'updated_at',
    orderDirection: 'desc',
  });

  watch(
    () => menuRecipeList_queryParams,
    debounce(async () => {
      await menuRecipeList_fetchList();
    }, 500),
    { deep: true },
  );

  const menuRecipeList_onSelectedRecipe = (recipe: IMenuRecipe) => {
    batch_formData.recipe = recipe;

    menuRecipe_fetchIngridients(recipe.id);
    // batch_formData.ingredients = menuRecipe_ingredients.value;
  };

  const menuRecipeList_fetchList = async (): Promise<unknown> => {
    try {
      await store.menuRecipe_list(menuRecipeList_queryParams, {
        ...httpAbort_registerAbort('MENU_RECIPE_LIST_REQUEST'),
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
   * Handle fetch api menu recipe - ingridients
   * @param id - Menu recipe ID
   * @returns Promise of unknown value
   * @throws Error if there is an error while fetching the data
   */
  const menuRecipe_fetchIngridients = async (id: string): Promise<unknown> => {
    try {
      await store.menuRecipe_ingridients(id, {
        ...httpAbort_registerAbort('MENU_RECIPE_INGREDIENTS_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const menuRecipeList_onShowDialogDelete = (id: string) => {
    console.log(id);
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'batch-list-dialog-delete',
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
        eventBus.emit('AppBaseDialog', { id: 'batch-list-dialog-delete', isOpen: false });
      },
      onClickButtonSecondary: () => {
        // Logic to delete the table goes here
        eventBus.emit('AppBaseDialog', { id: 'batch-list-dialog-delete', isOpen: false });
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete',
      title: 'Delete Batch',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };
  const batchList_getClassOfBatchStatus = (batchStatus: string): string => {
    if (!batchStatus) {
      return '';
    }

    switch (batchStatus.toUpperCase()) {
      case 'CANCELLED': {
        return 'bg-error-background text-error-main';
      }
      case 'PLANNED': {
        return 'bg-warning-background text-warning-main';
      }
      case 'IN_PROGRESS': {
        return 'bg-secondary-background text-secondary';
      }
      case 'POSTED': {
        return 'bg-success-background text-success';
      }
      default: {
        return '';
      }
    }
  };

  const batchCreateEdit_onShowDialogCancel = (id: string) => {
    console.log(id);
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'batch-create-edit-cancel-dialog-confirmation',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            Once saved, the batch will be set to Planned and ready to cook on the selected date.
          </p>
        </div>`,
      iconName: 'confirmation',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        eventBus.emit('AppBaseDialog', { id: 'batch-create-edit-cancel-dialog-confirmation', isOpen: false });
      },
      onClickButtonSecondary: () => {
        // Logic to delete the table goes here
        eventBus.emit('AppBaseDialog', { id: 'batch-create-edit-cancel-dialog-confirmation', isOpen: false });
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete',
      title: 'Are you sure want to save this batch as Draft?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  const batchCreateEdit_startCookingDescription = () => {
    const startBefore = `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            You’re starting this batch before the planned date. Are you sure you want to continue cooking now?
          </p>
        </div>`;

    const startNow = `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            Ingredients will be prepared according to the recipe.
          </p>
        </div>`;

    const startAfter = `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            This batch was scheduled for an earlier date. Starting now may affect your production plan. Do you still want to proceed?
          </p>
        </div>`;

    let description;

    const currentDate = new Date();
    const batchDate = new Date(batch_formData.batchDate);
    const sameDate = currentDate.getFullYear() === batchDate.getFullYear() &&
      currentDate.getMonth() === batchDate.getMonth() &&
      currentDate.getDate() === batchDate.getDate();

    if (!sameDate && currentDate < batchDate) {
      description = startBefore;
    } else if (!sameDate && currentDate > batchDate) {
      description = startAfter;
    } else {
      description = startNow;
    }

    return description;
  };

  const batchCreateEdit_startCookingTitle = () => {
    const startBefore = 'Are you sure want to start cooking early?'

    const startNow = 'Are you sure want to start batch cooking?'

    const startAfter = 'Are you sure want to start batch cooking?'

    let title;

    if (new Date() < new Date(batch_formData.batchDate)) {
      title = startBefore;
    } else if (new Date() > new Date(batch_formData.batchDate)) {
      title = startAfter;
    } else {
      title = startNow;
    }

    return title;
  };

  const batchCreateEdit_onShowDialogStart = (id: string) => {
    console.log(id);
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'batch-create-edit-start-dialog-confirmation',
      description: batchCreateEdit_startCookingDescription(),
      iconName: 'confirmation',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        eventBus.emit('AppBaseDialog', { id: 'batch-create-edit-start-dialog-confirmation', isOpen: false });
      },
      onClickButtonSecondary: () => {
        // Logic to delete the table goes here
        eventBus.emit('AppBaseDialog', { id: 'batch-create-edit-start-dialog-confirmation', isOpen: false });
      },
      textButtonPrimary: 'Start Cooking',
      textButtonSecondary: 'Cancel',
      title: batchCreateEdit_startCookingTitle(),
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  const batchCreateEdit_onShowDialogSave = (id: string) => {
    console.log(id);
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'batch-create-edit-save-dialog-confirmation',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            Once saved, the batch will be set to Planned and ready to cook on the selected date.
          </p>
        </div>`,
      iconName: 'confirmation',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        eventBus.emit('AppBaseDialog', { id: 'batch-create-edit-save-dialog-confirmation', isOpen: false });
      },
      onClickButtonSecondary: () => {
        // Logic to delete the table goes here
        eventBus.emit('AppBaseDialog', { id: 'batch-create-edit-save-dialog-confirmation', isOpen: false });
      },
      textButtonPrimary: 'Save as Draft',
      textButtonSecondary: 'Cancel',
      title: 'Are you sure want to save this batch as Draft?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  const batchCreateEdit_onShowDialogUpdate = (id: string) => {
    console.log(id);
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'batch-create-edit-update-dialog-confirmation',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            Once saved, the batch will be set to Planned and ready to cook on the selected date.
          </p>
        </div>`,
      iconName: 'confirmation',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        eventBus.emit('AppBaseDialog', { id: 'batch-create-edit-update-dialog-confirmation', isOpen: false });
      },
      onClickButtonSecondary: () => {
        // Logic to delete the table goes here
        eventBus.emit('AppBaseDialog', { id: 'batch-create-edit-update-dialog-confirmation', isOpen: false });
      },
      textButtonPrimary: 'Update',
      textButtonSecondary: 'Cancel',
      title: 'Are you sure want to update this batch as Draft?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  return {
    // columns
    batchList_columns: BATCH_LIST_COLUMNS,
    batchDetailsIngridient_columns: BATCH_DETAILS_INGRIDIENTS_COLUMNS,
    // values
    batchList_values: BATCH_LIST_VALUES,
    batchDetails_values: BATCH_DETAILS_VALUES,
    // methods
    batchList_getClassOfBatchStatus,
    menuRecipeList_onShowDialogDelete,
    menuRecipeList_fetchList,
    menuRecipeList_onSelectedRecipe,
    menuRecipe_fetchIngridients,
    // formdata
    batch_formData,
    batch_formValidation,
    menuRecipeList_queryParams,
    // store values
    menuRecipe_lists,
    menuRecipeList_isLoading,
    menuRecipe_ingredients,
    // dialog confirmation
    batchCreateEdit_onShowDialogStart,
    batchCreateEdit_onShowDialogSave,
    batchCreateEdit_onShowDialogUpdate,
    batchCreateEdit_onShowDialogCancel,
  };
};
