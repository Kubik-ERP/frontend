import { ref } from "vue";
import {
  IVoucherCreateProvided,
  IVoucherFormData,
  mapFormToVoucherPayload,
} from "../interfaces";
import { useProductService } from "@/modules/catalog-product/services/catalog-product.service";
import { IProduct } from "@/modules/catalog-product/interfaces";
import { useVoucherStore } from "../store";
import useVuelidate from "@vuelidate/core";
import eventBus from "@/plugins/mitt";

export const useVoucherCreateService = (): IVoucherCreateProvided => {
  const store = useVoucherStore();
  // const router = useRouter();
  /* ----------------------------------
   * 1️⃣ Form Data
   * ---------------------------------- */
  const voucherFormData = ref<IVoucherFormData>({
    name: "",
    code: "",
    amount: 0,
    minPrice: 0,
    startDate: "",
    endDate: "",
    status: "",
    quota: 0,
    is_percentage: false,
    products: [],
    type: "all",
  });

  /* ----------------------------------
   * 2️⃣ Form Errors
   * ---------------------------------- */
   const voucherFormDataRules = computed(() => ({
    name: { required: true },
    code: { required: true },
    amount: { required: true },
    minPrice: { required: false, },
    startDate: { required: true },
    endDate: { required: true },
    status: { required: true },
    quota: { required: false },
    is_percentage: { required: true },
    maxDiscountPrice: { required: false },
    products: { required: false },
    type: { required: true },
  }));

  const voucherFormDataValidatable = computed(() => ({
    name: voucherFormData.value.name,
    code: voucherFormData.value.code,
    amount: voucherFormData.value.amount,
    minPrice: voucherFormData.value.minPrice,
    startDate: voucherFormData.value.startDate,
    endDate: voucherFormData.value.endDate,
    status: voucherFormData.value.status,
    quota: voucherFormData.value.quota,
    is_percentage: voucherFormData.value.is_percentage,
    maxDiscountPrice: voucherFormData.value.maxDiscountPrice,
    products: voucherFormData.value.products,
    type: voucherFormData.value.type,
  }));

  const voucherFormDataValidations = useVuelidate(
    voucherFormDataRules,
    voucherFormDataValidatable,
    {
      $autoDirty: true,
    }
  );

  const voucherFormIsLoading = ref<boolean>(false);

  /* ----------------------------------
   * 3️⃣ Submit Form
   * ---------------------------------- */
  const voucherFormOnSubmit = async (): Promise<void> => {
    voucherFormIsLoading.value = true;
    try {
      const payload = mapFormToVoucherPayload(voucherFormData.value);

      const result = await store.voucherList_createVoucher(payload);

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: result.message || "Voucher created successfully!",
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      voucherFormReset();
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
      name: "",
      code: "",
      amount: 0,
      minPrice: 0,
      startDate: "",
      endDate: "",
      status: "",
      quota: 0,
      is_percentage: false,
      products: [],
      type: "all",
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
      console.error("❌ Failed to fetch voucher:", error);
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
      const response = await productService.getAllProducts(1, 100, "");
      voucherProductList.value = response.products;
    } catch (error) {
      console.error("❌ Error fetching voucher product list:", error);
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
  };
};
