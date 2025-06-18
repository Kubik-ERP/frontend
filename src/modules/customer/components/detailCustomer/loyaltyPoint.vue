<script setup lang="ts">
import minusSVG from '@/app/assets/icons/minus.svg';
import plusSVG from '@/app/assets/icons/plus-line.svg';
import { useCustomerDetailService } from '../../services/customer-detail.service';

const {
  increarePoint_FormData,
  increasePoint_formValidations,
  increarePoint_ResetFormData,

  decreasePoint_FormData,
  decreasePoint_formValidations,
  decreasePoint_ResetFormData,

  customerLoyaltyPoint_columns,
  customerLoyaltyPoint_values,
} = useCustomerDetailService();

const point = ref(20);
const isIncreasePointOpen = ref(false);
const isDecreasePointOpen = ref(false);

const handleIncreasePoint = () => {
  console.log(increarePoint_FormData);
  isIncreasePointOpen.value = false;
};

const handleDecreasePoint = () => {
  console.log(decreasePoint_FormData);
  isDecreasePointOpen.value = false;
};

const pointTypeClass = (type: string) => {
  if (type === 'Point Addition') return 'bg-primary-background text-primary';
  if (type === 'Point Deduction') return 'bg-error-background text-error-main';
};

const pointTypeFormat = (type: string, points: number) => {
  if (type === 'Point Addition') return '+ ' + points;
  if (type === 'Point Deduction') return '- ' + points;
};

