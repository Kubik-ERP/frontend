<script setup lang="ts">
import VoucherFormEdit from '../components/VoucherFormEdit.vue';
</script>

<template>
  <div class="voucher-edit-ui">
    <section id="voucher-edit-ui" class="flex flex-col justify-center items-center relative inset-0 z-0 mt-5">
       <VoucherFormEdit />
    </section>
  </div>
  <AppBaseDialogConfirmation id="voucher-create-edit-dialog-confirmation" />
</template>

