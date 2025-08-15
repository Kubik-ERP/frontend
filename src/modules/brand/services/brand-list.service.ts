import { DataTableSortEvent } from 'primevue';
import { BRAND_LIST_COLUMNS } from '../constants';
import { IBrandListProvided, IBrandListRequestQuery } from '../interfaces/brand-list.interface';
import { IBrand } from '../interfaces';
import eventBus from '@/plugins/mitt';
import { useBrandStore } from '../store';

export const useBrandListService = (): IBrandListProvided => {
  const store = useBrandStore();
  const { brandList_isLoading, brandList, brandFormMode, brand_editingItem } = storeToRefs(store);

  const brand_queryParams = reactive<IBrandListRequestQuery>({
    page: 1,
    pageSize: 10,
    search: null,
    orderBy: null,
    orderDirection: null,
  });

  const brand_fetchData = async () => {
    try {
      await store.brandList_fetchList(brand_queryParams, {
        paramsSerializer: useParamsSerializer,
      });
    } catch (error: unknown) {
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
  };

  watch(
    brand_queryParams,
    () => {
      brand_fetchData();
    },
    { deep: true, immediate: true },
  );

  const brand_onChangePage = (page: number) => {
    brand_queryParams.page = page;
  };

  const brand_handleOnSortChange = (event: DataTableSortEvent) => {
    const sortField = event.sortField as string;
    const sortOrder = event.sortOrder as number;
    brand_queryParams.orderBy = sortField === 'id' ? 'created_at' : 'id';

    if (sortOrder === 1) brand_queryParams.orderDirection = 'asc';
    else if (sortOrder === -1) brand_queryParams.orderDirection = 'desc';
    else brand_queryParams.orderDirection = null;

    brand_fetchData();
  };

  const brand_handleOnSearch = (searchTerm: string) => {
    brand_queryParams.search = searchTerm;
    brand_fetchData();
  };

  const brand_onCreate = () => {
    store.setFormMode('create'); // ✅ gunakan action store
    eventBus.emit('AppBaseDialog', {
      id: 'brand-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    });
  };

  const brand_onEdit = (brandId: string) => {
    const foundBrand = brandList.value.data.items.find((brand: IBrand) => brand.id === brandId) ?? null;
    store.setFormMode('edit', foundBrand); // ✅ gunakan action store
    eventBus.emit('AppBaseDialog', {
      id: 'brand-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    });
  };

  const brandList_deleteBrand = async (brandId: string): Promise<void> => {
    const brand = brandList.value.data.items.find(b => b.id === brandId);

    if (!brand) {
      console.error(`Brand with ID ${brandId} not found`);
      return;
    }

    // Jika brand punya items di dalamnya (kalau ada field seperti isHaveItems)
    if (brand.isHaveItems) {
      const argsEventEmitter: IPropsDialogConfirmation = {
        id: 'brand-dialog-confirmation',
        description: 'This brand has items associated with it and cannot be deleted.',
        iconName: 'info',
        isOpen: true,
        onClickButtonPrimary: () => {
          // Tutup dialog
          eventBus.emit('AppBaseDialogConfirmation', {
            id: 'brand-dialog-confirmation',
            isOpen: false,
          } as IPropsDialogConfirmation);
        },
        textButtonPrimary: 'Cancel',
        title: 'Cannot delete brand',
        type: 'error',
      };
      eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
      return;
    }

    const handle_delete = async (brandId: string) => {
      try {
        const res = await store.brandList_deleteBrand(brandId);
        if (res.statusCode) {
          const argsEventEmitter: IPropsToast = {
            isOpen: true,
            type: EToastType.SUCCESS,
            message: res.message || 'Brand Action successfully!',
            position: EToastPosition.TOP_RIGHT,
          };

          eventBus.emit('AppBaseDialogNotification', argsEventEmitter);
        } else {
          const argsEventEmitter: IPropsToast = {
            isOpen: true,
            type: EToastType.DANGER,
            message: res.message || 'Brand Action failed!',
            position: EToastPosition.TOP_RIGHT,
          };

          eventBus.emit('AppBaseDialogNotification', argsEventEmitter);
        }
      } catch (error: unknown) {
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
      }
    };

    // Kalau bisa dihapus, tampilkan konfirmasi
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'brand-dialog-confirmation',
      description: 'This action cannot be undone, and the brand you remove will be deleted permanently.',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      onClickButtonPrimary: () => {
        // Tutup dialog
        eventBus.emit('AppBaseDialogConfirmation', {
          id: 'brand-dialog-confirmation',
          isOpen: false,
        } as IPropsDialogConfirmation);
      },
      onClickButtonSecondary: async () => {
        // Tutup dialog
        eventBus.emit('AppBaseDialogConfirmation', {
          id: 'brand-dialog-confirmation',
          isOpen: false,
        } as IPropsDialogConfirmation);

        await handle_delete(brandId);
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete Brand',
      title: 'Are you sure you want to delete this brand?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  return {
    brand_columns: BRAND_LIST_COLUMNS,
    brand_fetchData,
    brand_isLoading: brandList_isLoading,
    brand_onChangePage,
    brand_handleOnSortChange,
    brand_handleOnSearch,
    brand_queryParams,
    brand_values: brandList,
    brand_onCreate,
    brand_onEdit,
    brand_onDelete: brandList_deleteBrand,
    brandFormMode,
    brand_editingItem,
  };
};
