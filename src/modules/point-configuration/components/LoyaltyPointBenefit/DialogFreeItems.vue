<script setup lang="ts">
import { ILoyaltyPointBenefitProvided } from '@/modules/point-configuration/interfaces/loyalty-point-benefit.interface';
const {
  freeItemsBenefit_formData,
  freeItemsBenefit_formValidations,
  loyaltyPointBenefit_onCloseDialogFreeItems,
  loyaltyPointBenefit_onSubmitDialogFreeItems,
} = inject<ILoyaltyPointBenefitProvided>('loyaltyPointBenefit')!;
</script>
<template>
  <AppBaseDialog id="loyalty-point-benefit-dialog-free-items">
    <template #header>
      <h1 class="font-bold text-2xl text-text-primary">Add Free Items Befenit</h1>
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
          :validators="freeItemsBenefit_formValidations.name"
        >
          <PrimeVueInputText
            v-model="freeItemsBenefit_formData.name"
            class="text-sm w-full"
            :class="{
              ...classes,
            }"
            v-on="useListenerForm(freeItemsBenefit_formValidations, 'name')"
          />
        </AppBaseFormGroup>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          :name="'Point Needs'"
          spacing-bottom="mb-0"
          :validators="freeItemsBenefit_formValidations.pointNeeds"
        >
          <PrimeVueInputNumber
            v-model="freeItemsBenefit_formData.pointNeeds"
            class="text-sm text-center"
            show-buttons
            button-layout="horizontal"
            fluid
            :step="1"
            :class="{
              ...classes,
            }"
            v-on="useListenerForm(freeItemsBenefit_formValidations, 'pointNeeds')"
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
              v-model="freeItemsBenefit_formData.pointNeeds"
              class="text-sm text-center"
              show-buttons
              button-layout="horizontal"
              fluid
              :step="1"
              :class="{
                ...classes,
              }"
              v-on="useListenerForm(freeItemsBenefit_formValidations, 'pointNeeds')"
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

        <div class="flex flex-col gap-4">
          <h1>Free Product Item</h1>
          <PrimeVueIconField class="hidden lg:block">
            <PrimeVueInputIcon>
              <template #default>
                <AppBaseSvg name="search" />
              </template>
            </PrimeVueInputIcon>

            <PrimeVueInputText placeholder="Search by Product Name" class="text-sm w-full min-w-80" />
          </PrimeVueIconField>
        </div>
      </section>
    </template>

    <template #footer>
      <section id="content" class="flex items-center justify-end gap-4">
        <PrimeVueButton
          class="bg-transparent border-primary min-w-44"
          @click="loyaltyPointBenefit_onCloseDialogFreeItems()"
        >
          <template #default>
            <span class="font-semibold text-base text-primary">Cancel</span>
          </template>
        </PrimeVueButton>
        <PrimeVueButton
          class="bg-primary border-none min-w-44 disabled:bg-grayscale-20"
          :disabled="freeItemsBenefit_formValidations.$invalid"
          @click="loyaltyPointBenefit_onSubmitDialogFreeItems()"
        >
          <template #default>
            <span class="font-semibold text-base text-white">Add</span>
          </template>
        </PrimeVueButton>
      </section>
    </template>
  </AppBaseDialog>
</template>
