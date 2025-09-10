import { ref, computed } from 'vue';
import { IVoucherCreateProvided, IVoucherFormData, mapFormToVoucherPayload } from '../interfaces';
import { useProductService } from '@/modules/catalog-product/services/catalog-product.service';
import { IProduct } from '@/modules/catalog-product/interfaces';
import { useVoucherStore } from '../store';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import eventBus from '@/plugins/mitt';

export const useVoucherCreateService = (): IVoucherCreateProvided => {
  const store = useVoucherStore();
  const router = useRouter();
  /* ----------------------------------
   * 1️⃣ Form Data
   * ---------------------------------- */
  const voucherFormData = ref<IVoucherFormData>({
    name: '',
    code: '',
    amount: 0,
    minPrice: 0,
    startDate: '',
    endDate: '',
    status: '',
    quota: 0,
    is_percentage: false,
    products: [],
    type: 'all',
  });

  /* ----------------------------------
   * 2️⃣ Form Errors
   * ---------------------------------- */
  const voucherFormDataRules = computed(() => ({
    name: { required },
    code: { required },
    amount: { required },
    startDate: { required },
    endDate: { required },
    status: { required },
    type: { required },
  }));

  const voucherFormDataValidatable = computed(() => voucherFormData.value);

  const voucherFormDataValidations = useVuelidate(voucherFormDataRules, voucherFormDataValidatable, {
    $autoDirty: true,
  });

  const voucherFormIsValid = computed(() => !voucherFormDataValidations.value.$invalid);

  const voucherFormIsLoading = ref<boolean>(false);

  /* ----------------------------------
   * 3️⃣ Submit Form
   * ---------------------------------- */
  const voucherFormOnSubmit = async (): Promise<void> => {
    const isFormCorrect = await voucherFormDataValidations.value.$validate();
    if (!isFormCorrect) {
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.DANGER,
        message: 'Please fill all required fields',
        position: EToastPosition.TOP_RIGHT,
      };
      eventBus.emit('AppBaseToast', argsEventEmitter);
      return;
    }

    voucherFormIsLoading.value = true;
    try {
      const payload = mapFormToVoucherPayload(voucherFormData.value);

      const result = await store.voucherList_createVoucher(payload);

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: result.message || 'Voucher created successfully!',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      voucherFormReset();

      if (result.data.id !== '') {
        router.push({ name: 'voucher.index' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      voucherFormIsLoading.value = false;
    }
  };

  /* ----------------------------------
   * 4️⃣ Reset & Cancel
   * ---------------------------------- */
  const voucherFormReset = (): void => {
    voucherFormData.value = {
      name: '',
      code: '',
      amount: 0,
      minPrice: 0,
      startDate: '',
      endDate: '',
      status: '',
      quota: 0,
      is_percentage: false,
      products: [],
      type: 'all',
    };
  };

  const voucherFormOnCancel = (): void => {
    voucherFormReset();
  };

  /* ----------------------------------
   *  Fetch Data Mode Edit
   * ---------------------------------- */
  const voucherFormFetchData = async (id?: string): Promise<void> => {
    if (!id) return;
    try {
      voucherFormIsLoading.value = true;
      const data = await store.voucherList_getVoucherById(id);
      voucherFormData.value = {
        ...voucherFormData.value,
        ...data,
      };
    } catch (error) {
      console.error('❌ Failed to fetch voucher:', error);
    } finally {
      voucherFormIsLoading.value = false;
    }
  };

  /* ----------------------------------
   * 6️⃣ Product List untuk Voucher
   * ---------------------------------- */
  const productService = useProductService();
  const voucherProductList = ref<IProduct[]>([]);

  const fetchVoucherProductList = async (): Promise<void> => {
    try {
      const response = await productService.getAllProducts(1, 100, '');
      voucherProductList.value = response.products;
    } catch (error) {
      console.error('❌ Error fetching voucher product list:', error);
    }
  };

  fetchVoucherProductList();

  return {
    voucherFormData,
    voucherFormDataValidations,
    voucherFormIsLoading,
    voucherFormOnCancel,
    voucherFormOnSubmit,
    voucherFormReset,
    voucherFormFetchData,
    voucherProductList,
    voucherFormIsValid,
  };
};
