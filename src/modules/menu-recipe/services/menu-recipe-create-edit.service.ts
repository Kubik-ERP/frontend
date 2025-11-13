// Constants
import {
  MENU_RECIPE_CREATE_EDIT_LIST_INGREDIENTS_COLUMNS,
  MENU_RECIPE_CREATE_EDIT_LIST_OUTPUT_UNITS,
  MENU_RECIPE_CREATE_REQUEST,
  MENU_RECIPE_DETAIL_REQUEST,
  MENU_RECIPE_UPDATE_REQUEST,
} from '../constants';
import { EToastType, EToastPosition } from '@/app/constants';

// Interfaces
import type {
  IMenuRecipeCreateEditForm,
  IMenuRecipeCreateEditFormPayload,
  IMenuRecipeCreateEditIngredientItem,
  IMenuRecipeCreateEditProvided,
} from '../interfaces';
import type { IMenuRecipe, IIngredient } from '../interfaces/menu-recipe-store.interface';
import type { IProductItem } from '@/modules/cashier/interfaces/cashier-response';
import type { IInventoryItems } from '@/modules/items/interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useMenuRecipeStore } from '../store';
import { useCashierStore } from '@/modules/cashier/store';
import { useInventoryItemsStore } from '@/modules/items/store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useMenuRecipeCreateEditService = (): IMenuRecipeCreateEditProvided => {
  /**
   * @description Injected variables
   */
  const route = useRoute(); // Current route
  const router = useRouter(); // Router instance
  const store = useMenuRecipeStore(); // Instance of the store
  const cashierStore = useCashierStore(); // Instance of cashier store for products
  const inventoryItemsStore = useInventoryItemsStore(); // Instance of inventory items store
  const { menuRecipe_selectedData, menuRecipe_isLoading } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive variables
   */
  const menuRecipeCreateEdit_formData = ref<IMenuRecipeCreateEditForm>({
    recipeName: '',
    outputUnit: '',
    productId: null,
    targetYield: null,
    baseRecipe: false,
    costPortion: 0,
    marginPerSellingPriceRp: 0,
    marginPerSellingPricePercent: 0,
    ingredients: [],
  });
  const menuRecipeCreateEdit_formDataOfIngredientItem = ref<IMenuRecipeCreateEditIngredientItem>({
    itemId: null,
    quantity: 0,
    uom: null,
    notes: null,
    cost: 0,
  });
  const menuRecipeCreateEdit_listIngredientItemsOnDialog = ref<IMenuRecipeCreateEditIngredientItem[]>([]);

  /**
   * @description Product search reactive data
   */
  const menuRecipeCreateEdit_productSearchValue = ref<string>('');
  const menuRecipeCreateEdit_listProducts = ref<IProductItem[]>([]);
  const menuRecipeCreateEdit_selectedProduct = ref<IProductItem | null>(null);
  const menuRecipeCreateEdit_isLoadingProducts = ref<boolean>(false);

  /**
   * @description Inventory items reactive data
   */
  const menuRecipeCreateEdit_listInventoryItems = ref<IInventoryItems[]>([]);
  const menuRecipeCreateEdit_isLoadingInventoryItems = ref<boolean>(false);

  /**
   * @description Ingredient item edit state
   */
  const menuRecipeCreateEdit_isEditingIngredientItem = ref<boolean>(false);
  const menuRecipeCreateEdit_editingIngredientItemIndex = ref<number>(-1);
  const menuRecipeCreateEdit_selectedIngredientIndex = ref<number>(-1);

  /**
   * @description Form validations
   */
  const menuRecipeCreateEdit_formRules = computed(() => ({
    recipeName: { required },
    outputUnit: { required },
    productId: { required },
    targetYield: { required },
    ingredients: {
      $each: helpers.forEach({
        itemId: { required },
        quantity: { required },
        uom: { required },
        cost: { required },
      }),
    },
  }));
  const menuRecipeCreateEdit_formRulesOfIngredientItem = computed(() => ({
    itemId: { required },
    quantity: { required },
    uom: { required },
  }));

  const menuRecipeCreateEdit_formValidations = useVuelidate(
    menuRecipeCreateEdit_formRules,
    menuRecipeCreateEdit_formData,
    {
      $autoDirty: true,
    },
  );
  const menuRecipeCreateEdit_formValidationsOfIngredientItem = useVuelidate(
    menuRecipeCreateEdit_formRulesOfIngredientItem,
    menuRecipeCreateEdit_formDataOfIngredientItem,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Computed properties for business logic
   */
  const menuRecipeCreateEdit_isEditMode = computed(() => route.params.id !== undefined);
  // const menuReciperCreateEdit_menuRecipeId = computed(() => (route.params.id ? String(route.params.id) : ''));

  /**
   * @description Helper function to calculate price based on UOM conversion
   * @param item - Inventory item with conversions
   * @param selectedUom - Selected UOM by user
   * @param quantity - Quantity of the item
   * @returns Calculated cost based on UOM conversion
   */
  const calculateCostByUom = (
    item: IInventoryItems | null,
    selectedUom: string | null,
    quantity: number,
  ): number => {
    if (!item || !selectedUom || quantity === 0) return 0;

    const basePrice = item.pricePerUnit ?? 0;
    const baseUnit = item.unit;

    // If selected UOM is the same as base unit, use base price directly
    if (selectedUom === baseUnit) {
      return basePrice * quantity;
    }

    // Find conversion for selected UOM from masterInventoryItemConversions
    const conversion = item.masterInventoryItemConversions?.find(
      conv => conv.unitSymbol === selectedUom || conv.unitName === selectedUom,
    );

    if (!conversion) {
      // If no conversion found, fallback to base price
      console.warn(`No conversion found for UOM: ${selectedUom}, using base price`);
      return basePrice * quantity;
    }

    // Calculate price per selected unit
    // conversion.conversionValue represents the price for 1 selected unit
    // Example: if base unit is "pcs" with price 4000, and conversion is "kg" with conversionValue 30200
    // Then price per kg = 30200
    const pricePerSelectedUnit = conversion.conversionValue;

    return pricePerSelectedUnit * quantity;
  };

  /**
   * @description Computed property for available UOM options based on selected item
   * Returns UOMs from conversions
   */
  const menuRecipeCreateEdit_availableUomOptions = computed(() => {
    const selectedItem = menuRecipeCreateEdit_formDataOfIngredientItem.value.itemId;

    if (!selectedItem) {
      return [];
    }

    const options: IDropdownItem[] = [];

    // masterInventoryItemConversions already includes base unit + all conversions
    if (selectedItem.masterInventoryItemConversions && selectedItem.masterInventoryItemConversions.length > 0) {
      selectedItem.masterInventoryItemConversions.forEach(conversion => {
        options.push({
          label: `${conversion.unitName}`,
          value: conversion.unitSymbol,
        });
      });
    } else if (selectedItem.unit) {
      // Fallback to base unit if no conversions available
      options.push({
        label: selectedItem.unit,
        value: selectedItem.unit,
      });
    }

    console.log('🔍 UOM Options:', options);

    return options;
  });

  /**
   * @description Computed property for total cost per portion
   * Calculates the cost per portion by dividing total ingredient cost by target yield
   */
  const menuRecipeCreateEdit_totalCostPortion = computed(() => {
    if (!menuRecipeCreateEdit_formData.value.ingredients) return 0;

    const totalCost = menuRecipeCreateEdit_formData.value.ingredients.reduce((total, item) => {
      const cost = calculateCostByUom(item.itemId, item.uom, item.quantity);
      return total + cost;
    }, 0);

    // Divide by target yield to get cost per portion
    const targetYield = menuRecipeCreateEdit_formData.value.targetYield || 1;
    
    // Prevent division by zero or invalid yield
    if (targetYield <= 0 || isNaN(targetYield) || !isFinite(targetYield)) return totalCost;

    return totalCost / targetYield;
  });

  /**
   * @description Computed property for margin per selling price in Rp
   */
  const menuRecipeCreateEdit_calculatedMarginRp = computed(() => {
    if (!menuRecipeCreateEdit_selectedProduct.value) return 0;

    const sellingPrice = menuRecipeCreateEdit_selectedProduct.value?.price ?? 0;
    const costPortion = menuRecipeCreateEdit_totalCostPortion.value || 0;
    const result = sellingPrice - costPortion;

    // Return 0 if result is NaN or not finite
    return isNaN(result) || !isFinite(result) ? 0 : result;
  });

  /**
   * @description Computed property for margin per selling price in percentage
   */
  const menuRecipeCreateEdit_calculatedMarginPercent = computed(() => {
    if (!menuRecipeCreateEdit_selectedProduct.value && !menuRecipeCreateEdit_totalCostPortion.value) return 0;

    const sellingPrice = menuRecipeCreateEdit_selectedProduct.value?.price ?? 0;
    const marginRp = menuRecipeCreateEdit_calculatedMarginRp.value || 0;

    if (sellingPrice === 0 || isNaN(sellingPrice) || !isFinite(sellingPrice)) return 0;

    const result = (marginRp / sellingPrice) * 100;

    // Return 0 if result is NaN or not finite
    return isNaN(result) || !isFinite(result) ? 0 : result;
  });

  /**
   * @description Watch computed values and update form data automatically
   */
  watch(menuRecipeCreateEdit_totalCostPortion, newCost => {
    menuRecipeCreateEdit_formData.value.costPortion = newCost;
  });

  watch(menuRecipeCreateEdit_calculatedMarginRp, newMarginRp => {
    menuRecipeCreateEdit_formData.value.marginPerSellingPriceRp = newMarginRp;
  });

  watch(menuRecipeCreateEdit_calculatedMarginPercent, newMarginPercent => {
    menuRecipeCreateEdit_formData.value.marginPerSellingPricePercent = newMarginPercent;
  });

  /**
   * @description Watch ingredient item changes to auto-calculate cost based on UOM
   */
  watch(
    () => ({
      itemId: menuRecipeCreateEdit_formDataOfIngredientItem.value.itemId,
      quantity: menuRecipeCreateEdit_formDataOfIngredientItem.value.quantity,
      uom: menuRecipeCreateEdit_formDataOfIngredientItem.value.uom,
    }),
    ({ itemId, quantity, uom }) => {
      // Auto-calculate cost when item, quantity, or uom changes
      const calculatedCost = calculateCostByUom(itemId, uom, quantity);
      menuRecipeCreateEdit_formDataOfIngredientItem.value.cost = calculatedCost;
    },
    { deep: true },
  );

  /**
   * @description Helper function to create payload from form data
   */
  const menuRecipeCreateEdit_createPayloadFromFormData = (): IMenuRecipeCreateEditFormPayload => {
    return {
      recipeName: menuRecipeCreateEdit_formData.value.recipeName,
      outputUnit: menuRecipeCreateEdit_formData.value.outputUnit,
      baseRecipe: menuRecipeCreateEdit_formData.value.baseRecipe,
      productId: menuRecipeCreateEdit_formData.value.productId || '',
      targetYield: menuRecipeCreateEdit_formData.value.targetYield || 0,
      costPortion: menuRecipeCreateEdit_formData.value.costPortion,
      marginPerSellingPriceRp: menuRecipeCreateEdit_formData.value.marginPerSellingPriceRp,
      marginPerSellingPricePercent: menuRecipeCreateEdit_formData.value.marginPerSellingPricePercent,
      ingredients: menuRecipeCreateEdit_formData.value.ingredients.map(ingredient => ({
        itemId: ingredient.itemId?.id || '',
        qty: ingredient.quantity,
        uom: ingredient.uom ?? '',
        notes: ingredient.notes || '',
        cost: ingredient.cost,
      })),
    };
  };

  /**
   * @description Helper function to map API response to form data
   */
  const menuRecipeCreateEdit_mapApiResponseToFormData = (apiData: IMenuRecipe): IMenuRecipeCreateEditForm => {
    return {
      recipeName: apiData.recipe_name,
      outputUnit: apiData.output_unit,
      productId: apiData.product_id,
      targetYield: apiData.target_yield,
      baseRecipe: apiData.base_recipe,
      costPortion: apiData.cost_portion,
      marginPerSellingPriceRp: apiData.margin_per_selling_price_rp,
      marginPerSellingPricePercent: apiData.margin_per_selling_price_percent,
      ingredients: apiData.ingredients.map((ingredient: IIngredient) => ({
        itemId: {
          id: ingredient.inventory_item.id,
          name: ingredient.inventory_item.name,
          itemName: ingredient.inventory_item.name,
          pricePerUnit: ingredient.inventory_item.price_per_unit,
          unit: ingredient.inventory_item.unit,
          brandId: ingredient.inventory_item.brand_id,
          barcode: ingredient.inventory_item.barcode || '',
          sku: ingredient.inventory_item.sku,
          categoryId: ingredient.inventory_item.category_id,
          notes: ingredient.inventory_item.notes,
          stockQuantity: ingredient.inventory_item.stock_quantity,
          reorderLevel: ingredient.inventory_item.reorder_level,
          minimumStockQuantity: ingredient.inventory_item.minimum_stock_quantity,
          expiryDate: ingredient.inventory_item.expiry_date ? String(ingredient.inventory_item.expiry_date) : '',
          storageLocationId: ingredient.inventory_item.storage_location_id || '',
          supplierId: ingredient.inventory_item.supplier_id,
          createdAt: ingredient.inventory_item.created_at.toString(),
          updatedAt: ingredient.inventory_item.updated_at.toString(),
          priceGrosir: ingredient.inventory_item.price_grosir,
          // Include masterInventoryItemConversions if available
          masterInventoryItemConversions: ingredient.inventory_item.master_inventory_item_conversions || [],
          markup: ingredient.inventory_item.markup || 0,
          margin: ingredient.inventory_item.margin || 0,
          // Add missing required fields with fallback values
          brand: '', // Will be populated when we have brand data
          category: '', // Will be populated when we have category data
          storageLocation: '', // Will be populated when we have storage location data
          supplier: '', // Will be populated when we have supplier data
        } as IInventoryItems,
        quantity: ingredient.qty,
        uom: ingredient.uom,
        notes: ingredient.notes,
        cost: ingredient.cost,
      })),
    };
  };

  /**
   * @description Handle business logic for event button on click cancel
   */
  const menuRecipeCreateEdit_onCancel = (): void => {
    router.back();
  };

  /**
   * @description Handle fetch api menu recipe - create
   */
  const menuRecipeCreateEdit_fetchCreate = async (): Promise<unknown> => {
    try {
      const payload = menuRecipeCreateEdit_createPayloadFromFormData();

      const response = await store.menuRecipe_create(payload, {
        ...httpAbort_registerAbort(MENU_RECIPE_CREATE_REQUEST),
      });

      // Show success toast
      eventBus.emit('AppBaseToast', {
        isOpen: true,
        message: 'Recipe created successfully!',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.SUCCESS,
      });

      // Redirect to index page
      router.push({ name: 'menu-recipe.index' });

      return Promise.resolve(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api menu recipe - detail
   */
  const menuRecipeCreateEdit_fetchDetails = async (id: string): Promise<unknown> => {
    try {
      const response = await store.menuRecipe_detail(id, {
        ...httpAbort_registerAbort(MENU_RECIPE_DETAIL_REQUEST),
      });

      // Update form data with fetched details
      if (menuRecipe_selectedData.value) {
        menuRecipeCreateEdit_formData.value = menuRecipeCreateEdit_mapApiResponseToFormData(
          menuRecipe_selectedData.value,
        );

        // If product exists, fetch and set selected product for calculations
        if (menuRecipe_selectedData.value.product_id) {
          await menuRecipeCreateEdit_fetchSelectedProductDetails(menuRecipe_selectedData.value.product_id);
        }
      }

      return Promise.resolve(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api menu recipe - update
   */
  const menuRecipeCreateEdit_fetchUpdate = async (id: string): Promise<unknown> => {
    try {
      const payload = menuRecipeCreateEdit_createPayloadFromFormData();

      const response = await store.menuRecipe_update(id, payload, {
        ...httpAbort_registerAbort(MENU_RECIPE_UPDATE_REQUEST),
      });

      // Show success toast
      eventBus.emit('AppBaseToast', {
        isOpen: true,
        message: 'Recipe updated successfully!',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.SUCCESS,
      });

      // Redirect to index page
      router.push({ name: 'menu-recipe.index' });

      return Promise.resolve(response);
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
  const menuRecipeCreateEdit_onLoadInitialData = async (): Promise<void> => {
    // Always fetch inventory items for ingredients dropdown
    await menuRecipeCreateEdit_fetchInventoryItems();
    // If in edit mode, fetch the recipe details
    if (menuRecipeCreateEdit_isEditMode.value && route.params.id) {
      await menuRecipeCreateEdit_fetchDetails(String(route.params.id));
    }
  };

  /**
   * @description Handle reset form data
   */
  const menuRecipeCreateEdit_onResetForm = (): void => {
    menuRecipeCreateEdit_formData.value = {
      recipeName: '',
      outputUnit: '',
      productId: null,
      targetYield: null,
      baseRecipe: false,
      costPortion: 0,
      marginPerSellingPriceRp: 0,
      marginPerSellingPricePercent: 0,
      ingredients: [],
    };

    menuRecipeCreateEdit_formValidations.value.$reset();
  };

  /**
   * @description Handle reset form data of ingredients
   */
  const menuRecipeCreateEdit_onResetFormOfIngredients = (): void => {
    menuRecipeCreateEdit_formDataOfIngredientItem.value = {
      itemId: null,
      quantity: 0,
      uom: 'Kilogram (kg)',
      notes: null,
      cost: 0,
    };

    menuRecipeCreateEdit_formValidationsOfIngredientItem.value.$reset();
  };

  /**
   * @description Handle business logic for add ingredient item
   */
  const menuRecipeCreateEdit_onAddIngredientItem = (): void => {
    try {
      menuRecipeCreateEdit_formValidationsOfIngredientItem.value.$touch();

      if (menuRecipeCreateEdit_formValidationsOfIngredientItem.value.$invalid) {
        return;
      }

      if (menuRecipeCreateEdit_isEditingIngredientItem.value) {
        // Check if we're editing from main form (selectedIngredientIndex >= 0)
        if (menuRecipeCreateEdit_selectedIngredientIndex.value >= 0) {
          // Update ingredient in main form data
          menuRecipeCreateEdit_formData.value.ingredients[menuRecipeCreateEdit_selectedIngredientIndex.value] = {
            ...menuRecipeCreateEdit_formDataOfIngredientItem.value,
          };

          // Reset selected ingredient index
          menuRecipeCreateEdit_selectedIngredientIndex.value = -1;

          // Close dialog for main form edit (use the new edit dialog ID)
          eventBus.emit('AppBaseDialog', {
            id: 'menu-recipe-edit-ingredient-dialog',
            isOpen: false,
          });
        } else {
          // Update existing item in dialog list (original behavior)
          menuRecipeCreateEdit_listIngredientItemsOnDialog.value[
            menuRecipeCreateEdit_editingIngredientItemIndex.value
          ] = {
            ...menuRecipeCreateEdit_formDataOfIngredientItem.value,
          };
        }

        // Reset edit mode
        menuRecipeCreateEdit_isEditingIngredientItem.value = false;
        menuRecipeCreateEdit_editingIngredientItemIndex.value = -1;
      } else {
        // Add new item to list on dialog
        menuRecipeCreateEdit_listIngredientItemsOnDialog.value.push({
          ...menuRecipeCreateEdit_formDataOfIngredientItem.value,
        });
      }

      // Reset form data of ingredient item
      menuRecipeCreateEdit_onResetFormOfIngredients();
    } catch (error) {
      console.error('Error adding ingredient item:', error);
    }
  };

  /**
   * @description Handle business logic for edit ingredient item
   */
  const menuRecipeCreateEdit_onEditIngredientItem = (index: number): void => {
    try {
      const item = menuRecipeCreateEdit_listIngredientItemsOnDialog.value[index];

      if (item) {
        // Set form data with current item values
        menuRecipeCreateEdit_formDataOfIngredientItem.value = {
          itemId: item.itemId,
          quantity: item.quantity,
          uom: item.uom,
          notes: item.notes,
          cost: item.cost,
        };

        // Set edit mode
        menuRecipeCreateEdit_isEditingIngredientItem.value = true;
        menuRecipeCreateEdit_editingIngredientItemIndex.value = index;
      }
    } catch (error) {
      console.error('Error editing ingredient item:', error);
    }
  };

  /**
   * @description Handle business logic for delete ingredient item
   */
  const menuRecipeCreateEdit_onDeleteIngredientItem = (index: number): void => {
    try {
      // Remove item from list
      menuRecipeCreateEdit_listIngredientItemsOnDialog.value.splice(index, 1);

      // Reset edit mode if we're currently editing this item
      if (
        menuRecipeCreateEdit_isEditingIngredientItem.value &&
        menuRecipeCreateEdit_editingIngredientItemIndex.value === index
      ) {
        menuRecipeCreateEdit_isEditingIngredientItem.value = false;
        menuRecipeCreateEdit_editingIngredientItemIndex.value = -1;

        // Reset form data
        menuRecipeCreateEdit_onResetFormOfIngredients();
      }
    } catch (error) {
      console.error('Error deleting ingredient item:', error);
    }
  };

  /**
   * @description Handle business logic for cancel edit ingredient item
   */
  const menuRecipeCreateEdit_onCancelEditIngredientItem = (): void => {
    try {
      // Reset edit mode
      menuRecipeCreateEdit_isEditingIngredientItem.value = false;
      menuRecipeCreateEdit_editingIngredientItemIndex.value = -1;

      // Reset form data
      menuRecipeCreateEdit_formDataOfIngredientItem.value = {
        itemId: null,
        quantity: 0,
        uom: '',
        notes: null,
        cost: 0,
      };

      menuRecipeCreateEdit_formValidationsOfIngredientItem.value.$reset();
    } catch (error) {
      console.error('Error canceling edit ingredient item:', error);
    }
  };

  /**
   * @description Handle show dialog for delete individual ingredient
   */
  const menuRecipeCreateEdit_onShowDialogDeleteIngredient = (index: number): void => {
    try {
      // Set the selected ingredient index
      menuRecipeCreateEdit_selectedIngredientIndex.value = index;

      // Show delete confirmation dialog
      const argsEventEmitter: IPropsDialogConfirmation = {
        id: 'menu-recipe-create-edit-dialog-confirmation',
        description: `
          <div class="flex items-center justify-center">
            <p class="font-normal text-black text-sm text-center">
              Are you sure you want to delete this ingredient? This action cannot be undone.
            </p>
          </div>`,
        iconName: 'delete-polygon',
        isOpen: true,
        isUsingButtonSecondary: true,
        isUsingHtmlTagOnDescription: true,
        onClickButtonPrimary: () => {
          menuRecipeCreateEdit_formData.value.ingredients.splice(
            menuRecipeCreateEdit_selectedIngredientIndex.value,
            1,
          );

          // Reset selected index
          menuRecipeCreateEdit_selectedIngredientIndex.value = -1;

          // Close dialog
          eventBus.emit('AppBaseDialogConfirmation', {
            id: 'menu-recipe-create-edit-dialog-confirmation',
            isOpen: false,
          });

          // Show success toast
          eventBus.emit('AppBaseToast', {
            isOpen: true,
            message: 'Ingredient deleted successfully!',
            position: EToastPosition.TOP_RIGHT,
            type: EToastType.SUCCESS,
          });
        },
        onClickButtonSecondary: () => {
          eventBus.emit('AppBaseDialogConfirmation', {
            id: 'menu-recipe-create-edit-dialog-confirmation',
            isOpen: false,
          });
        },
        textButtonPrimary: 'Delete',
        textButtonSecondary: 'Cancel',
        title: 'Delete Ingredient',
      };

      eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
    } catch (error) {
      console.error('Error showing delete ingredient dialog:', error);
    }
  };

  /**
   * @description Handle confirm delete ingredient
   */
  const menuRecipeCreateEdit_onConfirmDeleteIngredient = (): void => {
    try {
      if (menuRecipeCreateEdit_selectedIngredientIndex.value >= 0) {
        // Remove ingredient from form data
        menuRecipeCreateEdit_formData.value.ingredients.splice(
          menuRecipeCreateEdit_selectedIngredientIndex.value,
          1,
        );

        // Reset selected index
        menuRecipeCreateEdit_selectedIngredientIndex.value = -1;

        // Close dialog
        eventBus.emit('AppBaseDialogConfirmation', {
          id: 'menu-recipe-create-edit-dialog-confirmation',
          isOpen: false,
        });

        // Show success toast
        eventBus.emit('AppBaseToast', {
          isOpen: true,
          message: 'Ingredient deleted successfully!',
          position: EToastPosition.TOP_RIGHT,
          type: EToastType.SUCCESS,
        });
      }
    } catch (error) {
      console.error('Error deleting ingredient:', error);
    }
  };

  /**
   * @description Handle cancel delete ingredient
   */
  const menuRecipeCreateEdit_onCancelDeleteIngredient = (): void => {
    try {
      // Reset selected index
      menuRecipeCreateEdit_selectedIngredientIndex.value = -1;

      // Close dialog
      eventBus.emit('AppBaseDialogConfirmation', {
        id: 'menu-recipe-create-edit-dialog-confirmation',
        isOpen: false,
      });
    } catch (error) {
      console.error('Error canceling delete ingredient:', error);
    }
  };

  /**
   * @description Handle business logic for close dialog cancel
   */
  const menuRecipeCreateEdit_onCloseDialogCancelAddIngredient = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'menu-recipe-add-ingredients-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for close dialog cancel confirmation
   */
  const menuRecipeCreateEdit_onCloseDialogConfirmationCancelAddIngredient = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'menu-recipe-create-edit-dialog-confirmation',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for event button on click save
   */
  const menuRecipeCreateEdit_onSave = async (): Promise<void> => {
    menuRecipeCreateEdit_formValidations.value.$touch();

    if (menuRecipeCreateEdit_formValidations.value.$invalid) {
      return;
    }

    try {
      if (menuRecipeCreateEdit_isEditMode.value && route.params.id) {
        // Update existing recipe
        await menuRecipeCreateEdit_fetchUpdate(String(route.params.id));
      } else {
        // Create new recipe
        await menuRecipeCreateEdit_fetchCreate();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for event button add ingredient item on dialog
   */
  const menuRecipeCreateEdit_onSaveIngredientItems = (): void => {
    // Replace the form data ingredients with the dialog list
    menuRecipeCreateEdit_formData.value.ingredients = [...menuRecipeCreateEdit_listIngredientItemsOnDialog.value];
  };

  /**
   * @description Handle business logic for showing dialog add ingredient
   */
  const menuRecipeCreateEdit_onShowDialogAddIngredient = (): void => {
    // Populate dialog list with existing ingredients when opening dialog
    menuRecipeCreateEdit_listIngredientItemsOnDialog.value = [...menuRecipeCreateEdit_formData.value.ingredients];

    const argsEventEmitter: IPropsDialog = {
      id: 'menu-recipe-add-ingredients-dialog',
      isOpen: true,
      width: '80%',
      isUsingClosableButton: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for showing dialog cancel
   */
  const menuRecipeCreateEdit_onShowDialogCancelAddIngredient = () => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'menu-recipe-create-edit-dialog-confirmation',
      iconName: 'exclude',
      title: 'Are you sure want to cancel this ingredient?',
      description: 'All data you have entered will be lost. Do you want to proceed?',
      type: 'error',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingForm: true,
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Back',
      width: '460px',
      onClickButtonPrimary: () => {
        menuRecipeCreateEdit_onCloseDialogConfirmationCancelAddIngredient();
        menuRecipeCreateEdit_onCloseDialogCancelAddIngredient();
      },
      onClickButtonSecondary: () => {
        menuRecipeCreateEdit_onCloseDialogConfirmationCancelAddIngredient();
      },
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle business logic for showing dialog save confirmation
   */
  const menuRecipeCreateEdit_onShowDialogSaveIngredients = () => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'menu-recipe-create-edit-dialog-confirmation',
      iconName: 'info',
      title: 'Add Ingredients to Recipe',
      description: `Are you sure you want to add ${menuRecipeCreateEdit_listIngredientItemsOnDialog.value.length} ingredient(s) to this recipe?`,
      type: 'info',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingForm: false,
      textButtonPrimary: 'Yes, Add',
      textButtonSecondary: 'Cancel',
      width: '460px',
      onClickButtonPrimary: () => {
        menuRecipeCreateEdit_onCloseSaveIngredientsConfirmation();
        menuRecipeCreateEdit_onSaveIngredientItems();
        menuRecipeCreateEdit_onCloseDialogCancelAddIngredient();
      },
      onClickButtonSecondary: () => {
        menuRecipeCreateEdit_onCloseSaveIngredientsConfirmation();
      },
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle business logic for close save ingredients dialog confirmation
   */
  const menuRecipeCreateEdit_onCloseSaveIngredientsConfirmation = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'menu-recipe-create-edit-dialog-confirmation',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle product search API call
   */
  const menuRecipeCreateEdit_onSearchProduct = async () => {
    if (
      !menuRecipeCreateEdit_productSearchValue.value ||
      menuRecipeCreateEdit_productSearchValue.value.length < 3
    ) {
      menuRecipeCreateEdit_listProducts.value = [];
      return;
    }

    try {
      menuRecipeCreateEdit_isLoadingProducts.value = true;

      // Use cashier store to fetch products by category with search
      const response = await cashierStore.cashierProduct_fetchCategoryProducts(
        '', // Empty category to search all categories
        menuRecipeCreateEdit_productSearchValue.value,
        route,
      );

      // Extract products from all categories
      const allProducts: IProductItem[] = [];
      response.data?.forEach(category => {
        if (category.items) {
          allProducts.push(...category.items);
        }
      });

      menuRecipeCreateEdit_listProducts.value = allProducts;
    } catch (error) {
      console.error('Error searching products:', error);
      menuRecipeCreateEdit_listProducts.value = [];
    } finally {
      menuRecipeCreateEdit_isLoadingProducts.value = false;
    }
  };

  /**
   * @description Handle inventory items fetch
   */
  const menuRecipeCreateEdit_fetchInventoryItems = async () => {
    try {
      menuRecipeCreateEdit_isLoadingInventoryItems.value = true;

      const params = {
        page: 1,
        pageSize: 100, // Get more items for dropdown
        search: null,
        orderBy: null,
        orderDirection: null,
      };

      const response = await inventoryItemsStore.InventoryItems_fetchData(params, {
        paramsSerializer: useParamsSerializer,
      });

      menuRecipeCreateEdit_listInventoryItems.value = response.data?.items || [];
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      menuRecipeCreateEdit_listInventoryItems.value = [];
    } finally {
      menuRecipeCreateEdit_isLoadingInventoryItems.value = false;
    }
  };

  /**
   * @description Handle product selection
   */
  const menuRecipeCreateEdit_onSelectProduct = (product: IProductItem) => {
    menuRecipeCreateEdit_selectedProduct.value = product;
    menuRecipeCreateEdit_formData.value.productId = product.id;
    // Clear search after selection
    menuRecipeCreateEdit_productSearchValue.value = '';
    menuRecipeCreateEdit_listProducts.value = [];
  };

  /**
   * @description Reset product search
   */
  const menuRecipeCreateEdit_onResetProductSearch = () => {
    menuRecipeCreateEdit_productSearchValue.value = '';
    menuRecipeCreateEdit_listProducts.value = [];
    menuRecipeCreateEdit_selectedProduct.value = null;
    menuRecipeCreateEdit_formData.value.productId = null;
  };

  /**
   * @description Fetch selected product details for calculations in edit mode
   */
  const menuRecipeCreateEdit_fetchSelectedProductDetails = async (productId: string): Promise<void> => {
    try {
      menuRecipeCreateEdit_isLoadingProducts.value = true;

      // Search for the product to get its details
      const response = await cashierStore.cashierProduct_fetchCategoryProducts('', '', route);

      // Find the product in all categories
      let foundProduct: IProductItem | null = null;
      response.data?.forEach(category => {
        if (category.items) {
          const product = category.items.find(item => item.id === productId);
          if (product) {
            foundProduct = product;
          }
        }
      });

      if (foundProduct) {
        menuRecipeCreateEdit_selectedProduct.value = foundProduct;
      }
    } catch (error) {
      console.error('Error fetching selected product details:', error);
    } finally {
      menuRecipeCreateEdit_isLoadingProducts.value = false;
    }
  };

  return {
    menuRecipeCreateEdit_fetchCreate,
    menuRecipeCreateEdit_fetchDetails,
    menuRecipeCreateEdit_fetchUpdate,
    menuRecipeCreateEdit_formData,
    menuRecipeCreateEdit_formDataOfIngredientItem,
    menuRecipeCreateEdit_formValidations: menuRecipeCreateEdit_formValidations.value,
    menuRecipeCreateEdit_formValidationsOfIngredientItem:
      menuRecipeCreateEdit_formValidationsOfIngredientItem.value,
    menuRecipeCreateEdit_isEditMode,
    menuRecipeCreateEdit_isLoading: menuRecipe_isLoading,
    menuRecipeCreateEdit_listColumns: MENU_RECIPE_CREATE_EDIT_LIST_INGREDIENTS_COLUMNS,
    menuRecipeCreateEdit_listIngredientItemsOnDialog,
    menuRecipeCreateEdit_listOutputUnitOptions: MENU_RECIPE_CREATE_EDIT_LIST_OUTPUT_UNITS,
    menuRecipeCreateEdit_availableUomOptions,
    menuRecipeCreateEdit_onAddIngredientItem,
    menuRecipeCreateEdit_onEditIngredientItem,
    menuRecipeCreateEdit_onDeleteIngredientItem,
    menuRecipeCreateEdit_onCancelEditIngredientItem,
    menuRecipeCreateEdit_onCancel,
    menuRecipeCreateEdit_onLoadInitialData,
    menuRecipeCreateEdit_onResetForm,
    menuRecipeCreateEdit_onSave,
    menuRecipeCreateEdit_onSaveIngredientItems,
    menuRecipeCreateEdit_onShowDialogAddIngredient,
    menuRecipeCreateEdit_onShowDialogCancelAddIngredient,
    menuRecipeCreateEdit_onShowDialogSaveIngredients,
    // Individual ingredient management
    menuRecipeCreateEdit_onShowDialogDeleteIngredient,
    menuRecipeCreateEdit_onConfirmDeleteIngredient,
    menuRecipeCreateEdit_onCancelDeleteIngredient,
    menuRecipeCreateEdit_selectedIngredientIndex,
    // Ingredient edit state
    menuRecipeCreateEdit_isEditingIngredientItem,
    menuRecipeCreateEdit_editingIngredientItemIndex,
    // Product search functionality
    menuRecipeCreateEdit_listProducts,
    menuRecipeCreateEdit_onSearchProduct,
    menuRecipeCreateEdit_productSearchValue,
    menuRecipeCreateEdit_selectedProduct,
    menuRecipeCreateEdit_onSelectProduct,
    menuRecipeCreateEdit_onResetProductSearch,
    menuRecipeCreateEdit_isLoadingProducts,
    // Inventory items functionality
    menuRecipeCreateEdit_listInventoryItems,
    menuRecipeCreateEdit_fetchInventoryItems,
    menuRecipeCreateEdit_isLoadingInventoryItems,
    // Computed calculations
    menuRecipeCreateEdit_totalCostPortion,
    menuRecipeCreateEdit_calculatedMarginRp,
    menuRecipeCreateEdit_calculatedMarginPercent,
  };
};
