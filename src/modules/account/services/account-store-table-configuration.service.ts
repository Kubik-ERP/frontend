// Constants
import {
  ACCOUNT_STORE_TABLE_CONFIGURATION_LIST_SHAPES,
  ACCOUNT_STORE_TABLE_CREATE_REQUEST,
  ACCOUNT_STORE_TABLE_DELETE_REQUEST,
  ACCOUNT_STORE_TABLE_LIST_REQUEST,
} from '../constants';

// Interfaces
import type {
  IAccountStoreTable,
  IAccountStoreTableConfigurationFormData,
  IAccountStoreTableConfigurationFormDataOfAddTable,
  IAccountStoreTableConfigurationFormDataOfAddFloor,
  IAccountStoreTableConfigurationProvided,
} from '../interfaces';
import { IOutletTable } from '@/modules/outlet/interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useOutletStore } from '@/modules/outlet/store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAccountStoreTableConfigurationService = (): IAccountStoreTableConfigurationProvided => {
  /**
   * @description Injected variables
   */
  const outletStore = useOutletStore();
  const route = useRoute();
  const router = useRouter();
  const { httpAbort_registerAbort } = useHttpAbort();
  const { outlet_selectedOutletOnAccountPage } = storeToRefs(outletStore);

  /**
   * @description Reactive data binding
   */
  const accountStoreTableConfiguration_editableData = ref<Omit<IAccountStoreTable, 'id'> | null>(null);
  const accountStoreTableConfiguration_formData = reactive<IAccountStoreTableConfigurationFormData>({
    configurations: [],
  });
  const accountStoreTableConfiguration_formDataOfAddFloor =
    reactive<IAccountStoreTableConfigurationFormDataOfAddFloor>({
      floorName: '',
    });
  const accountStoreTableConfiguration_formDataOfAddTable =
    reactive<IAccountStoreTableConfigurationFormDataOfAddTable>({
      floorName: '',
      name: '',
      seats: 0,
      shape: 'SQUARE',
      width: 0,
      height: 0,
      positionX: 0,
      positionY: 0,
      isEnableQrCode: false,
    });
  const accountStoreTableConfiguration_existingFloorName = ref<string>('');
  // const accountStoreTableConfiguration_existingStoreTableId = ref<string>('');
  const accountStoreTableConfiguration_originalTableName = ref<string>('');
  const accountStoreTableConfiguration_originalFloorName = ref<string>('');
  const accountStoreTableConfiguration_isAlreadyHaveTable = ref(false);
  const accountStoreTableConfiguration_isEditableMode = ref(false);
  const accountStoreTableConfiguration_isUsingPutMethod = ref(false);
  const accountStoreTableConfiguration_isShowDialogExitConfirmation = ref(false);
  const accountStoreTableConfiguration_isOperationSuccessful = ref(false);
  const accountStoreTableConfiguration_lists = ref<IAccountStoreTable[]>([]);

  /**
   * @description Form validations
   */
  const accountStoreTableConfiguration_formRules = computed(() => ({
    configurations: {
      $each: helpers.forEach({
        floorName: { required },
        tables: {
          $each: {
            name: { required },
            seats: { required },
            shape: { required },
            isEnableQrCode: { type: Boolean }, // Assuming this is a boolean field
          },
        },
      }),
    },
  }));
  const accountStoreTableConfiguration_formRulesOfAddFloor = computed(() => ({
    floorName: { required },
  }));
  const accountStoreTableConfiguration_formRulesOfAddTable = computed(() => ({
    name: { required },
    seats: { required },
    shape: { required },
  }));

  const accountStoreTableConfiguration_formValidations = useVuelidate(
    accountStoreTableConfiguration_formRules,
    accountStoreTableConfiguration_formData,
    {
      $autoDirty: true,
    },
  );
  const accountStoreTableConfiguration_formValidationsOfAddFloor = useVuelidate(
    accountStoreTableConfiguration_formRulesOfAddFloor,
    accountStoreTableConfiguration_formDataOfAddFloor,
    {
      $autoDirty: true,
    },
  );

  const accountStoreTableConfiguration_formValidationsOfAddTable = useVuelidate(
    accountStoreTableConfiguration_formRulesOfAddTable,
    accountStoreTableConfiguration_formDataOfAddTable,
    {
      $autoDirty: true,
    },
  );

  /**
   * @description Handle fetch api outlet. We call the fetchOutlet_createNewStoreTable function from the store to handle the request.
   */
  const accountStoreTableConfiguration_fetchOutletCreateNewStoreTable = async (): Promise<void> => {
    try {
      await outletStore.fetchOutlet_createNewStoreTable(accountStoreTableConfiguration_formData, {
        ...httpAbort_registerAbort(ACCOUNT_STORE_TABLE_CREATE_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Table configuration saved successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      accountStoreTableConfiguration_isOperationSuccessful.value = true;

      setTimeout(() => {
        router.push({
          name: 'account.store.detail',
          params: { id: route.params.id },
        });
      }, 1000);
    } catch (error: unknown) {
      accountStoreTableConfiguration_isOperationSuccessful.value = false;
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api outlet. We call the fetchOutlet_deleteStoreTable function from the store to handle the request.
   */
  const accountStoreTableConfiguration_fetchDeleteStoreTable = async (tableId: string): Promise<void> => {
    try {
      await outletStore.fetchOutlet_deleteStoreTable(tableId, {
        ...httpAbort_registerAbort(ACCOUNT_STORE_TABLE_DELETE_REQUEST),
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
   * @description Handle fetch api outlet. We call the fetchOutlet_storeTable function from the store to handle the request.
   */
  const accountStoreTableConfiguration_fetchOutletStoreTable = async (): Promise<void> => {
    try {
      const result = await outletStore.fetchOutlet_storeTable({
        ...httpAbort_registerAbort(ACCOUNT_STORE_TABLE_LIST_REQUEST),
      });

      if (result.data.length > 0) {
        accountStoreTableConfiguration_isUsingPutMethod.value = true;
        accountStoreTableConfiguration_onMappingExistingTableData(result.data);
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
   * @description Handle fetch api outlet. We call the fetchOutlet_updateStoreTable function from the store to handle the request.
   */
  const accountStoreTableConfiguration_fetchUpdateStoreTable = async (): Promise<void> => {
    try {
      await outletStore.fetchOutlet_updateStoreTable(
        outlet_selectedOutletOnAccountPage.value!.id,
        accountStoreTableConfiguration_formData,
        {
          ...httpAbort_registerAbort(ACCOUNT_STORE_TABLE_DELETE_REQUEST),
        },
      );

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Table configuration updated successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      accountStoreTableConfiguration_isOperationSuccessful.value = true;

      setTimeout(() => {
        router.push({
          name: 'account.store.detail',
          params: { id: route.params.id },
        });
      }, 1000);
    } catch (error: unknown) {
      accountStoreTableConfiguration_isOperationSuccessful.value = false;
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for creating a new floor configuration form data
   */
  const accountStoreTableConfiguration_addFloor = (): void => {
    try {
      if (accountStoreTableConfiguration_isEditableMode.value) {
        // If in edit mode, update the existing floor
        const existingFloor = accountStoreTableConfiguration_formData.configurations.find(
          config => config.floorName === accountStoreTableConfiguration_existingFloorName.value,
        );

        if (existingFloor) {
          existingFloor.floorName = accountStoreTableConfiguration_formDataOfAddFloor.floorName;
        } else {
          // If the floor does not exist, add a new one
          accountStoreTableConfiguration_formData.configurations.push({
            floorName: accountStoreTableConfiguration_formDataOfAddFloor.floorName,
            tables: [],
          });
        }
      } else {
        // If not in edit mode, create a new floor
        accountStoreTableConfiguration_formData.configurations.push({
          floorName: accountStoreTableConfiguration_formDataOfAddFloor.floorName,
          tables: [],
        });
      }
    } catch (error) {
      console.error('Error adding floor configuration:', error);
    } finally {
      // Reset the form data and validators after adding a new floor
      accountStoreTableConfiguration_formDataOfAddFloor.floorName = '';
      accountStoreTableConfiguration_existingFloorName.value = '';
      accountStoreTableConfiguration_isEditableMode.value = false;
      accountStoreTableConfiguration_formValidationsOfAddFloor.value.$reset();
    }
  };

  /**
   * @description Handle business logic for creating a new table configuration form data or editing existing one
   */
  const accountStoreTableConfiguration_addTable = (): void => {
    try {
      // Check if we're in edit mode
      if (accountStoreTableConfiguration_isEditableMode.value) {
        // Edit existing table
        const originalFloor = accountStoreTableConfiguration_formData.configurations.find(
          config => config.floorName === accountStoreTableConfiguration_originalFloorName.value,
        );

        if (originalFloor && originalFloor.tables) {
          const tableIndex = originalFloor.tables.findIndex(
            table => table.name === accountStoreTableConfiguration_originalTableName.value,
          );

          if (tableIndex !== -1) {
            const existingTable = originalFloor.tables[tableIndex];

            // Check if floor name changed
            if (
              accountStoreTableConfiguration_originalFloorName.value ===
              accountStoreTableConfiguration_formDataOfAddTable.floorName
            ) {
              // Same floor, just update the table data
              originalFloor.tables[tableIndex] = {
                ...existingTable, // Preserve all existing fields including id, uid, etc.
                ...accountStoreTableConfiguration_formDataOfAddTable,
                // Preserve position and size from existing table
                positionX: existingTable.positionX,
                positionY: existingTable.positionY,
                width: existingTable.width,
                height: existingTable.height,
              };
            } else {
              // Floor name changed - move table to new floor
              // Remove table from original floor
              originalFloor.tables.splice(tableIndex, 1);

              // If original floor becomes empty, remove it
              if (originalFloor.tables.length === 0) {
                const originalFloorIndex = accountStoreTableConfiguration_formData.configurations.findIndex(
                  config => config.floorName === accountStoreTableConfiguration_originalFloorName.value,
                );
                if (originalFloorIndex !== -1) {
                  accountStoreTableConfiguration_formData.configurations.splice(originalFloorIndex, 1);
                }
              }

              // Add table to new floor
              const targetFloor = accountStoreTableConfiguration_formData.configurations.find(
                config => config.floorName === accountStoreTableConfiguration_formDataOfAddTable.floorName,
              );

              if (targetFloor) {
                targetFloor.tables!.push({
                  ...existingTable, // Preserve all existing fields including id, uid, etc.
                  ...accountStoreTableConfiguration_formDataOfAddTable,
                  positionX: existingTable.positionX,
                  positionY: existingTable.positionY,
                  width: existingTable.width,
                  height: existingTable.height,
                });
              } else {
                // Create new floor if it doesn't exist
                accountStoreTableConfiguration_formData.configurations.push({
                  floorName: accountStoreTableConfiguration_formDataOfAddTable.floorName,
                  tables: [
                    {
                      ...existingTable, // Preserve all existing fields including id, uid, etc.
                      ...accountStoreTableConfiguration_formDataOfAddTable,
                      positionX: existingTable.positionX,
                      positionY: existingTable.positionY,
                      width: existingTable.width,
                      height: existingTable.height,
                    },
                  ],
                });
              }
            }
          }
        }
      } else {
        // Add new table (existing logic)
        let width = 0;
        let height = 0;
        let positionX = 0;
        let positionY = 0;

        if (accountStoreTableConfiguration_formDataOfAddTable.shape === 'RECTANGLE') {
          width = 200;
          height = 100;
        } else if (accountStoreTableConfiguration_formDataOfAddTable.shape === 'ROUND') {
          width = 100;
          height = 100;
        } else {
          width = 100;
          height = 100;
        }

        // Check if the floor already exists
        const existingFloor = accountStoreTableConfiguration_formData.configurations.find(
          config => config.floorName === accountStoreTableConfiguration_formDataOfAddTable.floorName,
        );

        if (existingFloor) {
          if (existingFloor.tables!.length > 0) {
            // If the floor exists, we can add the new table to it
            const lastTable = existingFloor.tables![existingFloor.tables!.length - 1];

            // Calculate position for the new table
            positionX = lastTable.positionX + lastTable.width + 40; // 40 is the gap between tables
            positionY = lastTable.positionY; // Keep the same Y position for simplicity
          }

          // Add the new table to the existing floor
          existingFloor.tables!.push({
            ...accountStoreTableConfiguration_formDataOfAddTable,
            positionX,
            positionY,
            width, // Default width
            height, // Default height
          });
        } else {
          // If the floor doesn't exist, create a new one with the table
          accountStoreTableConfiguration_formData.configurations.push({
            floorName: accountStoreTableConfiguration_formDataOfAddTable.floorName,
            tables: [
              {
                ...accountStoreTableConfiguration_formDataOfAddTable,
                positionX: 40,
                positionY: 40,
                width,
                height,
              },
            ],
          });
        }
      }
    } catch (error) {
      console.error('Error adding/editing table configuration:', error);
    } finally {
      // Reset the form data and validators after adding/editing a table
      Object.assign(accountStoreTableConfiguration_formDataOfAddTable, {
        floorName: '',
        name: '',
        seats: 0,
        shape: 'SQUARE',
        width: 0,
        height: 0,
        positionX: 0,
        positionY: 0,
        isEnableQrCode: false,
      });
      accountStoreTableConfiguration_originalTableName.value = '';
      accountStoreTableConfiguration_originalFloorName.value = '';
      accountStoreTableConfiguration_isEditableMode.value = false;
      accountStoreTableConfiguration_formValidationsOfAddTable.value.$reset();
    }
  };

  /**
   * @description Handle business logic for checking if a user has already fill the floor or table form
   *
   * @returns boolean - true if the user has already filled the form, false otherwise
   */
  const accountStoreTableConfiguration_checkIfAlreadyHaveTable = (): boolean => {
    accountStoreTableConfiguration_isAlreadyHaveTable.value =
      accountStoreTableConfiguration_formData.configurations.some(
        config => config.tables && config.tables.length > 0,
      );

    return accountStoreTableConfiguration_isAlreadyHaveTable.value;
  };

  /**
   * @description Handle business logic for close dialog add floor
   */
  const accountStoreTableConfiguration_onCloseDialogAddFloor = (): void => {
    const argsEventEmitter = {
      id: 'table-configuration-add-floor-dialog',
      isOpen: false,
    };

    // Reset form data and validators when closing dialog
    accountStoreTableConfiguration_formDataOfAddFloor.floorName = '';
    accountStoreTableConfiguration_existingFloorName.value = '';
    accountStoreTableConfiguration_isEditableMode.value = false;
    accountStoreTableConfiguration_formValidationsOfAddFloor.value.$reset();

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for close dialog add table
   */
  const accountStoreTableConfiguration_onCloseDialogAddTable = (): void => {
    try {
      const argsEventEmitter = {
        id: 'table-configuration-add-table-dialog',
        isOpen: false,
      };

      eventBus.emit('AppBaseDialog', argsEventEmitter);
    } catch (error) {
      console.error('Error closing dialog add table:', error);
    } finally {
      // Reset the form data after closing the dialog
      accountStoreTableConfiguration_editableData.value = null;
      Object.assign(accountStoreTableConfiguration_formDataOfAddTable, {
        floorName: '',
        name: '',
        seats: 0,
        shape: 'SQUARE',
        width: 0,
        height: 0,
        positionX: 0,
        positionY: 0,
        isEnableQrCode: false,
      });
      accountStoreTableConfiguration_originalTableName.value = '';
      accountStoreTableConfiguration_originalFloorName.value = '';
      accountStoreTableConfiguration_isEditableMode.value = false;
      accountStoreTableConfiguration_formValidationsOfAddTable.value.$reset();
    }
  };

  /**
   * @description Handle business logic for mapping the existing table data on database to the form
   */
  const accountStoreTableConfiguration_onMappingExistingTableData = (tables: IOutletTable[]) => {
    tables.forEach(table => {
      accountStoreTableConfiguration_formData.configurations.push({
        floorName: table.floorName,
        tables:
          table.storeTables?.map(storeTable => ({
            ...storeTable,
            floorId: table.storeId,
            floorName: table.floorName, // Ensure each table has the floor name
          })) || [],
      });
    });
  };

  /**
   * @description Handle business logic for show dialog add floor
   */
  const accountStoreTableConfiguration_onShowDialogAddFloor = (): void => {
    // Reset form data and validators when opening dialog
    accountStoreTableConfiguration_formDataOfAddFloor.floorName = '';
    accountStoreTableConfiguration_existingFloorName.value = '';
    accountStoreTableConfiguration_isEditableMode.value = false;
    accountStoreTableConfiguration_formValidationsOfAddFloor.value.$reset();

    const argsEventEmitter = {
      id: 'table-configuration-add-floor-dialog',
      isOpen: true,
      isUsingClosableButton: false,
      width: '534px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for show dialog add table
   */
  const accountStoreTableConfiguration_onShowDialogAddTable = (
    configuration: IAccountStoreTableConfigurationFormDataOfAddFloor,
  ): void => {
    // Reset form data and validators when opening dialog
    Object.assign(accountStoreTableConfiguration_formDataOfAddTable, {
      floorName: configuration.floorName,
      name: '',
      seats: 0,
      shape: 'SQUARE',
      width: 0,
      height: 0,
      positionX: 0,
      positionY: 0,
      isEnableQrCode: false,
    });
    accountStoreTableConfiguration_isEditableMode.value = false;
    accountStoreTableConfiguration_formValidationsOfAddTable.value.$reset();

    const argsEventEmitter = {
      id: 'table-configuration-add-table-dialog',
      isOpen: true,
      isUsingClosableButton: false,
      width: '534px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for showing dialog confirmation delete table
   */
  const accountStoreTableConfiguration_onShowDialogDeleteTable = (floorName: string, tableName: string): void => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'account-store-table-dialog-confirmation',
      description: `
        <span class="font-normal text-black-secondary text-center text-sm">
          Are you sure you want to delete the table
          <strong>${tableName}</strong> from floor <strong>${floorName}</strong>?
        </span>`,
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        eventBus.emit('AppBaseDialog', { id: 'account-store-table-dialog-confirmation', isOpen: false });
      },
      onClickButtonSecondary: () => {
        // Logic to delete the table goes here
        const floor = accountStoreTableConfiguration_formData.configurations.find(
          config => config.floorName === floorName,
        );

        if (floor) {
          floor.tables = floor.tables?.filter(table => table.name !== tableName);

          if (floor.tables!.length === 0) {
            // If no tables left, remove the floor
            accountStoreTableConfiguration_formData.configurations =
              accountStoreTableConfiguration_formData.configurations.filter(
                config => config.floorName !== floorName,
              );
          }
        }

        eventBus.emit('AppBaseDialog', { id: 'table-configuration-add-table-dialog', isOpen: false });
        eventBus.emit('AppBaseDialog', { id: 'account-store-table-dialog-confirmation', isOpen: false });
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete',
      title: 'Delete Table',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle business logic for show dialog edit floor
   */
  const accountStoreTableConfiguration_onShowDialogEditFloor = (floorName: string): void => {
    accountStoreTableConfiguration_existingFloorName.value = floorName;
    accountStoreTableConfiguration_isEditableMode.value = true;

    const floor = accountStoreTableConfiguration_formData.configurations.find(
      config => config.floorName === floorName,
    );

    if (floor) {
      accountStoreTableConfiguration_formDataOfAddFloor.floorName = floor.floorName;
      accountStoreTableConfiguration_isEditableMode.value = true;
      // Reset validators when opening edit dialog
      accountStoreTableConfiguration_formValidationsOfAddFloor.value.$reset();

      const argsEventEmitter = {
        id: 'table-configuration-add-floor-dialog',
        isOpen: true,
        isUsingClosableButton: false,
        width: '534px',
      };

      eventBus.emit('AppBaseDialog', argsEventEmitter);
    }
  };

  /**
   * @description Handle business logic for show dialog edit table
   */
  const accountStoreTableConfiguration_onShowDialogEditTable = (
    table: IAccountStoreTableConfigurationFormDataOfAddTable,
  ): void => {
    // Reset validators when opening edit dialog
    accountStoreTableConfiguration_formValidationsOfAddTable.value.$reset();

    // Store the original table name and floor name for editing
    accountStoreTableConfiguration_originalTableName.value = table.name;
    accountStoreTableConfiguration_originalFloorName.value = table.floorName;

    Object.assign(accountStoreTableConfiguration_formDataOfAddTable, {
      ...table,
      floorName: table.floorName || '',
    });
    accountStoreTableConfiguration_isEditableMode.value = true;

    const argsEventEmitter = {
      id: 'table-configuration-add-table-dialog',
      isOpen: true,
      isUsingClosableButton: false,
      width: '564px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for show dialog confirmation enable QR Code
   */
  const accountStoreTableConfiguration_onShowDialogEnableQrCode = (): void => {
    if (!accountStoreTableConfiguration_formDataOfAddTable.name) {
      const argsEventEmitter: IPropsDialogConfirmation = {
        id: 'account-store-table-dialog-confirmation',
        isOpen: true,
        description: 'Please fill in the table name before enabling QR Code.',
        isUsingButtonSecondary: false,
        onClickButtonPrimary: () => {
          eventBus.emit('AppBaseDialog', { id: 'account-store-table-dialog-confirmation', isOpen: false });
        },
        textButtonPrimary: 'OK',
        title: 'Enable QR Code',
        type: 'info',
      };

      eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);

      accountStoreTableConfiguration_formDataOfAddTable.isEnableQrCode = false;
      return;
    }
  };

  /**
   * @description Handle business logic for showing dialog exit confirmation
   */
  // const accountStoreTableConfiguration_onShowDialogExitConfirmation = (): void => {
  //   const argsEventEmitter: IPropsDialogConfirmation = {
  //     id: 'account-store-table-dialog-confirmation',
  //     isOpen: true,
  //     description: 'Are you sure you want to exit without saving changes?',
  //     isUsingButtonSecondary: true,
  //     onClickButtonPrimary: () => {
  //       eventBus.emit('AppBaseDialog', { id: 'account-store-table-dialog-confirmation', isOpen: false });
  //     },
  //     textButtonPrimary: 'Cancel',
  //     textButtonSecondary: 'Exit',
  //     title: 'Exit Confirmation',
  //     type: 'info',
  //   };

  //   eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  // };

  /**
   * @description Handle business logic for submit form add floor
   */
  const accountStoreTableConfiguration_onSubmitFormAddFloor = (): void => {
    try {
      accountStoreTableConfiguration_formValidationsOfAddFloor.value.$touch();

      if (accountStoreTableConfiguration_formValidationsOfAddFloor.value.$invalid) {
        return;
      }

      accountStoreTableConfiguration_addFloor();
      accountStoreTableConfiguration_onCloseDialogAddFloor();
    } catch (error) {
      console.error('Error submitting form add floor:', error);
      return;
    }
  };

  /**
   * @description Handle business logic for submit form add floor
   */
  const accountStoreTableConfiguration_onSubmitFormAddTable = (): void => {
    try {
      // Use the table-specific validation instead of the main form validation
      accountStoreTableConfiguration_formValidationsOfAddTable.value.$touch();

      if (accountStoreTableConfiguration_formValidationsOfAddTable.value.$invalid) {
        return;
      }

      accountStoreTableConfiguration_addTable();
      accountStoreTableConfiguration_onCloseDialogAddTable();
    } catch (error) {
      console.error('Error submitting form add table:', error);
      return;
    }
  };

  /**
   * @description Handle business logic for submitting the table configurations
   */
  const accountStoreTableConfiguration_onSubmit = async (): Promise<void> => {
    try {
      if (accountStoreTableConfiguration_isUsingPutMethod.value) {
        await accountStoreTableConfiguration_fetchUpdateStoreTable();
      } else {
        await accountStoreTableConfiguration_fetchOutletCreateNewStoreTable();
      }
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    accountStoreTableConfiguration_addFloor,
    accountStoreTableConfiguration_checkIfAlreadyHaveTable,
    accountStoreTableConfiguration_editableData,
    accountStoreTableConfiguration_fetchDeleteStoreTable,
    accountStoreTableConfiguration_fetchOutletStoreTable,
    accountStoreTableConfiguration_formData,
    accountStoreTableConfiguration_formDataOfAddFloor,
    accountStoreTableConfiguration_formDataOfAddTable,
    accountStoreTableConfiguration_formValidations,
    accountStoreTableConfiguration_formValidationsOfAddFloor,
    accountStoreTableConfiguration_formValidationsOfAddTable,
    accountStoreTableConfiguration_isAlreadyHaveTable,
    accountStoreTableConfiguration_isEditableMode,
    accountStoreTableConfiguration_isOperationSuccessful,
    accountStoreTableConfiguration_isShowDialogExitConfirmation,
    accountStoreTableConfiguration_lists,
    accountStoreTableConfiguration_listShapes: ACCOUNT_STORE_TABLE_CONFIGURATION_LIST_SHAPES,
    accountStoreTableConfiguration_onCloseDialogAddFloor,
    accountStoreTableConfiguration_onCloseDialogAddTable,
    accountStoreTableConfiguration_onShowDialogAddFloor,
    accountStoreTableConfiguration_onShowDialogAddTable,
    accountStoreTableConfiguration_onShowDialogEditFloor,
    accountStoreTableConfiguration_onShowDialogDeleteTable,
    accountStoreTableConfiguration_onShowDialogEditTable,
    accountStoreTableConfiguration_onShowDialogEnableQrCode,
    accountStoreTableConfiguration_onSubmit,
    accountStoreTableConfiguration_onSubmitFormAddFloor,
    accountStoreTableConfiguration_onSubmitFormAddTable,
  };
};
