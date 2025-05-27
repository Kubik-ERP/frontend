<template>
  <section id="setting-tax" class="grid-wrapper gap-4">
    <section id="tax-content" class="flex flex-col col-span-full lg:col-span-6 gap-2">
      <header class="flex items-center gap-2 w-full">
        <h5 class="font-semibold text-black text-lg">Tax</h5>

        <PrimeVueToggleSwitch />
      </header>

      <PrimeVueCard class="w-full border border-solid border-grayscale-20 shadow-none">
        <template #content>
          <div class="flex flex-col w-full gap-4">
            <section id="tax-name" class="flex flex-col gap-1">
              <label for="tax-name" class="font-normal text-xs text-text-secondary"> Tax Name </label>

              <PrimeVueInputText id="tax-name" class="text-sm w-full" disabled />
            </section>

            <section id="tax-percentage" class="flex flex-col gap-1">
              <label for="tax-percentage" class="font-normal text-xs text-text-secondary"> Tax Percentage </label>

              <PrimeVueInputGroup>
                <PrimeVueInputText id="tax-percentage" class="text-sm w-full" disabled fluid />
                <PrimeVueInputGroupAddon>%</PrimeVueInputGroupAddon>
              </PrimeVueInputGroup>
            </section>

            <section id="tax-configuration" class="flex flex-col gap-2">
              <h6 class="font-semibold text-sm text-black">Tax Configuration</h6>

              <section id="tax-product-price" class="flex flex-col gap-2">
                <p class="font-normal text-sm text-black">Product price includes tax</p>

                <section id="option-values" class="flex items-center gap-4">
                  <span class="font-normal text-text-disabled text-sm">No</span>
                  <PrimeVueToggleSwitch />
                  <span class="font-normal text-primary text-sm">Yes</span>
                </section>
              </section>

              <section id="tax-product-takeaway" class="flex flex-col gap-2">
                <p class="font-normal text-sm text-black">Tax is not applied to takeaway orders</p>

                <section id="option-values" class="flex items-center gap-4">
                  <span class="font-normal text-text-disabled text-sm">No</span>
                  <PrimeVueToggleSwitch />
                  <span class="font-normal text-primary text-sm">Yes</span>
                </section>
              </section>
            </section>

            <PrimeVueButton
              class="bg-blue-primary border-none text-sm py-[10px] w-40 mt-2"
              label="Save"
              type="submit"
              disabled
            />
          </div>
        </template>
      </PrimeVueCard>
    </section>

    <section id="tax-content" class="flex flex-col col-span-full lg:col-span-6 gap-2">
      <header class="flex items-center gap-2 w-full">
        <h5 class="font-semibold text-black text-lg">Service Charge</h5>

        <PrimeVueToggleSwitch />
      </header>

      <PrimeVueCard class="w-full border border-solid border-grayscale-20 shadow-none">
        <template #content>
          <div class="flex flex-col w-full gap-4">
            <section id="service-charge" class="flex flex-col gap-1">
              <label for="service-charge" class="font-normal text-xs text-text-secondary"> Service Charge </label>

              <PrimeVueInputGroup>
                <PrimeVueInputText id="service-charge" class="text-sm w-full" disabled fluid />
                <PrimeVueInputGroupAddon>%</PrimeVueInputGroupAddon>
              </PrimeVueInputGroup>
            </section>

            <section id="tax-configuration" class="flex flex-col gap-2">
              <h6 class="font-semibold text-sm text-black">Tax Configuration</h6>

              <section id="tax-product-price" class="flex flex-col gap-2">
                <p class="font-normal text-sm text-black">Product price includes service charge</p>

                <section id="option-values" class="flex items-center gap-4">
                  <span class="font-normal text-text-disabled text-sm">No</span>
                  <PrimeVueToggleSwitch />
                  <span class="font-normal text-primary text-sm">Yes</span>
                </section>
              </section>

              <section id="tax-product-takeaway" class="flex flex-col gap-2">
                <p class="font-normal text-sm text-black">Service charge is applied to takeaway orders</p>

                <section id="option-values" class="flex items-center gap-4">
                  <span class="font-normal text-text-disabled text-sm">No</span>
                  <PrimeVueToggleSwitch />
                  <span class="font-normal text-primary text-sm">Yes</span>
                </section>
              </section>
            </section>

            <PrimeVueButton
              class="bg-blue-primary border-none text-sm py-[10px] w-40 mt-2"
              label="Save"
              type="submit"
              disabled
            />
          </div>
        </template>
      </PrimeVueCard>
    </section>
  </section>
</template>
