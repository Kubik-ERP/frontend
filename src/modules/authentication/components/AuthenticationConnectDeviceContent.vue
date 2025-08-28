<template>
  <section
    id="authentication-sign-in-role-selection"
    class="default-wrapper items-center justify-center max-w-md lg:max-w-2xl px-6 md:px-0 gap-6"
  >
    <section id="box-icon" class="bg-primary-background w-20 h-20 p-2 rounded-full">
      <section
        id="inner-box"
        class="bg-blue-secondary-background flex items-center justify-center w-full h-full p-1 rounded-full"
      >
        <AppBaseSvg name="device" class="w-10 h-10" />
      </section>
    </section>

    <div class="flex items-center gap-4 mt-2">
      <PrimeVueButton
        class="bg-transparent border border-solid border-blue-primary p-2 basic-smooth-animation hover:bg-grayscale-10"
        @click="$router.back()"
      >
        <template #default>
          <AppBaseSvg name="arrow-left" class="w-4 h-4" />
        </template>
      </PrimeVueButton>

      <h1 class="font-bold text-2xl text-primary leading-8">Connect Device</h1>
    </div>

    <!-- Title -->
    <h4 class="font-bold text-2xl text-black">Enter Device Code to Connect for POS Connection</h4>

    <PrimeVueInputText
      placeholder="Enter Device Code"
      class="border border-solid border-grayscale-30 font-bold text-2xl text-text-primary text-center w-full placeholder:font-normal placeholder:text-2xl placeholder:text-text-disabled placeholder:text-center px-3 py-4 rounded-lg"
    />

    <PrimeVueMessage class="w-full">
      <section id="content" class="flex gap-1">
        <section
          id="inner-box"
          class="bg-blue-secondary-background flex items-center justify-center w-6 h-6 p-1 rounded-full"
        >
          <AppBaseSvg name="device" class="w-4 h-4" />
        </section>

        <section id="message" class="flex flex-col">
          <h6 class="font-semibold text-base text-black">How I can get the device code?</h6>

          <p class="font-normal text-base text-primary">
            You can find it in the POS Backoffice under Device Settings.
          </p>
        </section>
      </section>
    </PrimeVueMessage>

    <PrimeVueButton
      class="bg-blue-primary border-none font-semibold text-base py-3 w-full mt-6"
      label="Connect Device"
      type="submit"
    />
  </section>
</template>
