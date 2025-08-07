<script setup lang="ts">
import VoucherFormCreate from '../components/VoucherFormCreate.vue';

import { useVoucherCreateService } from '../services/voucher-create.service';

const {
  voucherFormData,
  voucherFormDataValidations,
  voucherFormIsLoading,
  voucherFormOnCancel,
  voucherFormOnSubmit,
  voucherProductList,
} = useVoucherCreateService();

provide('voucher', {
  voucherFormData,
  voucherFormDataValidations,
  voucherFormIsLoading,
  voucherFormOnCancel,
  voucherFormOnSubmit,
  voucherProductList,
});

</script>

<template>
  <div class="voucher-create-ui">
    <section id="voucher-create-ui" class="flex flex-col justify-center items-center relative inset-0 z-0 mt-5">
       <VoucherFormCreate />
    </section>
  </div>
  <AppBaseDialogConfirmation id="voucher-create-edit-dialog-confirmation" />
</template>
