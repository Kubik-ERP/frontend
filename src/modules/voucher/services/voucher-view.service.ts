import { IVoucherViewProvided, IVoucherViewResponse } from "../interfaces/voucher-view.interface";
import { useVoucherStore } from "../store";

export const useVoucherViewService = (): IVoucherViewProvided => {
  const store = useVoucherStore();
  const router = useRouter();

  const voucherView_isLoading = ref(false);
  const voucherView_voucher = ref<IVoucherViewResponse | null>(null);

  const voucherView_fetchVoucher = async (voucherId: string): Promise<void> => {
    voucherView_isLoading.value = true;
    try {
      const response = await store.voucherList_getVoucherById(voucherId);
      voucherView_voucher.value = response;
    } catch (error) {
      console.error("Failed to fetch voucher:", error);
    } finally {
      voucherView_isLoading.value = false;
    }
  };

  const voucherView_handleEdit = (voucherId: string): void => {
    router.push({ name: 'voucher.edit', params: { id: voucherId } });
  };

  return {
    voucherView_isLoading,
    voucherView_voucher,
    voucherView_fetchVoucher,
    voucherView_handleEdit,
  };
};