</script>
<template>
  <section id="customer-loyalty-point" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      :columns="customerLoyaltyPoint_columns"
      :data="customerLoyaltyPoint_values"
      is-using-server-side-pagination
      is-using-custom-body
      is-using-custom-header
      is-using-custom-filter
    >
      <template #header>
        <div class="flex flex-col items-center gap-2 py-4">
          <span class="font-semibold text-xl">Loyalty Point</span>
          <div class="flex items-center gap-8">
            <PrimeVueButton
              type="button"
              label="Decrease"
              severity="info"
              variant="outlined"
              class="text-primary border-primary py-1 px-4"
              @click="isDecreasePointOpen = true"
            >
              <template #icon>
                <img :src="minusSVG" alt="" />
              </template>
            </PrimeVueButton>
            <span class="text-5xl text-primary font-bold"
              >{{ point }} <sub class="text-xs text-grayscale-30">pts</sub></span
            >
            <PrimeVueButton
              type="button"
              label="Increase"
              severity="info"
              variant="outlined"
              class="text-primary border-primary py-1 px-4"
              @click="isIncreasePointOpen = true"
            >
              <template #icon>
                <img :src="plusSVG" alt="" />
              </template>
            </PrimeVueButton>
          </div>
        </div>
      </template>

      <template #filter>
        <div class="flex items-center gap-2">Filter By kok gak keluar 😭😭</div>
      </template>

      <template #body="{ column, data }">
        <template v-if="column.value === 'invoiceID'">
          <span class="font-normal text-sm text-text-primary">{{ data.invoiceID }}</span>
        </template>

        <template v-else-if="column.value === 'purchaseDate'">
          <span class="font-normal text-sm text-text-primary">{{ data.purchaseDate }}</span>
        </template>

        <template v-else-if="column.value === 'type'">
          <PrimeVueChip
            :class="[pointTypeClass(data[column.value]), 'text-xs px-1.5 py-1']"
            :label="data[column.value]"
          />
        </template>

        <template v-else-if="column.value === 'points'">
          <span>{{ pointTypeFormat(data.type, data.points) }}</span>
        </template>

        <template v-else-if="column.value === 'expiryDate'">
          <span class="font-normal text-sm text-text-primary">{{ data.expiryDate }}</span>
        </template>

        <!-- notes -->
        <template v-else-if="column.value === 'notes'">
          <span class="font-normal text-sm text-text-primary">{{ data.notes }}</span>
        </template>

        <!-- action -->
        <template v-else-if="column.value === 'action'">
          <router-link :to="`/invoice/${data.invoiceID}`">
            <PrimeVueButton variant="text" rounded aria-label="Edit">
              <template #icon>
                <AppBaseSvg name="edit" class="!w-5 !h-5" />
              </template>
            </PrimeVueButton>
          </router-link>
        </template>
      </template>
    </AppBaseDataTable>
  </section>

  <div class="flex items-center justify-center p-4">
    <PrimeVueDialog
      v-model:visible="isIncreasePointOpen"
      modal
      header="Increase Point"
      class="w-[45rem]"
      @hide="increarePoint_ResetFormData()"
    >
      <form @submit.prevent="handleIncreasePoint">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="point"
          name="Point Balance"
          :validators="increasePoint_formValidations.point"
        >
          <PrimeVueInputNumber
            v-model="increarePoint_FormData.point"
            name="point"
            type="text"
            class="w-full"
            :class="{ ...classes }"
            fluid
            v-on="useListenerForm(increasePoint_formValidations, 'point')"
          >
          </PrimeVueInputNumber>
        </AppBaseFormGroup>
        <div class="mb-8">
          <label for="description">Expiry Date</label>
          <div class="flex gap-2">
            <div class="flex flex-wrap gap-4">
              <div class="flex items-center gap-2">
                <PrimeVueRadioButton
                  v-model="increarePoint_FormData.isHaveExpiryDate"
                  input-id="No Expiry Date"
                  name="isHaveExpiryDate"
                  value="No Expiry Date"
                />
                <label for="gender1">No Expiry Date</label>
              </div>
              <div class="flex items-center gap-2">
                <PrimeVueRadioButton
                  v-model="increarePoint_FormData.isHaveExpiryDate"
                  input-id="Specific Date"
                  name="isHaveExpiryDate"
                  value="Specific Date"
                />
                <label for="Specific Date">Specific Date</label>
              </div>
            </div>
          </div>
          <div v-if="increarePoint_FormData.isHaveExpiryDate === 'Specific Date'">
            <PrimeVueDatePicker
              v-model="increarePoint_FormData.ExpiryDate"
              name="expiryDate"
              type="date"
              show-icon
              fluid
              icon-display="input"
              input-id="icondisplay"
              class="border shadow-xs border-grayscale-30 rounded-lg mt-4"
            />
          </div>
        </div>
        <div class="mb-8">
          <label for="description">Notes <span class="text-gray-300">(Optional)</span></label>
          <PrimeVueTextarea v-model="increarePoint_FormData.notes" auto-resize rows="5" class="w-full" />
        </div>
        <div class="flex justify-end gap-2">
          <PrimeVueButton
            label="Cancel"
            severity="info"
            variant="outlined"
            class="w-48"
            @click="
              isIncreasePointOpen = false;
              increarePoint_ResetFormData();
            "
          />
          <PrimeVueButton
            label="Increase Point"
            class="w-48 bg-primary border-primary"
            type="submit"
            :disabled="increasePoint_formValidations.$invalid"
          />
        </div>
      </form>
    </PrimeVueDialog>

    <PrimeVueDialog v-model:visible="isDecreasePointOpen" modal header="Decrease Point" class="w-[45rem]">
      <form @submit.prevent="handleDecreasePoint">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="point"
          name="Point Balance"
          :validators="decreasePoint_formValidations.point"
        >
          <PrimeVueInputNumber
            v-model="decreasePoint_FormData.point"
            name="point"
            type="text"
            class="w-full"
            :class="{ ...classes }"
            fluid
            v-on="useListenerForm(decreasePoint_formValidations, 'point')"
          >
          </PrimeVueInputNumber>
        </AppBaseFormGroup>
        <div class="mb-8">
          <label for="description">Notes <span class="text-gray-300">(Optional)</span></label>
          <PrimeVueTextarea v-model="decreasePoint_FormData.notes" auto-resize rows="5" class="w-full" />
        </div>
        <div class="flex justify-end gap-2">
          <PrimeVueButton
            label="Cancel"
            severity="info"
            variant="outlined"
            class="w-48"
            @click="
              isDecreasePointOpen = false;
              decreasePoint_ResetFormData();
            "
          />
          <PrimeVueButton
            label="Decrease Point"
            class="w-48 bg-primary border-primary"
            type="submit"
            :disabled="decreasePoint_formValidations.$invalid"
          />
        </div>
      </form>
    </PrimeVueDialog>
  </div>
</template>
