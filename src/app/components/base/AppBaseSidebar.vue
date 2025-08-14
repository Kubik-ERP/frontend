<script setup lang="ts">
// Constants
import { LIST_ADDITIONAL_MENUS, LIST_SIDEBAR_MENUS } from '@/app/constants/menus.constant';

// Stores
import { useOutletStore } from '@/modules/outlet/store';
import { useRbacStore } from '@/app/store/rbac.store';

// Injected variables
const outletStore = useOutletStore();
const rbacStore = useRbacStore();
const route = useRoute();
const { outlet_currentOutlet } = storeToRefs(outletStore);

// Reactive state to track expanded menus
interface ExpandedState {
  [categoryIndex: number]: {
    [menuIndex: number]: boolean;
  };
}
const expandedMenus = ref<ExpandedState>({});
const isCollapsed = ref<boolean>(false);

// Filter menus based on user permissions
const filteredSidebarMenus = computed(() => {
  return rbacStore.rbac_getFilteredMenus(LIST_SIDEBAR_MENUS);
});

const filteredAdditionalMenus = computed(() => {
  return rbacStore.rbac_getFilteredMenus([{ name: 'Additional', menus: LIST_ADDITIONAL_MENUS }])[0]?.menus || [];
});

// Compute which submenus should be open based on the current route
const autoExpandMenus = () => {
  const newExpanded: ExpandedState = {};
  filteredSidebarMenus.value.forEach((category: IMenuCategory, categoryIndex: number) => {
    newExpanded[categoryIndex] = {};
    category.menus.forEach((menu: IMenu, menuIndex: number) => {
      if (menu.subMenus?.length) {
        // Check if any submenu path matches the current route
        const isSubMenuActive = menu.subMenus.some((subMenu: ISubMenu) => subMenu.path === route.path);
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

// Watch for permission changes to update expanded state
watch(
  () => filteredSidebarMenus.value,
  () => {
    autoExpandMenus();
  },
  { deep: true },
);

// Toggle submenu manually
const toggleSubMenu = (categoryIndex: number, menuIndex: number) => {
  if (!expandedMenus.value[categoryIndex]) {
    expandedMenus.value[categoryIndex] = {};
  }
  expandedMenus.value[categoryIndex][menuIndex] = !expandedMenus.value[categoryIndex][menuIndex];
};

// Toggle sidebar collapse
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Helper function to check if any submenu is active
const isAnySubMenuActive = (menu: IMenu): boolean => {
  return menu.subMenus?.some((subMenu: ISubMenu) => subMenu.path === route.path) || false;
};
</script>

<template>
  <aside
    id="sidebar"
    class="sticky inset-0 z-0 flex flex-col gap-4 bg-background border-r border-solid border-grayscale-10 px-4 py-2 transition-all duration-300 ease-in-out"
    :class="[isCollapsed ? 'w-20' : 'w-64']"
  >
    <!-- Hide Icon -->
    <section
      id="trigger-icon"
      class="absolute top-8 -right-4 flex items-center justify-center w-8 h-8 bg-white rounded-full basic-smooth-animation hover:bg-grayscale-10 cursor-pointer"
      @click="toggleSidebar"
    >
      <AppBaseSvg :name="isCollapsed ? 'chevron-right' : 'chevron-left-secondary'" class="!w-[18px] !h-[18px]" />
    </section>

    <!-- Header -->
    <header class="flex items-center gap-2 overflow-hidden">
      <img src="@/app/assets/images/app-icon.png" alt="app-icon" class="w-fit h-fit flex-shrink-0" />
      <h1
        v-show="!isCollapsed"
        class="font-bold text-base leading-8 whitespace-nowrap transition-opacity duration-300"
        :class="{ 'opacity-0': isCollapsed }"
      >
        Kubik POS
      </h1>
    </header>

    <!-- Main Content -->
    <section id="content" class="flex flex-col gap-2 w-full pb-2 border-b border-solid border-grayscale-10">
      <section
        id="outlet"
        class="flex items-center p-2 rounded-md bg-white border border-solid border-grayscale-10 cursor-pointer basic-smooth-animation hover:bg-grayscale-10 overflow-hidden"
        :class="[isCollapsed ? 'justify-center' : 'gap-2']"
        @click="() => $router.push({ name: 'outlet.list' })"
      >
        <AppBaseSvg name="store" class="!w-5 !h-5 flex-shrink-0" />
        <section
          v-show="!isCollapsed"
          id="outlet-information"
          class="flex flex-col transition-opacity duration-300 min-w-0"
          :class="{ 'opacity-0': isCollapsed }"
        >
          <h5 class="font-semibold text-black text-sm truncate">
            {{ outlet_currentOutlet?.name }}
          </h5>

          <p class="font-normal text-text-disabled text-[10px] truncate">
            {{ outlet_currentOutlet?.address }}
          </p>
        </section>
      </section>

      <div class="overflow-y-auto">
        <ul
          v-for="(menuCategory, menuCategoryIndex) in filteredSidebarMenus"
          :key="`menu-${menuCategoryIndex}`"
          class="list-none m-0"
        >
          <li>
            <!-- Category Header (no chevron) -->
            <div
              v-show="!isCollapsed"
              v-ripple
              class="px-4 py-2 flex items-center text-surface-500 dark:text-surface-400 cursor-default transition-opacity duration-300"
              :class="{ 'opacity-0': isCollapsed }"
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
                <template v-if="menu.subMenus?.length && !isCollapsed">
                  <a
                    v-ripple
                    class="flex items-center cursor-pointer px-4 py-2 rounded duration-150 transition-colors p-ripple gap-2"
                    :class="[isAnySubMenuActive(menu) ? 'bg-primary text-white' : 'text-black']"
                    @click="toggleSubMenu(menuCategoryIndex, menuIndex)"
                  >
                    <AppBaseSvg
                      :name="menu.iconName"
                      class="!w-5 !h-5"
                      :class="[isAnySubMenuActive(menu) ? 'filter-white' : '']"
                    />
                    <span
                      class="font-normal text-base whitespace-nowrap"
                      :class="[isAnySubMenuActive(menu) ? 'text-white' : 'text-black']"
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

                <!-- Collapsed submenu or collapsed single menu item -->
                <template v-else-if="menu.subMenus?.length && isCollapsed">
                  <div
                    v-ripple
                    class="flex items-center justify-center cursor-pointer px-2 py-2 rounded duration-150 transition-colors p-ripple mb-1"
                    :class="[
                      isAnySubMenuActive(menu) ? 'bg-primary text-white' : 'text-black hover:bg-grayscale-10',
                    ]"
                    :title="menu.name"
                  >
                    <AppBaseSvg
                      :name="menu.iconName"
                      class="!w-5 !h-5"
                      :class="[isAnySubMenuActive(menu) ? 'filter-white' : '']"
                    />
                  </div>
                </template>

                <!-- Regular menu items -->
                <template v-else>
                  <RouterLink
                    v-ripple
                    :to="menu.path"
                    class="flex items-center cursor-pointer py-2 rounded text-surface-700 hover:bg-grayscale-10 dark:text-surface-0 dark:hover:bg-grayscale-10 duration-150 transition-colors p-ripple"
                    :class="[
                      route.path === menu.path ? 'bg-primary text-white' : '',
                      isCollapsed ? 'justify-center px-2' : 'gap-2 px-4',
                    ]"
                    :title="isCollapsed ? menu.name : ''"
                  >
                    <AppBaseSvg
                      :name="menu.iconName"
                      class="!w-5 !h-5 flex-shrink-0"
                      :class="[route.path === menu.path ? 'filter-white' : '']"
                    />
                    <p
                      v-show="!isCollapsed"
                      class="font-normal text-base whitespace-nowrap transition-opacity duration-300"
                      :class="[
                        route.path === menu.path ? 'text-white' : 'text-black',
                        { 'opacity-0': isCollapsed },
                      ]"
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
        v-for="(additionalMenu, additionalMenuIndex) in filteredAdditionalMenus"
        :key="`additionalMenu-${additionalMenuIndex}`"
      >
        <RouterLink
          :id="`additional-menu-${additionalMenuIndex}`"
          :to="additionalMenu.path"
          class="flex items-center py-2 basic-smooth-animation hover:bg-grayscale-10 cursor-pointer rounded-md"
          :class="[
            route.path === additionalMenu.path ? 'bg-primary-border' : '',
            isCollapsed ? 'justify-center px-2' : 'gap-2 px-4',
          ]"
          :title="isCollapsed ? additionalMenu.name : ''"
        >
          <AppBaseSvg :name="additionalMenu.iconName" class="!w-5 !h-5 flex-shrink-0" />
          <p
            v-show="!isCollapsed"
            class="font-normal text-base text-black whitespace-nowrap transition-opacity duration-300"
            :class="{ 'opacity-0': isCollapsed }"
          >
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
