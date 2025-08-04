<script setup lang="ts">
import VoucherFormEdit from '../components/VoucherFormEdit.vue';
</script>

<template>
  <div class="voucher-create-edit-ui">
    <section id="voucher-create-edit-ui" class="flex flex-col justify-center items-center relative inset-0 z-0 mt-5">
       <VoucherFormEdit />
    </section>
  </div>
  <AppBaseDialogConfirmation id="voucher-create-edit-dialog-confirmation" />
</template>

