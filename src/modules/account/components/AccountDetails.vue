<template>
  <section id="account-details" class="flex flex-col gap-2 w-full">
    <header class="flex items-center gap-4">
      <h6 class="font-normal text-black text-lg">
        {{ useLocalization('account.details') }}
      </h6>

      <router-link id="edit-profile" :to="{ name: 'account.edit' }" class="flex items-center gap-2">
        <AppBaseSvg name="edit" />

        <span class="font-semibold text-primary text-sm">
          {{ useLocalization('app.edit-profile') }}
        </span>
      </router-link>
    </header>

    <section
      id="content"
      class="flex flex-col gap-4 p-4 border border-solid border-grayscale-20 rounded-lg w-full"
    >
      <section id="user-profile" class="flex items-center gap-4">
        <PrimeVueAvatar class="w-16 h-16" label="P" size="large" shape="circle" />

        <h5 class="font-semibold text-primary text-xl">Samantha</h5>
      </section>

      <section id="user-information" class="grid grid-rows-1 grid-cols-6 relative inset-0 z-0 gap-4">
        <section id="email" class="col-span-full lg:col-span-2 flex flex-col gap-1">
          <span class="font-normal text-text-disabled text-sm">
            {{ useLocalization('app.email') }}
          </span>

          <span class="font-normal text-black text-base"> lawsonkal@gmail.com </span>
        </section>

        <section id="phone-number" class="col-span-full lg:col-span-4 flex flex-col gap-1">
          <span class="font-normal text-text-disabled text-sm">
            {{ useLocalization('app.phone-number') }}
          </span>

          <span class="font-normal text-black text-base"> +62 8123324756 </span>
        </section>

        <section id="password" class="col-span-full lg:col-span-2 flex flex-col gap-1">
          <span class="font-normal text-text-disabled text-sm">
            {{ useLocalization('app.password') }}
          </span>

          <PrimeVueButton
            class="border border-solid border-primary basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
            severity="secondary"
            variant="outlined"
            @click="$router.push({ name: 'reset-password' })"
          >
            <template #default>
              <section class="cash-out-button flex items-center gap-2">
                <AppBaseSvg name="password" />
                <span class="font-semibold text-sm text-primary">Reset Password</span>
              </section>
            </template>
          </PrimeVueButton>
        </section>
      </section>
    </section>
  </section>
</template>
