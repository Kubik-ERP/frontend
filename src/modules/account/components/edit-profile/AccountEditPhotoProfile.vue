<template>
  <section id="account-edit-photo-profile" class="flex flex-col items-center justify-center w-full gap-1">
    <span class="font-normal text-sm text-grayscale-70">
      {{ useLocalization('app.photo') }}
      <span class="text-text-disabled"> ({{ useLocalization('app.optional') }}) </span>
    </span>

    <PrimeVueAvatar class="w-20 h-20 mb-5" label="P" size="large" shape="circle" />
    <PrimeVueFileUpload
      url="/api/upload"
      accept="image/*"
      custom-upload
      :max-file-size="1000000"
      :show-cancel-button="false"
      :show-upload-button="false"
      :pt="{
        content: 'hidden',
        header: 'p-0',
      }"
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
              <AppBaseSvg name="image" />
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
