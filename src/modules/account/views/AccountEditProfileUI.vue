<script setup lang="ts">
// Components
import AccountEditButtonActions from '../components/edit-profile/AccountEditButtonActions.vue';
import AccountEditPhotoProfile from '../components/edit-profile/AccountEditPhotoProfile.vue';
import AccountEditProfileForm from '../components/edit-profile/AccountEditProfileForm.vue';

// Services
import { useAccountEditProfileService } from '../services/account-edit-profile.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  accountEditProfile_formData,
  accountEditProfile_formValidations,
  accountEditProfile_isLoading,
  accountEditProfile_onSubmit,
  accountEditProfile_onUploadPhoto,
} = useAccountEditProfileService();

/**
 * @description Provide all the data and methods what we need
 */
provide('accountEditProfile', {
  accountEditProfile_formData,
  accountEditProfile_formValidations,
  accountEditProfile_isLoading,
  accountEditProfile_onSubmit,
  accountEditProfile_onUploadPhoto,
});
</script>

<template>
  <section id="account-edit-profile" class="flex flex-col gap-10 w-full">
    <AccountEditPhotoProfile />
    <AccountEditProfileForm />
    <AccountEditButtonActions />
  </section>
</template>
