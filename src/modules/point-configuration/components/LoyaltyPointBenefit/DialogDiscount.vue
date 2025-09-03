<script setup lang="ts">
import { ILoyaltyPointBenefitProvided } from '@/modules/point-configuration/interfaces/loyalty-point-benefit.interface';
const {
  discountBenefit_formData,
  discountBenefit_formValidations,
  loyaltyPointBenefit_onCloseDialogDiscount,
  loyaltyPointBenefit_onSubmitDialogDiscount,
  loyaltyPointBenefit_onSubmitEditDialogDiscount,
  isEdit,
} = inject<ILoyaltyPointBenefitProvided>('loyaltyPointBenefit')!;
</script>
<template>
  <AppBaseDialog id="loyalty-point-benefit-dialog-discount">
    <template #header>
      <h1 class="font-bold text-2xl text-text-primary">Add Discount Befenit</h1>
    </template>

    <template #content>
      <section id="content" class="flex flex-col gap-4">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          :name="'Name'"
          spacing-bottom="mb-0"
          :validators="discountBenefit_formValidations.name"
        >
          <PrimeVueInputText
            v-model="discountBenefit_formData.name"
            class="text-sm w-full"
            :class="{
              ...classes,
            }"
            v-on="useListenerForm(discountBenefit_formValidations, 'name')"
          />
        </AppBaseFormGroup>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          :name="'Point Needs'"
          spacing-bottom="mb-0"
          :validators="discountBenefit_formValidations.pointNeeds"
        >
          <PrimeVueInputNumber
            v-model="discountBenefit_formData.pointNeeds"
            class="text-sm text-center"
            show-buttons
            button-layout="horizontal"
            fluid
            :min="0"
            :step="1"
            :class="{
              ...classes,
            }"
            v-on="useListenerForm(discountBenefit_formValidations, 'pointNeeds')"
          >
            <template #decrementicon>
              <span><AppBaseSvg name="minus" class="!w-5 !h-5" /></span>
            </template>
            <template #incrementicon>
              <AppBaseSvg name="plus-line" class="!w-5 !h-5" />
            </template>
          </PrimeVueInputNumber>
          <!-- <div class="flex items-center gap-2">
            <PrimeVueButton class="bg-transparent">
              <template #icon>
                <AppBaseSvg name="minus" class="!w-5 !h-5" />
              </template>
            </PrimeVueButton>

            <PrimeVueInputNumber
              v-model="discountBenefit_formData.pointNeeds"
              class="text-sm text-center"
              show-buttons
              button-layout="horizontal"
              fluid
              :step="1"
              :class="{
                ...classes,
              }"
              v-on="useListenerForm(discountBenefit_formValidations, 'pointNeeds')"
            >
              <template #decrementbutton>
                <AppBaseSvg name="minus" class="!w-5 !h-5" />
              </template>
              <template #incrementbutton>
                <AppBaseSvg name="plus-line" class="!w-5 !h-5" />
              </template>
          </PrimeVueInputNumber>
            <PrimeVueButton class="bg-transparent">
              <template #icon>
                <AppBaseSvg name="plus-line" class="!w-5 !h-5" />
              </template>
            </PrimeVueButton>
          </div> -->
        </AppBaseFormGroup>

        <!-- <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          :name="'Discount Price'"
          spacing-bottom="mb-0"
          :validators="discountBenefit_formValidations.discountPrice"
        >
        <PrimeVueInputGroup>
          <PrimeVueInputNumber
            v-model="discountBenefit_formData.discountPrice.value"
            class="text-sm text-center"
            :class="{
              ...classes,
            }"
          />
          <PrimeVueInputGroupAddon>
            <PrimeVueDropdown
              v-model="discountBenefit_formData.discountPrice.isPercent"
              :options="['%', 'Rp']"
              placeholder="Select Currency"
              class="w-full"
            />
          </PrimeVueInputGroupAddon>
        </PrimeVueInputGroup>
        </AppBaseFormGroup> -->

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="discount-price"
          :name="'Discount Price'"
          :validators="discountBenefit_formValidations.discountPrice.value"
        >
          <div class="relative w-full">
            <div class="flex items-center border shadow-xs border-grayscale-30 rounded-lg overflow-hidden w-full">
              <PrimeVueInputNumber
                v-model="discountBenefit_formData.discountPrice.value"
                class="w-full"
                name="discount-price"
                :min="0"
                :prefix="discountBenefit_formData.discountPrice.unit === 'Rp' ? 'Rp ' : ''"
                :suffix="discountBenefit_formData.discountPrice.unit === '%' ? ' %' : ''"
                :class="{ ...classes }"
              />
              <div class="absolute right-0 flex items-center rounded-lg border-none ring-0">
                <PrimeVueSelect
                  v-model="discountBenefit_formData.discountPrice.unit"
                  :options="['Rp', '%']"
                  class="border-none bg-transparent"
                >
                  <template #dropdownicon>
                    <AppBaseSvg name="chevron-down" class="!w-5 !h-5" />
                  </template>
                  <template #option="{ option }">
                    {{ option }}
                  </template>
                </PrimeVueSelect>
              </div>
            </div>
          </div>
        </AppBaseFormGroup>
      </section>
    </template>

    <template #footer>
      <section id="content" class="flex items-center justify-end gap-4">
        <PrimeVueButton
          class="bg-transparent border-primary min-w-44"
          @click="loyaltyPointBenefit_onCloseDialogDiscount()"
        >
          <template #default>
            <span class="font-semibold text-base text-primary">Cancel</span>
          </template>
        </PrimeVueButton>
        <PrimeVueButton
          class="bg-primary border-none min-w-44 disabled:bg-grayscale-20"
          :disabled="discountBenefit_formValidations.$invalid"
          :label="isEdit ? 'Edit' : 'Add'"
          @click="
            isEdit
              ? loyaltyPointBenefit_onSubmitEditDialogDiscount()
              : loyaltyPointBenefit_onSubmitDialogDiscount()
          "
        >
          <!-- <template #default>
            <span class="font-semibold text-base text-white">Add</span>
          </template> -->
        </PrimeVueButton>
      </section>
    </template>
  </AppBaseDialog>
</template>
