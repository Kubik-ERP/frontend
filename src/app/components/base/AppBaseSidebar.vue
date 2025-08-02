<script setup lang="ts">
// Constants
import { LIST_ADDITIONAL_MENUS, LIST_SIDEBAR_MENUS } from '@/app/constants/menus.constant';

// Stores
import { useOutletStore } from '@/modules/outlet/store';

// Injected variables
const outletStore = useOutletStore();
const route = useRoute();
const { outlet_currentOutlet } = storeToRefs(outletStore);

// Reactive state to track expanded menus
interface ExpandedState {
  [categoryIndex: number]: {
    [menuIndex: number]: boolean;
  };
}
const expandedMenus = ref<ExpandedState>({});

// Compute which submenus should be open based on the current route
const autoExpandMenus = () => {
  const newExpanded: ExpandedState = {};
  LIST_SIDEBAR_MENUS.forEach((category, categoryIndex) => {
    newExpanded[categoryIndex] = {};
    category.menus.forEach((menu, menuIndex) => {
      if (menu.subMenus?.length) {
        // Check if any submenu path matches the current route
        const isSubMenuActive = menu.subMenus.some(subMenu => subMenu.path === route.path);
        newExpanded[categoryIndex][menuIndex] = isSubMenuActive;
      }
    });
  });
  expandedMenus.value = newExpanded;
};

// Run on mount to set initial state
onMounted(() => {
  autoExpandMenus();
});

// Watch route changes to update expanded state
watch(
  () => route.path,
  () => {
    autoExpandMenus();
  },
);

// Toggle submenu manually
const toggleSubMenu = (categoryIndex: number, menuIndex: number) => {
  if (!expandedMenus.value[categoryIndex]) {
    expandedMenus.value[categoryIndex] = {};
  }
  expandedMenus.value[categoryIndex][menuIndex] = !expandedMenus.value[categoryIndex][menuIndex];
};
</script>

<template>
  <aside
    id="sidebar"
    class="sticky inset-0 z-0 col-span-2 flex flex-col gap-4 w-full bg-background border-r border-solid border-grayscale-10 px-4 py-2"
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
      <img src="@/app/assets/images/app-icon.png" alt="app-icon" class="w-fit h-fit" />
      <h1 class="font-bold text-base leading-8">Kubik POS</h1>
    </header>

    <!-- Main Content -->
    <section id="content" class="flex flex-col gap-2 w-full pb-2 border-b border-solid border-grayscale-10">
      <section
        id="outlet"
        class="flex items-center gap-2 p-2 rounded-md bg-white border border-solid border-grayscale-10 cursor-pointer basic-smooth-animation hover:bg-grayscale-10"
        @click="() => $router.push({ name: 'outlet.list' })"
      >
        <AppBaseSvg name="store" class="!w-5 !h-5" />
        <section id="outlet-information" class="flex flex-col">
          <h5 class="font-semibold text-black text-sm">
            {{ outlet_currentOutlet?.name }}
          </h5>

          <p class="font-normal text-text-disabled text-[10px]">
            {{ outlet_currentOutlet?.address }}
          </p>
        </section>
      </section>

      <div class="overflow-y-auto">
        <ul
          v-for="(menuCategory, menuCategoryIndex) in LIST_SIDEBAR_MENUS"
          :key="`menu-${menuCategoryIndex}`"
          class="list-none m-0"
        >
          <li>
            <!-- Category Header (no chevron) -->
            <div
              v-ripple
              class="px-4 py-2 flex items-center text-surface-500 dark:text-surface-400 cursor-default"
            >
              <span id="menu-category" class="font-normal text-text-disabled text-xs">
                {{ menuCategory.name }}
              </span>
            </div>

            <ul class="list-none p-0 m-0 overflow-hidden">
              <li
                v-for="(menu, menuIndex) in menuCategory.menus"
                :id="`menu-${menuIndex}`"
                :key="`menu-${menuIndex}`"
              >
                <template v-if="menu.subMenus?.length">
                  <a
                    v-ripple
                    class="flex items-center cursor-pointer px-4 py-2 rounded duration-150 transition-colors p-ripple gap-2"
                    :class="[
                      menu.subMenus.some(subMenu => subMenu.path === route.path)
                        ? 'bg-primary text-white'
                        : 'text-black',
                    ]"
                    @click="toggleSubMenu(menuCategoryIndex, menuIndex)"
                  >
                    <AppBaseSvg
                      :name="menu.iconName"
                      class="!w-5 !h-5"
                      :class="[menu.subMenus.some(subMenu => subMenu.path === route.path) ? 'filter-white' : '']"
                    />
                    <span
                      class="font-normal text-base"
                      :class="[
                        menu.subMenus.some(subMenu => subMenu.path === route.path) ? 'text-white' : 'text-black',
                      ]"
                    >
                      {{ menu.name }}
                    </span>
                    <i
                      :class="[
                        'pi',
                        'ml-auto',
                        expandedMenus[menuCategoryIndex]?.[menuIndex] ? 'pi-chevron-up' : 'pi-chevron-down',
                      ]"
                    ></i>
                  </a>
                  <ul
                    class="list-none p-0 m-0 overflow-hidden transition-max-height duration-400 ease-in-out"
                    :class="{
                      'max-h-0': !expandedMenus[menuCategoryIndex]?.[menuIndex],
                      'max-h-[1000px]': expandedMenus[menuCategoryIndex]?.[menuIndex],
                    }"
                  >
                    <li v-for="(subMenu, subMenuIndex) in menu.subMenus" :key="`sub-menu-${subMenuIndex}`">
                      <RouterLink
                        v-ripple
                        :to="subMenu.path"
                        class="inline-block w-full h-fit bg-grayscale-10 px-1"
                        :class="[subMenuIndex === menu.subMenus.length - 1 ? 'pb-1' : '']"
                      >
                        <div
                          id="content"
                          class="flex items-center px-4 py-2 rounded text-surface-700 hover:bg-primary-border dark:text-surface-0 dark:hover:bg-primary-border duration-150 transition-colors p-ripple"
                          :class="[route.path === subMenu.path ? 'bg-primary-border' : 'bg-grayscale-10']"
                        >
                          <span class="font-normal text-base text-black pl-7">
                            {{ subMenu.name }}
                          </span>
                        </div>
                      </RouterLink>
                    </li>
                  </ul>
                </template>
                <template v-else>
                  <RouterLink
                    v-ripple
                    :to="menu.path"
                    class="flex items-center cursor-pointer px-4 py-2 rounded text-surface-700 hover:bg-grayscale-10 dark:text-surface-0 dark:hover:bg-grayscale-10 duration-150 transition-colors p-ripple gap-2"
                    :class="[route.path === menu.path ? 'bg-primary text-white' : '']"
                  >
                    <AppBaseSvg
                      :name="menu.iconName"
                      class="!w-5 !h-5"
                      :class="[route.path === menu.path ? 'filter-white' : '']"
                    />
                    <p
                      class="font-normal text-base"
                      :class="[route.path === menu.path ? 'text-white' : 'text-black']"
                    >
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
          class="flex items-center gap-2 px-4 py-2 basic-smooth-animation hover:bg-grayscale-10 cursor-pointer rounded-md"
          :class="[route.path === additionalMenu.path ? 'bg-primary-border' : '']"
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

/* Smooth transition for max-height */
.transition-max-height {
  transition: max-height 1s ease-in-out;
}

/* Ensure overflow is handled during animation */
.max-h-0 {
  max-height: 0;
  overflow: hidden;
}
</style>
