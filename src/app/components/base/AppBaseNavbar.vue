<script setup lang="ts">
// Stores
import { useAuthenticationStore } from '@/modules/authentication/store';
import { useOutletStore } from '@/modules/outlet/store';
import { useMobileStore } from '@/app/store/mobile.store';

/**
 * @description Injected variables
 */
const authenticationStore = useAuthenticationStore();
const outletStore = useOutletStore();
const mobileStore = useMobileStore();
const route = useRoute();
const { authentication_userData } = storeToRefs(authenticationStore);
const { outlet_profile } = storeToRefs(outletStore);
const { isCurrentlyMobile } = storeToRefs(mobileStore);

/**
 * @description Reactive data binding
 */
const language = ref('en');
const popover = ref();
const popoverLocalization = ref();
const showMobileSearch = ref(false);

/**
 * @description Handle hamburger menu click
 */
const handleHamburgerClick = () => {
  mobileStore.toggleSidebar();
};

/**
 * @description Handle mobile search toggle
 */
const toggleMobileSearch = () => {
  showMobileSearch.value = !showMobileSearch.value;
};

/**
 * @description Handle business logic for clicking the logout button
 */
const handleLogout = () => {
  // Implement logout logic here, e.g., clear tokens, redirect to login page
  console.log('Logging out...');

  // Remove all the data on the local storage
  localStorage.removeItem('authentication');
  localStorage.removeItem('outlet');

  // Redirect to the login page
  window.location.href = '/authentication/sign-in';
};

/**
 * @description Handle business logic for check if user online or not by using vanilla JavaScript
 */
const isOnline = () => {
  return navigator.onLine;
};

/**
 * @description Handle business logic for changing the language
 */
const onChangeLanguage = (selectedLanguage: string) => {
  console.log(`Changing language to: ${selectedLanguage}`);

  // Update the language in the store or state management
  localStorage.setItem('lang', selectedLanguage);
  language.value = selectedLanguage;

  // Emit an event to notify other components about the language change
  popoverLocalization.value.hide();
  popover.value.hide();
};
</script>

