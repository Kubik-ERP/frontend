<script setup lang="ts">
// Constants
import { LIST_SIDEBAR_MENUS } from '@/app/constants/menus.constant';

// Helpers
import { filterMenusByPermissions } from '@/app/helpers/menu-permission.helper';

// Stores
import { useAuthenticationStore } from '@/modules/authentication/store';
import { useOutletStore } from '@/modules/outlet/store';
import { useMobileStore } from '@/app/store/mobile.store';

// Injected variables
const authenticationStore = useAuthenticationStore();
const outletStore = useOutletStore();
const mobileStore = useMobileStore();
const route = useRoute();
const { authentication_userData, authentication_permissions } = storeToRefs(authenticationStore);
const { outlet_currentOutlet, outlet_profile } = storeToRefs(outletStore);
const { isCurrentlyMobile, isSidebarOpen } = storeToRefs(mobileStore);

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
  return filterMenusByPermissions(
    LIST_SIDEBAR_MENUS,
    authentication_permissions.value,
    outlet_currentOutlet.value?.businessType,
  );
});

console.log('filteredSidebarMenus', filteredSidebarMenus.value);
// ? Since Additional menus are not used currently, we will comment this out for now
// const filteredAdditionalMenus = computed(() => {
//   const filtered = filterMenusByPermissions(
//     [{ name: 'Additional', menus: LIST_ADDITIONAL_MENUS }],
//     authentication_permissions.value,
//   );
//   return filtered[0]?.menus || [];
// });

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
    // Close mobile sidebar when route changes
    if (isCurrentlyMobile.value) {
      mobileStore.closeSidebar();
    }
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

// Toggle sidebar collapse (only for desktop)
const toggleSidebar = () => {
  if (!isCurrentlyMobile.value) {
    isCollapsed.value = !isCollapsed.value;
  }
};

// Handle overlay click (close sidebar on mobile)
const handleOverlayClick = () => {
  if (isCurrentlyMobile.value) {
    mobileStore.closeSidebar();
  }
};

// Helper function to check if any submenu is active
const isAnySubMenuActive = (menu: IMenu): boolean => {
  return menu.subMenus?.some((subMenu: ISubMenu) => subMenu.path === route.path) || false;
};

// Computed classes for sidebar
const sidebarClasses = computed(() => {
  if (isCurrentlyMobile.value) {
    return `fixed inset-y-0 left-0 z-[60] w-80 overflow-y-auto overflow-x-hidden flex flex-col gap-4 bg-background border-r border-solid border-grayscale-10 px-4 py-2 transition-transform duration-300 ease-in-out max-h-dvh transform ${
      isSidebarOpen.value ? 'translate-x-0' : '-translate-x-full'
    }`;
  }

  // Desktop classes - using sticky for desktop only
  return `sticky inset-0 z-10 overflow-y-auto overflow-x-hidden flex flex-col gap-4 bg-background border-r border-solid border-grayscale-10 px-4 py-2 transition-all duration-300 ease-in-out min-h-dvh max-h-dvh ${
    isCollapsed.value ? 'w-20' : 'w-64 min-w-64'
  }`;
});

const handleLogout = async () => {
  try {
    await authenticationStore.handleLogout();
  } catch (error) {
    console.error('Logout failed:', error);
    // Fallback: still redirect to login page even if API call fails
    window.location.href = '/authentication/sign-in';
  }
};
</script>

