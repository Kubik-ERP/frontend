<template>
  <section id="authentication-create-new-password-success" class="flex flex-col gap-10">
    <section id="detail-information" class="flex flex-col gap-3">
      <PrimeVueAvatar label="P" class="mr-2" size="xlarge" shape="circle" />

      <section id="text-information" class="flex flex-col">
        <h1 class="font-bold text-2xl leading-8">Reset Password Success</h1>
        <p id="subtitle" class="font-normal text-base">Please signing in using your new password</p>
      </section>
    </section>

    <PrimeVueButton
      class="bg-blue-primary border-none text-sm py-[10px]"
      label="Sign In"
      as="a"
      href="/authentication/login"
    />
  </section>
</template>
