<script setup lang="ts">
// Components
import OutletHeader from '../components/OutletHeader.vue';
import OutletAvailableList from '../components/OutletAvailableList.vue';

// Services
import { useOutletListService } from '../services/outlet-list.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  outletList_onContinue,
  outletList_dynamicClassOfSelectedOutlet,
  outletList_fetchOutletLists,
  outletList_hasAccessToAllStores,
  outletList_isLoading,
  outletList_lists,
  outletList_onNavigateToCreateStore,
  outletList_onSelectOutlet,
  outletList_selectedOutlet,
} = useOutletListService();

/**
 * @description Provide all the data and methods what we need
 */
provide('outletList', {
  outletList_onContinue,
  outletList_dynamicClassOfSelectedOutlet,
  outletList_isLoading,
  outletList_lists,
  outletList_onNavigateToCreateStore,
  outletList_onSelectOutlet,
  outletList_selectedOutlet,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  outletList_hasAccessToAllStores()
  await outletList_fetchOutletLists();
});
</script>

<template>
  <section id="outlet-list" class="flex flex-col gap-10 w-full">
    <OutletHeader />
    <OutletAvailableList />

    <section id="btn-actions" class="flex justify-center w-full">
      <PrimeVueButton
        v-if="outletList_lists.items.length > 0"
        class="bg-primary border-none text-sm py-[10px] w-sm"
        :disabled="!outletList_selectedOutlet"
        label="Continue"
        type="button"
        @click="outletList_onContinue"
      />
    </section>
  </section>
</template>
