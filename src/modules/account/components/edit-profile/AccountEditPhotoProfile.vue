<script setup lang="ts">
// Interfaces
import type { IAccountEditProfileProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { accountEditProfile_formData, accountEditProfile_onUploadPhoto } =
  inject<IAccountEditProfileProvided>('accountEditProfile')!;

const uriProfileImage = computed(() => {
  const image = accountEditProfile_formData.value.image;

  if (image instanceof File) {
    return URL.createObjectURL(image);
  }

  if (typeof image === 'string') {
    return image;
  }

  return undefined;
});
</script>

<template>
  <section id="account-edit-photo-profile" class="flex flex-col items-center justify-center w-full gap-1">
    <span class="font-normal text-sm text-grayscale-70">
      {{ useLocalization('app.photo') }}
      <span class="text-text-disabled"> ({{ useLocalization('app.optional') }}) </span>
    </span>

    <template v-if="uriProfileImage">
      <img
        :src="uriProfileImage"
        alt=""
        srcset=""
        class="w-20 h-20 mb-5 rounded-full border-2 border-solid border-primary"
      />
    </template>

    <template v-else>
      <PrimeVueAvatar class="w-20 h-20 mb-5" label="P" size="large" shape="circle" />
    </template>

    <PrimeVueFileUpload
      url="/api/upload"
      accept="image/*"
      custom-upload
      :max-file-size="2097152"
      :show-cancel-button="false"
      :show-upload-button="false"
      :pt="{
        content: 'hidden',
        header: 'p-0',
      }"
      @select="accountEditProfile_onUploadPhoto"
    >
      <template #header="{ chooseCallback }">
        <PrimeVueButton
          class="text-primary border-solid border-primary basic-smooth-animation hover:bg-grayscale-10 w-fit px-[18px]"
          severity="secondary"
          variant="outlined"
          @click="chooseCallback()"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="image" class="filter-primary-color w-4 h-4" />
              <span class="font-normal text-sm">
                {{ useLocalization('app.select-image') }}
              </span>
            </section>
          </template>
        </PrimeVueButton>
      </template>
    </PrimeVueFileUpload>
  </section>
</template>
