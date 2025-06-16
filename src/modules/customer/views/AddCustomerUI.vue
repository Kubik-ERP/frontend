<script setup>
import excludeSVG from '@/app/assets/icons/exclude.svg';

import AddCustomerForm from '@/modules/customer/components/addCustomer/form.vue'


/**
 * @description Define props with default values and interfaces
 */
const props = defineProps({
  isModal: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close']);

const handleOnClose = () => {
  console.log('handleOnClose called');
  emit('close');
}

const router = useRouter();

const nextRoute = ref(null);
const isLeavingModal = ref(false);
let hasConfirmedLeave = false;

const confirmLeave = () => {
  isLeavingModal.value = false;
  hasConfirmedLeave = true;

  if (nextRoute.value) {
    const targetRoute = nextRoute.value;
    nextRoute.value = null;
    router.push(targetRoute);
  }
};

const cancelLeave = () => {
  isLeavingModal.value = false;
  nextRoute.value = null;
  hasConfirmedLeave = false;
};

onBeforeRouteLeave((to, from, next) => {
  // console.log('onBeforeRouteLeave triggered', isLeavingModal.value, hasConfirmedLeave);

  if (hasConfirmedLeave) {
    hasConfirmedLeave = false;
    return next();
  }

  if (!isLeavingModal.value) {
    isLeavingModal.value = true;
    nextRoute.value = to.fullPath;
    next(false);
  }
});
</script>

<template>
  <div class="">

    
    <AddCustomerForm :is-modal="props.isModal" @close="handleOnClose" />

    <PrimeVueDialog :visible="isLeavingModal" modal header="">
      <template #container>
        <div class="w-[35rem] p-8">
          <div class="flex flex-col items-center gap-4 text-center">
            <span><img :src="excludeSVG" alt="" /></span>
            <h1 class="text-2xl font-semibold">Are you sure you want to leave this page?</h1>
            <p>Any changes you make to the data will be lost if you leave this page without saving</p>
            <div class="flex items-center justify-between gap-4">
              <PrimeVueButton
                class="text-lg w-56 text-primary font-semibold"
                variant="text"
                label="Discard Changes"
                @click="confirmLeave"
              />
              <PrimeVueButton
                variant="text"
                class="w-56 text-lg border-2 border-primary text-primary font-semibold"
                @click="cancelLeave"
                >Cancel</PrimeVueButton
              >
            </div>
          </div>
        </div>
      </template>
    </PrimeVueDialog>
  </div>
</template>

<style lang="scss" scoped></style>
