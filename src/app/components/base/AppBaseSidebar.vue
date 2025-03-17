<script setup lang="ts">
// Constants
import { LIST_ADDITIONAL_MENUS, LIST_SIDEBAR_MENUS } from '@/app/constants/menus.constant';
</script>

<template>
  <aside
    id="sidebar"
    class="sticky inset-0 z-0 col-span-2 flex flex-col gap-4 w-full bg-background border-r border-solid border-grayscale-10 p-4"
  >
    <!-- Hide Icon -->
    <section
      id="trigger-icon"
      class="absolute top-8 -right-4 flex items-center justify-center w-8 h-8 bg-white rounded-full basic-smooth-animation hover:bg-grayscale-10 cursor-pointer"
    >
      <AppBaseSvg name="chevron-left-secondary" class="!w-[18px] !h-[18px]" />
    </section>

    <!-- Header -->
    <header class="flex items-center gap-2">
      <PrimeVueAvatar label="P" class="mr-2" size="xlarge" shape="circle" />

      <h1 class="font-bold text-base leading-8">Kubik POS</h1>
    </header>

    <!-- Main Content -->
    <section id="content" class="flex flex-col gap-2 w-full pb-2 border-b border-solid border-grayscale-10">
      <section
        id="outlet"
        class="flex items-center gap-2 p-2 rounded-md bg-white border border-solid border-grayscale-10"
      >
        <AppBaseSvg name="store" class="!w-5 !h-5" />

        <section id="outlet-information" class="flex flex-col">
          <h5 class="font-semibold text-black text-sm">Store A</h5>
          <p class="font-normal text-text-disabled text-[10px]">Jl. Kaliurang KM 13.5, No 17A</p>
        </section>
      </section>

      <template v-for="(menuCategory, menuCategoryIndex) in LIST_SIDEBAR_MENUS" :key="`menu-${menuCategoryIndex}`">
        <section :id="`menu-category-${menuCategoryIndex}`" class="flex flex-col gap-2 w-full">
          <span id="menu-category" class="font-normal text-text-disabled text-xs">
            {{ menuCategory.name }}
          </span>

          <template v-for="(menu, menuIndex) in menuCategory.menus" :key="`menu-${menuIndex}`">
            <RouterLink
              id="menu"
              :to="menu.path"
              class="flex items-center gap-2 p-2 basic-smooth-animation hover:bg-grayscale-10 cursor-pointer rounded-md"
            >
              <AppBaseSvg :name="menu.iconName" class="!w-5 !h-5" />

              <p class="font-normal text-base text-black">
                {{ menu.name }}
              </p>
            </RouterLink>
          </template>
        </section>
      </template>
    </section>

    <!-- Additional Menus -->
    <section id="additional-menus" class="flex flex-col gap-2 w-full">
      <template
        v-for="(additionalMenu, additionalMenuIndex) in LIST_ADDITIONAL_MENUS"
        :key="`additionalMenu-${additionalMenuIndex}`"
      >
        <RouterLink
          :id="`additional-menu-${additionalMenuIndex}`"
          :to="additionalMenu.path"
          class="flex items-center gap-2 p-2 basic-smooth-animation hover:bg-grayscale-10 cursor-pointer rounded-md"
        >
          <AppBaseSvg :name="additionalMenu.iconName" class="!w-5 !h-5" />

          <p class="font-normal text-base text-black">
            {{ additionalMenu.name }}
          </p>
        </RouterLink>
      </template>
    </section>
  </aside>
</template>

<style scoped>
aside#sidebar section#trigger-icon {
  box-shadow: 0px 0px 10px 2px #00000026;
}
</style>
