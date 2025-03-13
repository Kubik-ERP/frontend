<template>
  <section id="outlet-available-list" class="grid grid-rows-1 grid-cols-10 gap-4">
    <section
      v-for="index in 6"
      id="outlet"
      :key="index"
      class="col-span-2 relative inset-0 z-0 flex flex-col items-center gap-4 p-2 rounded-lg cursor-pointer basic-smooth-animation hover:bg-primary-background hover:[&>svg]:opacity-100"
    >
      <AppBaseSvg
        name="edit"
        class="absolute top-2 right-2 w-4 h-4 basic-smooth-animation cursor-pointer opacity-0"
      />

      <PrimeVueAvatar label="P" class="mr-2" size="xlarge" shape="circle" />

      <section id="information" class="flex flex-col items-center gap-2">
        <h5 class="font-semibold text-base text-black">Lawson</h5>

        <p class="font-normal text-black-secondary text-sm text-center">
          3891 Ranchview Dr. Richardson, California 62639
        </p>
      </section>
    </section>

    <section
      id="create-outlet"
      class="col-span relative inset-0 z-0 flex flex-col items-center justify-center gap-4 cursor-pointer basic-smooth-animation hover:bg-primary-background hover:[&>#box-outlet]:!bg-white"
    >
      <section id="box-outlet" class="basic-smooth-animation bg-primary-background p-5 rounded-full">
        <AppBaseSvg name="store" class="w-6 h-6" />
      </section>

      <PrimeVueButton class="bg-transparent border-none w-full" severity="secondary">
        <template #default>
          <section id="content" class="flex items-center gap-2">
            <AppBaseSvg name="plus-line" />
            <span class="font-semibold text-blue-primary text-sm">Add Store</span>
          </section>
        </template>
      </PrimeVueButton>
    </section>
  </section>
</template>
