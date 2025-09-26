import {  ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePurchaseOrderStore } from '../store';
import { useAuthenticationStore } from '@/modules/authentication/store';
import { storeToRefs } from 'pinia';
import useVuelidate from '@vuelidate/core';
import { required, minValue, helpers } from '@vuelidate/validators';
import {
  IPurchaseOrderReceivedProvided,
  IPurchaseOrderReceivedFormData,
  IPurchaseOrderReceivedProductItem,
} from '../interfaces/purchase-order-received.interface';
import { PURCHASE_ORDER_DETAIL_REQUEST } from '../constants';
import eventBus from '@/plugins/mitt';
import { useStaffMemberStore } from '@/modules/staff-member/store';

export const usePurchaseOrderReceivedService = (): IPurchaseOrderReceivedProvided => {
  const router = useRouter();
  const route = useRoute();
  const poStore = usePurchaseOrderStore();
  const staffStore = useStaffMemberStore();
  const authStore = useAuthenticationStore();
  const { httpAbort_registerAbort } = useHttpAbort();

  const { purchaseOrder_detail, purchaseOrder_isLoading } = storeToRefs(poStore);
  const { authentication_userData } = storeToRefs(authStore);

  const purchaseOrderId = computed(() => route.params.id as string);

  const purchaseOrderReceived_formData = ref<IPurchaseOrderReceivedFormData>({
    userId: null,
    productItems: [],
  });

  const purchaseOrderReceived_isOwner = computed(() => authentication_userData.value?.roles.name === 'Owner');

  const purchaseOrderReceived_listStaff = ref<IDropdownItem[]>([]);

  const purchaseOrderReceived_fetchDetails = async () => {
    await poStore.purchaseOrder_details(purchaseOrderId.value, {
      ...httpAbort_registerAbort(PURCHASE_ORDER_DETAIL_REQUEST),
    });
  };

  onMounted(async () => {
    await purchaseOrderReceived_fetchDetails();
    if (purchaseOrderReceived_isOwner.value) {
      const res = await staffStore.staffMember_getOwnerWithStaff({
        ...httpAbort_registerAbort(PURCHASE_ORDER_DETAIL_REQUEST),
      });

      purchaseOrderReceived_listStaff.value = res.data.map(staff => ({
        label: staff.fullname,
        value: staff.id,
      }));

      console.log('Owner with staff:', purchaseOrderReceived_listStaff);
    } else if (authentication_userData.value) {
      purchaseOrderReceived_formData.value.userId = authentication_userData.value.id;
    }
  });

  watch(
    purchaseOrder_detail,
    detail => {
      if (detail) {
        purchaseOrderReceived_formData.value.productItems = detail.purchaseOrderItems.map(item => ({
          id: item.id,
          purchaseOrderItemId: item.id,
          sku: item.itemInfo.sku,
          name: item.itemInfo.name,
          brandName: item.itemInfo.brandName,
          orderedQuantity: item.quantity,
          actualQuantity: item.quantity,
          notes: '',
          barcode: item.itemInfo.barcode,
        }));
      }
    },
    { immediate: true, deep: true },
  );

  const rules = computed(() => ({
    userId: {},
    productItems: {
      $each: helpers.forEach({
        actualQuantity: {
          required,
          minValue: minValue(0),
        },
      }),
    },
  }));

  const purchaseOrderReceived_validations = useVuelidate(rules, purchaseOrderReceived_formData);

  const purchaseOrderReceived_onSubmit = async () => {
    purchaseOrderReceived_validations.value.$touch();
    if (purchaseOrderReceived_validations.value.$invalid) {
      eventBus.emit('AppBaseToast', {
        isOpen: true,
        type: EToastType.DANGER,
        message: 'Please fill all required fields correctly.',
        position: EToastPosition.TOP_RIGHT,
      });
      return;
    }

    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'purchase-order-received-confirmation-dialog',
      iconName: 'confirmation',
      title: 'Are you sure you want to receive this purchase order?',
      description: 'This action will update the inventory based on the received quantities. This action cannot be undone.',
      type: 'info',
      isOpen: true,
      isUsingButtonSecondary: true,
      textButtonPrimary: 'Receive PO',
      textButtonSecondary: 'Cancel',
      width: '460px',
      onClickButtonPrimary: async () => {
        const payload = {
          userId: purchaseOrderReceived_formData.value.userId ?? null,
          productItems: purchaseOrderReceived_formData.value.productItems.map(item => ({
            id: item.purchaseOrderItemId ?? '',
            actualQuantity: item.actualQuantity,
            notes: item.notes,
          })),
        };

        try {
          await poStore.purchaseOrder_receive(purchaseOrderId.value, payload, {});
          eventBus.emit('AppBaseToast', {
            isOpen: true,
            type: EToastType.SUCCESS,
            message: 'Purchase order received successfully!',
            position: EToastPosition.TOP_RIGHT,
          });
          router.push({ name: 'purchase-order.detail', params: { id: purchaseOrderId.value } });
        } catch (error) {
          console.error('Failed to receive purchase order:', error);
        } finally {
            const closeEventEmitter: IPropsDialogConfirmation = {
                id: 'purchase-order-received-confirmation-dialog',
                isOpen: false,
            };
            eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
        }
      },
      onClickButtonSecondary: () => {
        const closeEventEmitter: IPropsDialogConfirmation = {
          id: 'purchase-order-received-confirmation-dialog',
          isOpen: false,
        };
        eventBus.emit('AppBaseDialogConfirmation', closeEventEmitter);
      },
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  const purchaseOrderReceived_onBack = () => {
    router.back();
  };

  const editingNotesForItem = ref<IPurchaseOrderReceivedProductItem | null>(null);
  const notesBuffer = ref('');

  const purchaseOrderReceived_onShowNotesDialog = (item: IPurchaseOrderReceivedProductItem) => {
    editingNotesForItem.value = item;
    notesBuffer.value = item.notes || '';
    eventBus.emit('AppBaseDialog', { id: 'po-received-notes-dialog', isOpen: true, width: '534px' });
  };

  const onCloseNotesDialog = () => {
    editingNotesForItem.value = null;
    notesBuffer.value = '';
    eventBus.emit('AppBaseDialog', { id: 'po-received-notes-dialog', isOpen: false });
  };

  const onSubmitNotesDialog = () => {
    if (editingNotesForItem.value) {
      const itemInForm = purchaseOrderReceived_formData.value.productItems.find(
        i => i.id === editingNotesForItem.value!.id,
      );
      if (itemInForm) {
        itemInForm.notes = notesBuffer.value;
      }
    }
    onCloseNotesDialog();
  };

  const purchaseOrderReceived_listColumns: IColumnDataTable[] = [
    { sortable: false, label: 'SKU', value: 'sku' },
    { sortable: false, label: 'Item Name', value: 'name' },
    { sortable: false, label: 'Ordered Qty', value: 'orderedQuantity' },
    { sortable: false, label: 'Received Qty', value: 'actualQuantity' },
    { sortable: false, label: 'Difference', value: 'difference' },
    { sortable: false, label: 'Notes', value: 'notes' },
  ];

  return {
    purchaseOrderReceived_data: purchaseOrder_detail,
    purchaseOrderReceived_formData,
    purchaseOrderReceived_fetchDetails,
    purchaseOrderReceived_validations,
    purchaseOrderReceived_listColumns,
    purchaseOrderReceived_isLoading: purchaseOrder_isLoading,
    purchaseOrderReceived_onBack,
    purchaseOrderReceived_listStaff,
    purchaseOrderReceived_onSubmit,
    purchaseOrderReceived_isOwner,
    purchaseOrderReceived_onShowNotesDialog,
    notesBuffer,
    onCloseNotesDialog,
    onSubmitNotesDialog,
  };
};
