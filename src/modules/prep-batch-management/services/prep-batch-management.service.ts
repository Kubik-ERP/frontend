// constant
import {
  BATCH_LIST_COLUMNS,
  BATCH_LIST_VALUES,
  BATCH_DETAILS_INGRIDIENTS_COLUMNS,
  BATCH_DETAILS_VALUES,
} from '../constants';

// type
import type {
  IBatchListProvided,
  IBatchFormData,
  IMenuRecipe,
  IBatchDetailsFormData,
  IBatchQueryParams,
} from '../interfaces';
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
  const {
    menuRecipe_lists,
    menuRecipeList_isLoading,
    menuRecipe_ingredients,
    batch_isLoading,
    batch_lists,
    batchDetail_values,
  } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  const router = useRouter();

  const batchDetails_formData = reactive<IBatchDetailsFormData>({
    actualBatchYield: 0,
    setWastePerItemIngridients: false,
    notes: '',
  });

  const batchDetails_formRules = computed(() => ({
    actualBatchYield: {
      required,
    },
  }));

  const batchDetails_formValidation = useVuelidate(batchDetails_formRules, batchDetails_formData, {
    $autoDirty: true,
  });

  const batch_formData = reactive<IBatchFormData>({
    recipe: {
      id: '',
      recipeName: '',
    } as IMenuRecipe,
    recipeId: null,
    recipeName: '',
    batchDate: new Date(),
    targetYield: 1,
    waste: 0,
    notes: '',
    ingredients: [],
  });

  const batch_formRules = computed(() => ({
    recipeId: {
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

  const batch_formData_onClear = () => {
    batch_formData.recipe = {
      id: '',
      recipeName: '',
    } as IMenuRecipe;
    batch_formData.batchDate = new Date();
    batch_formData.targetYield = 1;
    batch_formData.waste = 0;
    batch_formData.notes = '';
    batch_formData.ingredients = [];

    batch_formValidation.value.$reset();
  };

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

  const batch_queryParams = reactive<IBatchQueryParams>({
    page: 1,
    limit: 10,
  });

  watch(
    () => batch_queryParams,
    debounce(async () => {
      await batch_fetchList();
    }, 500),
    { deep: true },
  );

  const batch_onChangePage = (page: number) => {
    batch_queryParams.page = page;
  };

  const batch_fetchList = async (): Promise<unknown> => {
    try {
      await store.fetchBatchList(batch_queryParams, {
        ...httpAbort_registerAbort('BATCH_LIST_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const batch_fetchDetails = async (id: string): Promise<unknown> => {
    try {
      await store.fetchBatchDetail(id, {
        ...httpAbort_registerAbort('BATCH_DETAILS_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const menuRecipeList_onSelectedRecipe = (recipe: IMenuRecipe) => {
    batch_formData.recipeId = recipe.id;
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

  const menuRecipeList_onShowDialogCancel = (id: string) => {
    console.log(id);
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'batch-list-dialog-delete',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            This action cannot be undone and the batch will not be prepared.
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
        batchCreateEdit_onCancelCooking(id);
        eventBus.emit('AppBaseDialog', { id: 'batch-list-dialog-delete', isOpen: false });
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Cancel Batch Cooking',
      title: 'Are you sure you want to cancel this batch cooking plan?',
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
      case 'COOKING': {
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

  const batchCreateEdit_onShowDialogCancel = () => {
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
    const sameDate =
      currentDate.getFullYear() === batchDate.getFullYear() &&
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
    const startBefore = 'Are you sure want to start cooking early?';

    const startNow = 'Are you sure want to start batch cooking?';

    const startAfter = 'Are you sure want to start batch cooking?';

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

  const batchCreateEdit_onShowDialogStart = () => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'batch-create-edit-start-dialog-confirmation',
      description: batchCreateEdit_startCookingDescription(),
      iconName: 'confirmation',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        batchCreateEdit_onStartCooking();
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

  const batchCreateEdit_onShowDialogSave = () => {
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
        batchCreateEdit_onSaveDraft();
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

  const batchDetails_onShowDialogCompleteBatch = () => {
    console.log('batchDetails_onShowDialogCompleteBatch');
    eventBus.emit('AppBaseDialog', { id: 'batch-details-complete-batch-dialog', isOpen: true });
  };

  const batchDetails_onCloseDialogCompleteBatch = () => {
    eventBus.emit('AppBaseDialog', { id: 'batch-details-complete-batch-dialog', isOpen: false });
  };

  const batchCreateEdit_onSaveDraft = async () => {
    batch_formValidation.value.$touch();

    if (batch_formValidation.value.$invalid) {
      console.log('batchCreateEdit_onSaveDraft:' + batch_formValidation.value.$invalid);
      return;
    }

    try {
      await store.batch_saveDraft(batch_formData, {
        ...httpAbort_registerAbort('MENU_RECIPE_INGREDIENTS_REQUEST'),
      });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: `Batch saved as draft created.`,
        position: EToastPosition.TOP_RIGHT,
      };
      eventBus.emit('AppBaseToast', argsEventEmitter);
      batch_formData_onClear();

      router.push({ name: 'prep-batch-management.index' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const batchCreateEdit_onStartCooking = async () => {
    try {
      const batchId = await store
        .batch_saveDraft(batch_formData, {
          ...httpAbort_registerAbort('BATCH_CREATE_REQUEST'),
        })
        .then(response => {
          return response.data.id;
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            return Promise.reject(error);
          } else {
            return Promise.reject(new Error(String(error)));
          }
        });

      console.log(batchId);

      await store.batch_start(batchId, {
        ...httpAbort_registerAbort('BATCH_START_REQUEST'),
      });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: `Batch started cooking.`,
        position: EToastPosition.TOP_RIGHT,
      };
      eventBus.emit('AppBaseToast', argsEventEmitter);
      batch_formData_onClear();
      router.push({ name: 'prep-batch-management.index' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const batchCreateEdit_onCancelCooking = async (batchId: string) => {
    try {
      await store.batch_cancel(batchId, {
        ...httpAbort_registerAbort('BATCH_CANCEL_REQUEST'),
      });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: `Batch canceled.`,
        position: EToastPosition.TOP_RIGHT,
      };
      eventBus.emit('AppBaseToast', argsEventEmitter);
      batch_formData_onClear();
      router.push({ name: 'prep-batch-management.index' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      batch_fetchList();
    }
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
    menuRecipeList_onShowDialogCancel,
    menuRecipeList_fetchList,
    menuRecipeList_onSelectedRecipe,
    menuRecipe_fetchIngridients,
    batch_fetchList,
    batch_onChangePage,
    batch_queryParams,
    batch_fetchDetails,
    // formdata
    batch_formData,
    batch_formValidation,
    menuRecipeList_queryParams,
    // store values
    menuRecipe_lists,
    menuRecipeList_isLoading,
    menuRecipe_ingredients,
    batch_isLoading,
    batch_lists,
    batchDetail_values,
    // dialog confirmation
    batchCreateEdit_onShowDialogStart,
    batchCreateEdit_onShowDialogSave,
    batchCreateEdit_onShowDialogUpdate,
    batchCreateEdit_onShowDialogCancel,

    // batch details
    // formdata
    batchDetails_formData,
    batchDetails_formValidation,
    // batch details dialog
    batchDetails_onShowDialogCompleteBatch,
    batchDetails_onCloseDialogCompleteBatch,
    // create edit batch methods
    batchCreateEdit_onSaveDraft,
  };
};
