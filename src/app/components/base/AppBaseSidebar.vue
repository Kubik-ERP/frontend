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

      <div class="overflow-y-auto">
        <ul
          v-for="(menuCategory, menuCategoryIndex) in LIST_SIDEBAR_MENUS"
          :key="`menu-${menuCategoryIndex}`"
          class="list-none m-0"
        >
          <li>
            <div
              v-ripple
              v-styleclass="{
                selector: '@next',
                enterFromClass: 'hidden',
                enterActiveClass: 'animate-slidedown',
                leaveToClass: 'hidden',
                leaveActiveClass: 'animate-slideup',
              }"
              class="p-4 flex items-center justify-between text-surface-500 dark:text-surface-400 cursor-pointer p-ripple"
            >
              <span id="menu-category" class="font-normal text-text-disabled text-xs">
                {{ menuCategory.name }}
              </span>
              <i class="pi pi-chevron-down"></i>
            </div>

            <ul class="list-none p-0 m-0 overflow-hidden">
              <li v-for="(menu, menuIndex) in menuCategory.menus" id="menu" :key="`menu-${menuIndex}`">
                <template v-if="menu.isHaveSubMenus">
                  <a
                    v-ripple
                    v-styleclass="{
                      selector: '@next',
                      enterFromClass: 'hidden',
                      enterActiveClass: 'animate-slidedown',
                      leaveToClass: 'hidden',
                      leaveActiveClass: 'animate-slideup',
                    }"
                    class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple gap-2"
                  >
                    <AppBaseSvg :name="menu.iconName" class="!w-5 !h-5" />
                    <span class="font-normal text-base text-black">
                      {{ menu.name }}
                    </span>

                    <i class="pi pi-chevron-down ml-auto"></i>
                  </a>
                  <ul
                    class="list-none p-0 m-0 bg-grayscale-10 hidden overflow-y-hidden transition-all duration-[400ms] ease-in-out"
                  >
                    <li v-for="(subMenu, subMenuIndex) in menu.subMenus" :key="`sub-menu-${subMenuIndex}`">
                      <RouterLink
                        v-ripple
                        :to="subMenu.path"
                        class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple"
                      >
                        <span class="font-normal text-base text-black pl-7">
                          {{ subMenu.name }}
                        </span>
                      </RouterLink>
                    </li>
                  </ul>
                </template>

                <template v-else>
                  <RouterLink
                    v-ripple
                    :to="menu.path"
                    class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple gap-2"
                  >
                    <AppBaseSvg :name="menu.iconName" class="!w-5 !h-5" />

                    <p class="font-normal text-base text-black">
                      {{ menu.name }}
                    </p>
                  </RouterLink>
                </template>
              </li>
            </ul>
          </li>
        </ul>
      </div>
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
