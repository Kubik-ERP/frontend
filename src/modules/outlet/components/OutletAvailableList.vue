<script setup lang="ts">
// Interfaces
import type { IOutletListProvided } from '../interfaces/outlet-list.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  outletList_dynamicClassOfSelectedOutlet,
  outletList_lists,
  outletList_onNavigateToCreateStore,
  outletList_onSelectOutlet,
  outletList_selectedOutlet,
} = inject<IOutletListProvided>('outletList')!;;
</script>

<template>
  <section id="outlet-available-list" class="grid grid-rows-1 grid-cols-10 gap-4">
    <section
      v-for="(outlet, outletIndex) in outletList_lists.items"
      id="outlet"
      :key="`outlet-${outletIndex}`"
      class="col-span-5 lg:col-span-2 relative inset-0 z-0 flex flex-col items-center gap-4 p-2 rounded-lg cursor-pointer basic-smooth-animation hover:bg-primary-background hover:[&>a]:opacity-100 px-4 py-6"
      :class="outletList_dynamicClassOfSelectedOutlet(outlet)"
      @click="outletList_onSelectOutlet(outlet)"
    >
      <RouterLink
        v-if="outlet.id"
        :to="{ name: 'outlet.edit', params: { id: outlet.id } }"
        class="absolute top-2 right-2 w-4 h-4 opacity-0"
        :class="[`${outlet.id === outletList_selectedOutlet?.id ? 'opacity-100' : 'opacity-0'}`]"
      >
        <AppBaseSvg name="edit" class="relative inset-0 w-4 h-4 basic-smooth-animation cursor-pointer" />
      </RouterLink>

      <template v-if="outlet.photo">
        <PrimeVueAvatar class="mr-2" :image="APP_BASE_BUCKET_URL + outlet.photo" size="xlarge" shape="circle" />
      </template>

      <template v-else>
        <PrimeVueAvatar label="P" class="mr-2" size="xlarge" shape="circle" />
      </template>

      <section id="information" class="flex flex-col items-center gap-2">
        <h5 class="font-semibold text-base text-black text-center">
          {{ outlet.name }}
        </h5>

        <p class="font-normal text-black-secondary text-sm text-center">
          {{ outlet.address }}
        </p>
      </section>
    </section>

    <section
      class="col-span-5 lg:col-span-2 relative inset-0 z-0 flex flex-col items-center justify-center gap-4 cursor-pointer basic-smooth-animation hover:bg-primary-background hover:[&>#box-outlet]:!bg-white py-4"
      @click="outletList_onNavigateToCreateStore"
    >
      <section id="box-outlet" class="basic-smooth-animation bg-primary-background p-5 rounded-full">
        <AppBaseSvg name="store" class="w-6 h-6" />
      </section>

      <PrimeVueButton class="bg-transparent border-none w-full" severity="secondary">
        <template #default>
          <section id="content" class="flex items-center gap-2">
            <AppBaseSvg name="plus-line" class="w-4 h-4" />
            <span class="font-semibold text-primary text-sm">Add Store</span>
          </section>
        </template>
      </PrimeVueButton>
    </section>
  </section>
</template>

<style scoped>
.outlet-selecter-shadow {
  box-shadow: 0px 0px 10px 5px #00000026;
}
</style>
