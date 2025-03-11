<script setup lang="ts"></script>

<template>
  <form class="form-group flex flex-col gap-10">
    <section id="greeting-text" class="flex flex-col gap-3">
      <PrimeVueAvatar label="P" class="mr-2" size="xlarge" shape="circle" />

      <h1 class="font-bold text-2xl leading-8">We sent you a code</h1>
      <section id="text-information" class="flex flex-col">
        <p id="subtitle" class="font-normal text-base text-disabled">Enter the verification code sent to</p>

        <section id="phone-number" class="flex items-center gap-1">
          <p id="phone-number" class="font-normal text-base">+6285********97</p>
          <AppBaseSvg name="edit" class="cursor-pointer" />
        </section>
      </section>
    </section>

    <section id="form-input" class="flex flex-col items-center gap-4">
      <PrimeVueInputOtp
        class="[&>input]:bg-white [&>input]:border-grayscale-30 [&>input]:font-bold [&>input]:text-2xl [&>input]:w-16 [&>input]:h-16!"
      />

      <span class="information font-normal text-sm text-gray">
        Didn’t get verification code?
        <span class="font-semibold text-disabled cursor-pointer">Send a new code 03:59</span>
      </span>
    </section>

    <PrimeVueButton class="bg-blue-primary border-none text-sm py-[10px]" label="Continue" type="submit" />
  </form>
</template>
