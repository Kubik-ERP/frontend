import { ref } from "vue";
import { useRouter } from "vue-router";
import { useVoucherStore } from "../store";
import type { IVoucherEditRequest } from "../interfaces/voucher-edit.interface";
import type { IVoucherViewResponse } from "../interfaces/voucher-view.interface";
import eventBus from "@/plugins/mitt";
import useVuelidate from "@vuelidate/core";

export const useVoucherEditService = () => {
  const store = useVoucherStore();
  const router = useRouter();

  const voucherEdit_isLoading = ref(false);
  const voucherEdit_voucher = ref<IVoucherViewResponse | null>(null);

  const voucherEdit_formData = ref<IVoucherEditRequest>({
    name: "",
    promoCode: "",
    amount: 0,
    minPrice: 0,
    maxPrice: 0,
    startPeriod: "",
    endPeriod: "",
    status: "active",
    quota: 0,
    isPercent: false,
    hasProducts: {
      type: "all",
      products: [],
    },
  });

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
      name: voucherEdit_formData.value.name,
      code: voucherEdit_formData.value.promoCode,
      amount: voucherEdit_formData.value.amount,
      minPrice: voucherEdit_formData.value.minPrice,
      startDate: voucherEdit_formData.value.startPeriod,
      endDate: voucherEdit_formData.value.endPeriod,
      status: voucherEdit_formData.value.status,
      quota: voucherEdit_formData.value.quota,
      is_percentage: voucherEdit_formData.value.isPercent,
      maxDiscountPrice: voucherEdit_formData.value.maxPrice,
      products: voucherEdit_formData.value.hasProducts.products,
      type: voucherEdit_formData.value.hasProducts.type,
    }));

    const voucherFormDataValidations = useVuelidate(
      voucherFormDataRules,
      voucherFormDataValidatable,
      {
        $autoDirty: true,
      }
    );

  /** Fetch voucher by ID dan isi form */
  const voucherEdit_fetchVoucher = async (voucherId: string) => {
    voucherEdit_isLoading.value = true;
    try {
      const response = await store.voucherList_getVoucherById(voucherId);
      voucherEdit_voucher.value = response;

      const data = response.data;
      console.log(data.voucherHasProducts)
      voucherEdit_formData.value = {
        name: data.name,
        promoCode: data.promoCode,
        amount: data.amount,
        minPrice: data.minPrice,
        startPeriod: data.startPeriod,
        endPeriod: data.endPeriod,
        maxPrice: data.maxPrice,
        status: data.status,
        quota: data.quota,
        isPercent: data.isPercent,
        hasProducts: {
          type: data.voucherHasProducts?.length ? "specific" : "all",
          products: data.voucherHasProducts?.map((p) => p.productsId) || [],
        },
      };
    } catch (error) {
      console.error("Failed to fetch voucher for edit:", error);
    } finally {
      voucherEdit_isLoading.value = false;
    }
  };

  /** Submit update voucher */
  const voucherEdit_submit = async (voucherId: string, payload: IVoucherEditRequest) => {
    try {
      voucherEdit_isLoading.value = true;
      const result = await store.voucherList_updateVoucher(voucherId, payload);


      if (!result || result.statusCode !== 200) {
        throw new Error(result?.message || "Failed to create voucher.");
      }

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: result.message || "Voucher created successfully!",
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      router.push({ name: "voucher.view", params: { id: voucherId } });
    } catch (error: unknown) {
      if (error instanceof Error) {
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: EToastType.DANGER,
          message: error.message || "Failed to create voucher.",
          position: EToastPosition.TOP_RIGHT,
        };
        eventBus.emit('AppBaseToast', argsEventEmitter);
      }
      console.error("❌ Error creating voucher:", error);
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.DANGER,
        message: "Failed to create voucher.",
        position: EToastPosition.TOP_RIGHT,
      };
      eventBus.emit('AppBaseToast', argsEventEmitter);
      throw error;
    } finally {
      voucherEdit_isLoading.value = false;
    }
  };

  return {
    voucherEdit_isLoading,
    voucherFormDataValidations,
    voucherEdit_voucher,
    voucherEdit_formData,
    voucherEdit_fetchVoucher,
    voucherEdit_submit,
  };
};