<template>
  <!-- Mobile Overlay -->
  <div
    v-if="isCurrentlyMobile && isSidebarOpen"
    class="fixed inset-0 z-[50] bg-black opacity-50 transition-opacity duration-300"
    @click="handleOverlayClick"
  ></div>

  <!-- Sidebar -->
  <aside id="sidebar" :class="sidebarClasses">
    <!-- Hide Icon - Only show on desktop -->
    <section
      v-if="!isCurrentlyMobile"
      id="trigger-icon"
      class="absolute top-8 -right-4 flex items-center justify-center w-8 h-8 bg-white rounded-full basic-smooth-animation hover:bg-grayscale-10 cursor-pointer"
      @click="toggleSidebar"
    >
      <AppBaseSvg :name="isCollapsed ? 'chevron-right' : 'chevron-left-secondary'" class="!w-[18px] !h-[18px]" />
    </section>

    <!-- Header -->
    <header class="flex items-center gap-2 overflow-hidden">
      <PrimeVueAvatar
        :image="APP_BASE_BUCKET_URL + outlet_profile?.user.image"
        size="small"
        shape="circle"
        label="P"
        class="hidden lg:inline-flex w-14 h-14"
      />

      <h1
        v-show="!isCollapsed || isCurrentlyMobile"
        class="font-bold text-base leading-8 whitespace-nowrap transition-opacity duration-300"
        :class="{ 'opacity-0': isCollapsed && !isCurrentlyMobile }"
      >
        Kubik POS
      </h1>
    </header>

    <!-- Main Content -->
    <section id="content" class="flex flex-col gap-2 w-full pb-2">
      <section id="header-mobile" class="flex flex-col lg:hidden gap-4">
        <img src="@/app/assets/images/app-logo.png" alt="app-icon" class="w-fit h-fit max-w-40 flex-shrink-0" />

        <section id="user-profile" class="flex items-center gap-3">
          <PrimeVueAvatar
            :image="APP_BASE_BUCKET_URL + outlet_profile?.user.image"
            size="small"
            shape="circle"
            label="P"
          />

          <div class="flex flex-col">
            <h5 class="font-semibold text-primary text-sm">
              {{ authentication_userData?.fullname }}
            </h5>
            <span class="font-normal text text-disabled text-xs">
              {{ authentication_userData?.roles.name }}
            </span>
          </div>
        </section>
      </section>

      <section
        id="outlet"
        class="flex items-center p-2 rounded-md bg-white border border-solid border-grayscale-10 cursor-pointer basic-smooth-animation hover:bg-grayscale-10 overflow-hidden"
        :class="[isCollapsed && !isCurrentlyMobile ? 'justify-center' : 'gap-2']"
        @click="() => $router.push({ name: 'outlet.list' })"
      >
        <AppBaseSvg name="store" class="!w-5 !h-5 flex-shrink-0 tinted-by-css" />
        <section
          v-show="!isCollapsed || isCurrentlyMobile"
          id="outlet-information"
          class="flex flex-col transition-opacity duration-300 min-w-0"
          :class="{ 'opacity-0': isCollapsed && !isCurrentlyMobile }"
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
              v-show="!isCollapsed || isCurrentlyMobile"
              v-ripple
              class="px-4 py-2 flex items-center text-surface-500 dark:text-surface-400 cursor-default transition-opacity duration-300"
              :class="{ 'opacity-0': isCollapsed && !isCurrentlyMobile }"
            >
              <span id="menu-category" class="font-normal text-text-disabled text-xs">
                {{
                  menuCategory.translationKey ? useLocalization(menuCategory.translationKey) : menuCategory.name
                }}
              </span>
            </div>

            <ul class="list-none p-0 m-0 overflow-hidden">
              <li
                v-for="(menu, menuIndex) in menuCategory.menus"
                :id="`menu-${menuIndex}`"
                :key="`menu-${menuIndex}`"
              >
                <template v-if="menu.subMenus?.length && (!isCollapsed || isCurrentlyMobile)">
                  <a
                    v-ripple
                    class="flex items-center cursor-pointer px-4 py-2 rounded duration-150 transition-colors p-ripple gap-2"
                    :class="[isAnySubMenuActive(menu) ? 'bg-primary text-white' : 'text-black']"
                    @click="toggleSubMenu(menuCategoryIndex, menuIndex)"
                  >
                    <AppBaseSvg
                      :name="menu.iconName"
                      class="w-5 h-5"
                      :class="[isAnySubMenuActive(menu) ? 'filter-white' : 'tinted-by-css']"
                    />
                    <span
                      class="font-normal text-base whitespace-nowrap"
                      :class="[isAnySubMenuActive(menu) ? 'text-white' : 'text-black']"
                    >
                      {{ menu.translationKey ? useLocalization(menu.translationKey) : menu.name }}
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
                        class="inline-block w-full h-fit bg-grayscale-10"
                        :class="[subMenuIndex === menu.subMenus.length - 1 ? 'pb-1' : '']"
                      >
                        <div
                          id="content"
                          class="flex items-center px-4 py-2 rounded text-surface-700 hover:bg-secondary dark:text-surface-0 dark:hover:bg-secondary duration-150 transition-colors p-ripple"
                          :class="[route.path === subMenu.path ? 'bg-secondary' : 'bg-grayscale-10']"
                        >
                          <span class="font-normal text-base text-black pl-7">
                            {{ subMenu.translationKey ? useLocalization(subMenu.translationKey) : subMenu.name }}
                          </span>
                        </div>
                      </RouterLink>
                    </li>
                  </ul>
                </template>

                <!-- Collapsed submenu or collapsed single menu item -->
                <template v-else-if="menu.subMenus?.length && isCollapsed && !isCurrentlyMobile">
                  <div
                    v-ripple
                    class="flex items-center justify-center cursor-pointer px-2 py-2 rounded duration-150 transition-colors p-ripple mb-1"
                    :class="[
                      isAnySubMenuActive(menu) ? 'bg-primary text-white' : 'text-black hover:bg-grayscale-10',
                    ]"
                    :title="menu.translationKey ? useLocalization(menu.translationKey) : menu.name"
                  >
                    <AppBaseSvg
                      :name="menu.iconName"
                      class="w-5 h-5"
                      :class="[isAnySubMenuActive(menu) ? 'filter-white' : 'tinted-by-css']"
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
                      isCollapsed && !isCurrentlyMobile ? 'justify-center px-2' : 'gap-2 px-4',
                    ]"
                    :title="
                      isCollapsed && !isCurrentlyMobile
                        ? menu.translationKey
                          ? useLocalization(menu.translationKey)
                          : menu.name
                        : ''
                    "
                  >
                    <AppBaseSvg
                      :name="menu.iconName"
                      class="w-5 h-5 flex-shrink-0"
                      :class="[route.path === menu.path ? 'filter-white' : 'tinted-by-css']"
                    />
                    <p
                      v-show="!isCollapsed || isCurrentlyMobile"
                      class="font-normal text-base whitespace-nowrap transition-opacity duration-300"
                      :class="[
                        route.path === menu.path ? 'text-white' : 'text-black',
                        { 'opacity-0': isCollapsed && !isCurrentlyMobile },
                      ]"
                    >
                      {{ menu.translationKey ? useLocalization(menu.translationKey) : menu.name }}
                    </p>
                  </RouterLink>
                </template>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </section>

    <!-- ? Since Additional menus are not used currently, we will comment this out for now -->
    <!-- Additional Menus -->
    <!-- <section id="additional-menus" class="flex flex-col gap-2 w-full">
      <template
        v-for="(additionalMenu, additionalMenuIndex) in filteredAdditionalMenus"
        :key="`additionalMenu-${additionalMenuIndex}`"
      >
        <RouterLink
          :id="`additional-menu-${additionalMenuIndex}`"
          :to="additionalMenu.path"
          class="flex items-center py-2 basic-smooth-animation hover:bg-grayscale-10 cursor-pointer rounded-md"
          :class="[
            route.path === additionalMenu.path ? 'bg-secondary' : '',
            isCollapsed && !isCurrentlyMobile ? 'justify-center px-2' : 'gap-2 px-4',
          ]"
          :title="isCollapsed && !isCurrentlyMobile ? additionalMenu.name : ''"
        >
          <AppBaseSvg :name="additionalMenu.iconName" class="!w-5 !h-5 flex-shrink-0" />
          <p
            v-show="!isCollapsed || isCurrentlyMobile"
            class="font-normal text-base text-black whitespace-nowrap transition-opacity duration-300"
            :class="{ 'opacity-0': isCollapsed && !isCurrentlyMobile }"
          >
            {{ additionalMenu.name }}
          </p>
        </RouterLink>
      </template>
    </section> -->

    <!-- logout -->
    <section v-if="isCurrentlyMobile" id="logout" class="flex flex-col gap-2 w-full">
      <PrimeVueButton
        class="flex items-center px-4 py-2 rounded text-surface-700 hover:bg-secondary dark:text-surface-0 dark:hover:bg-secondary hover:cursor-pointer duration-150 transition-colors p-ripple"
        variant="text"
        unstyled
        @click="handleLogout"
      >
        <template #default>
          <section id="content" class="flex items-center gap-2 w-full">
            <span class="font-normal text-base text-text-primary">{{
              useLocalization('app.sidebar.log-out')
            }}</span>
          </section>
        </template>
        <template #icon>
          <AppBaseSvg name="logout" class="!w-5 !h-5 flex-shrink-0" />
        </template>
      </PrimeVueButton>
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
