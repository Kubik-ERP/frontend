<template>
  <nav
    id="navbar"
    class="relative inset-0 z-0 flex items-center justify-between border-b border-solid border-grayscale-10 px-10 py-4"
  >
    <section id="left-content" class="flex items-center gap-4">
      <section id="box-icon-back" class="flex items-center justify-center w-[34px] h-[34px] rounded-md bg-white">
        <AppBaseSvg name="chevron-left" class="!w-[18px] !h-[18px]" />
      </section>

      <h2 class="font-semibold text-black text-lg">Sales Order</h2>
    </section>

    <PrimeVueIconField>
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
          <section id="dot-status" class="w-2 h-2 rounded-full bg-success">&nbsp;</section>
          <span class="font-normal text-disabled text-xs">Online</span>
        </section>

        <AppBaseSvg name="notification-primary" class="!w-6 !h-6" />
      </section>

      <PrimeVueDivider class="bg-grayscale-10 h-[52px]" layout="vertical" />

      <section id="user-menu" class="flex items-center justify-between pe-2">
        <section id="user-profile" class="flex items-center gap-2">
          <PrimeVueAvatar class="w-10 h-10" label="P" size="large" shape="circle" />

          <section id="user-information" class="flex flex-col w-36">
            <h6 class="font-semibold text-black text-sm">Samantha</h6>
            <span class="font-normal text-text-disabled text-xs">Super Admin</span>
          </section>
        </section>

        <AppBaseSvg name="chevron-down" class="!w-3 !h-3" />
      </section>

      <AppBaseSvg name="pin-primary" class="!w-6 !h-6" />
    </section>
  </nav>
</template>

<style scoped>
nav#navbar section#box-icon-back {
  box-shadow: 0px 1px 10px 2px #1018280d;
}
</style>