<template>
  <nav
    id="navbar"
    class="relative inset-0 z-0 flex items-center justify-between border-b border-solid border-grayscale-10 px-4 lg:px-10 py-4"
  >
    <section id="left-content" class="flex items-center gap-4">
      <!-- Hamburger Menu for Mobile -->
      <PrimeVueButton
        v-if="isCurrentlyMobile"
        class="lg:hidden bg-white border-none shadow-xs hover:bg-grayscale-10/50 basic-smooth-animation rounded-lg p-2"
        @click="handleHamburgerClick"
      >
        <AppBaseSvg name="menu" class="!w-8 !h-8" />
      </PrimeVueButton>

      <!-- Back Arrow (if exists) -->
      <router-link v-if="route.meta.backArrow && !isCurrentlyMobile" :to="route.meta.backArrowPath ?? '/'">
        <PrimeVueButton
          class="bg-white border-none shadow-xs hover:bg-grayscale-10/50 basic-smooth-animation rounded-lg p-2"
        >
          <AppBaseSvg name="chevron-left" class="!w-5 !h-5" />
        </PrimeVueButton>
      </router-link>

      <!-- Page Title -->
      <h2 class="font-semibold text-black text-lg truncate">
        {{ route.meta.title }}
      </h2>
    </section>

    <!-- Search Bar - Hidden on Mobile -->
    <PrimeVueIconField class="hidden lg:block">
      <PrimeVueInputIcon>
        <template #default>
          <AppBaseSvg class="w-4 h-4" name="search" />
        </template>
      </PrimeVueInputIcon>

      <PrimeVueInputText placeholder="Search everything here..." class="text-sm w-full min-w-80" />
    </PrimeVueIconField>

    <section id="right-content" class="flex items-center gap-2">
      <!-- Status and Notification -->
      <section id="status-and-notification" class="flex items-center gap-2 lg:gap-4">
        <!-- Online Status -->
        <section id="status" class="flex items-center gap-2">
          <section
            id="dot-status"
            class="w-2 h-2 rounded-full"
            :class="[isOnline() ? 'bg-success' : 'bg-disabled']"
          >
            &nbsp;
          </section>
          <span class="font-normal text-disabled text-xs">
            {{ isOnline() ? 'Online' : 'Offline' }}
          </span>
        </section>

        <!-- Notification Icon -->
        <AppBaseSvg name="notification-primary" class="!w-6 !h-6 cursor-pointer" />
      </section>

      <!-- Divider - Hidden on Mobile -->
      <PrimeVueDivider class="hidden lg:block bg-grayscale-10 h-[52px]" layout="vertical" />

      <!-- User Menu -->
      <section
        id="user-menu"
        class="flex items-center justify-between cursor-pointer"
        :class="[isCurrentlyMobile ? 'pe-0' : 'pe-2']"
        @click="popover.toggle($event)"
      >
        <section id="user-profile" class="flex items-center gap-2">
          <!-- User Avatar -->
          <template v-if="outlet_profile?.user.image">
            <img
              :src="APP_BASE_BUCKET_URL + outlet_profile?.user.image"
              alt=""
              class="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-solid border-primary"
            />
          </template>
          <template v-else>
            <PrimeVueAvatar
              class="w-8 h-8 lg:w-10 lg:h-10"
              label="P"
              :class="isCurrentlyMobile ? 'hidden' : ''"
              :size="isCurrentlyMobile ? 'normal' : 'large'"
              shape="circle"
            />
          </template>

          <!-- User Information - Hidden on Mobile -->
          <section v-if="!isCurrentlyMobile" id="user-information" class="hidden lg:flex flex-col w-36">
            <h6 class="font-semibold text-black text-sm">
              {{ authentication_userData?.fullname }}
            </h6>
            <span class="font-normal text-text-disabled text-xs">
              {{ authentication_userData?.roles.name }}
            </span>
          </section>
        </section>

        <!-- Chevron - Hidden on Mobile -->
        <AppBaseSvg v-if="!isCurrentlyMobile" name="chevron-down" class="hidden lg:block !w-3 !h-3" />
      </section>

      <!-- User Popover -->
      <PrimeVuePopover
        ref="popover"
        :pt="{
          content: 'p-0',
        }"
      >
        <section id="popover-content" class="flex flex-col">
          <PrimeVueButton
            class="w-full px-4 py-3"
            variant="text"
            @click="() => $router.push({ name: 'account.index' })"
          >
            <template #default>
              <section id="content" class="flex items-center gap-2 w-full">
                <span class="font-normal text-base text-text-primary">My Account</span>
              </section>
            </template>
          </PrimeVueButton>

          <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="popoverLocalization.toggle($event)">
            <template #default>
              <section id="content" class="flex items-center gap-2 w-full">
                <span class="font-normal text-base text-text-primary">
                  Change Language :
                  <span class="text-primary">
                    {{ language === 'en' ? '🇺🇸 English' : '🇮🇩 Indonesia' }}
                  </span>
                </span>
              </section>
            </template>
          </PrimeVueButton>

          <PrimeVueButton
            class="border border-t border-grayscale-10 w-full px-4 py-3"
            variant="text"
            @click="handleLogout"
          >
            <template #default>
              <section id="content" class="flex items-center gap-2 w-full">
                <span class="font-normal text-base text-text-primary">Log Out</span>
              </section>
            </template>
          </PrimeVueButton>
        </section>
      </PrimeVuePopover>

      <!-- Language Popover -->
      <PrimeVuePopover
        ref="popoverLocalization"
        :pt="{
          content: 'p-0',
        }"
      >
        <section id="popover-content" class="flex flex-col">
          <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="onChangeLanguage('en')">
            <template #default>
              <section id="content" class="flex items-center gap-2 w-full">
                <span class="font-normal text-base text-text-primary">🇺🇸 English</span>
              </section>
            </template>
          </PrimeVueButton>

          <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="onChangeLanguage('id')">
            <template #default>
              <section id="content" class="flex items-center gap-2 w-full">
                <span class="font-normal text-base text-text-primary">🇮🇩 Indonesia</span>
              </section>
            </template>
          </PrimeVueButton>
        </section>
      </PrimeVuePopover>
    </section>

    <!-- Mobile Search Overlay -->
    <div v-if="showMobileSearch && isCurrentlyMobile" class="fixed inset-0 z-[70] bg-white flex flex-col">
      <!-- Search Header -->
      <div class="flex items-center gap-4 p-4 border-b border-grayscale-10">
        <AppBaseSvg name="chevron-left" class="!w-6 !h-6 cursor-pointer" @click="toggleMobileSearch" />
        <div class="flex-1">
          <PrimeVueIconField class="w-full">
            <PrimeVueInputIcon>
              <AppBaseSvg name="search" />
            </PrimeVueInputIcon>
            <PrimeVueInputText placeholder="Search everything here..." class="text-sm w-full" autofocus />
          </PrimeVueIconField>
        </div>
      </div>

      <!-- Search Results Area -->
      <div class="flex-1 p-4">
        <p class="text-gray-500 text-sm">Start typing to search...</p>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav#navbar section#box-icon-back {
  box-shadow: 0px 1px 10px 2px #1018280d;
}
</style>
