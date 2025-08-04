<script setup lang="ts">
// Stores
import { useAuthenticationStore } from '@/modules/authentication/store';
import { useOutletStore } from '@/modules/outlet/store';

/**
 * @description Injected variables
 */
const authenticationStore = useAuthenticationStore();
const outletStore = useOutletStore();
const route = useRoute();
const { authentication_userData } = storeToRefs(authenticationStore);
const { outlet_profile } = storeToRefs(outletStore);

/**
 * @description Reactive data binding
 */
const language = ref('en');
const popover = ref();
const popoverLocalization = ref();

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
    class="relative inset-0 z-0 flex items-center justify-between border-b border-solid border-grayscale-10 px-10 py-4"
  >
    <section id="left-content" class="flex items-center gap-4">
      <router-link v-if="route.meta.backArrow" :to="route.meta.backArrowPath ?? '/'">
        <PrimeVueButton
          v-if="route.meta.backArrow"
          class="bg-white border-none shadow-xs hover:bg-grayscale-10/50 basic-smooth-animation rounded-lg p-2"
        >
          <AppBaseSvg name="chevron-left" class="!w-5 !h-5" />
        </PrimeVueButton>
      </router-link>

      <h2 class="font-semibold text-black text-lg">
        {{ route.meta.title }}
      </h2>
    </section>

    <PrimeVueIconField class="hidden lg:block">
      <PrimeVueInputIcon>
        <template #default>
          <AppBaseSvg name="search" />
        </template>
      </PrimeVueInputIcon>

      <PrimeVueInputText cll placeholder="Search everything here..." class="text-sm w-full min-w-80" />
    </PrimeVueIconField>

    <section id="right-content" class="flex items-center gap-2">
      <section id="status-and-notification" class="flex items-center gap-4">
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

        <AppBaseSvg name="notification-primary" class="hidden lg:block !w-6 !h-6" />
      </section>

      <PrimeVueDivider class="hidden lg:block bg-grayscale-10 h-[52px]" layout="vertical" />

      <section
        id="user-menu"
        class="hidden lg:flex items-center justify-between pe-2 cursor-pointer"
        @click="popover.toggle($event)"
      >
        <section id="user-profile" class="flex items-center gap-2">
          <template v-if="outlet_profile?.user.image">
            <img
              :src="APP_BASE_BUCKET_URL + outlet_profile?.user.image"
              alt=""
              srcset=""
              class="w-10 h-10 rounded-full border-2 border-solid border-primary"
            />
          </template>

          <template v-else>
            <PrimeVueAvatar class="w-10 h-10" label="P" size="large" shape="circle" />
          </template>

          <section id="user-information" class="hidden lg:flex flex-col w-36">
            <h6 class="font-semibold text-black text-sm">
              {{ authentication_userData?.fullname }}
            </h6>
            <span class="font-normal text-text-disabled text-xs">
              {{ authentication_userData?.roles.name }}
            </span>
          </section>
        </section>

        <AppBaseSvg name="chevron-down" class="hidden lg:block !w-3 !h-3" />
      </section>

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
  </nav>
</template>

<style scoped>
nav#navbar section#box-icon-back {
  box-shadow: 0px 1px 10px 2px #1018280d;
}
</style>
