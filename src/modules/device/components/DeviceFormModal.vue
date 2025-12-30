<script setup lang="ts">
import { useDeviceActionService } from '../services/device-action.servie';

// ambil dari action service
const {
  device_actionDisconnect,
  device_actionFormData,
  device_actionLoading,
  device_actionOnCancel,
  device_actionOnDelete,
  device_actionResponse,
  device_actionSubmit,
  device_actionValidations,
  device_editingItem,
  device_formMode,
  formIsValid,
} = useDeviceActionService();

const handleSubmit = async () => {
  if (device_formMode.value === 'edit') {
    await device_actionSubmit(device_editingItem.value?.id, device_actionFormData.value);
  } else {
    await device_actionSubmit(undefined, device_actionFormData.value);
  }
};
</script>

<template>
  <!-- Modal Form Brand -->
  <AppBaseDialog id="device-modal-form">
    <template #header>
      <header class="flex flex-col gap-2">
        <h6 class="font-semibold text-black text-lg">
          {{ device_formMode === 'edit' ? 'Register Device' : 'Add New Device' }}
        </h6>
      </header>
    </template>

    <template #content>
      <form class="w-full" @submit.prevent="handleSubmit">
        <section
          v-if="device_actionResponse.data.code === '' && device_editingItem?.code !== ''"
          class="flex flex-col gap-4 w-full"
        >
          <!-- Brand Name -->
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="device-name"
            :name="useLocalization('device.form.name')"
            spacing-bottom="mb-0"
            :validators="device_actionValidations.name"
          >
            <PrimeVueInputText
              v-model="device_actionFormData.name"
              class="w-full"
              :class="{ ...classes }"
              placeholder="Enter device name"
              :v-on="useListenerForm(device_actionValidations, 'name')"
            />
          </AppBaseFormGroup>
        </section>

        <section v-else class="flex flex-col justify-center items-center gap-2 pt-4">
          <!-- Instruksi -->
          <p class="text-gray-700 text-base font-medium">Enter this code to connecting your device</p>

          <!-- Kode -->
          <div class="bg-primary text-white text-lg font-bold px-9 py-2 rounded-md tracking-widest">
            {{ device_actionResponse.data?.code }}
          </div>

          <!-- Status Connected -->
          <div
            v-if="device_actionResponse.data?.status === 'connected'"
            class="flex items-center gap-2 bg-primary-50 text-primary px-2 py-1.5 rounded-full"
          >
            <svg width="15" height="15" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.66683 5.0026C8.66683 7.30379 6.80135 9.16927 4.50016 9.16927C2.19898 9.16927 0.333496 7.30379 0.333496 5.0026C0.333496 2.70142 2.19898 0.835938 4.50016 0.835938C6.80135 0.835938 8.66683 2.70142 8.66683 5.0026ZM7.1559 3.63057C7.31862 3.46785 7.31862 3.20403 7.1559 3.04131C6.99318 2.87859 6.72936 2.87859 6.56665 3.04131L3.80572 5.80224L2.71146 4.70798C2.54874 4.54526 2.28492 4.54526 2.1222 4.70798C1.95948 4.8707 1.95948 5.13451 2.1222 5.29723L3.51109 6.68612C3.67381 6.84884 3.93763 6.84884 4.10035 6.68612L7.1559 3.63057Z"
                fill="url(#paint0_linear_7721_60911)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_7721_60911"
                  x1="3.04183"
                  y1="3.54427"
                  x2="8.4585"
                  y2="11.2526"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#0F3C56" />
                  <stop offset="1" stop-color="#0F3C56" stop-opacity="0.5" />
                </linearGradient>
              </defs>
            </svg>

            <span class="text-sm font-medium">Connected</span>
          </div>
          <div
            v-else-if="device_actionResponse.data?.status === 'disconnected'"
            class="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-1.5 rounded-full"
          >
            <AppBaseSvg name="close-circle-red" class="!w-5 !h-5" />
            <span class="text-sm font-medium">Disconnected</span>
          </div>
          <div v-else class="flex items-center gap-2 bg-yellow-50 text-yellow-500 px-4 py-1.5 rounded-full">
            <svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10 5C10 7.75983 7.75983 10 5 10C2.2402 10 0 7.75983 0 5C0 2.2402 2.2402 0 5 0C7.75983 0 10 2.2402 10 5ZM0.833336 5C0.833336 7.30392 2.69608 9.1667 5 9.1667C7.30392 9.1667 9.1667 7.30392 9.1667 5C9.1667 2.69608 7.30392 0.833336 5 0.833336C2.69608 0.833336 0.833336 2.69608 0.833336 5ZM4.9951 5.52944H2.43628C2.2402 5.52944 2.09314 5.38237 2.09314 5.18627C2.09314 4.99511 2.2402 4.84803 2.43628 4.84803H4.65687V1.88236C4.65687 1.69118 4.80394 1.54412 4.9951 1.54412C5.18627 1.54412 5.33824 1.69118 5.33824 1.88236V5.18627C5.33824 5.38237 5.18627 5.52944 4.9951 5.52944Z"
                fill="#FFB84D"
              />
            </svg>

            <span class="text-sm font-medium">Pending</span>
          </div>
        </section>

        <section v-if="device_formMode === 'edit'" class="flex flex-col justify-center items-center gap-2 pt-4">
          <!-- Instruksi -->
          <p class="text-gray-700 text-base font-medium">Enter this code to connecting your device</p>

          <!-- Kode -->
          <div class="bg-primary text-white text-lg font-bold px-9 py-2 rounded-md tracking-widest">
            {{ device_editingItem?.code }}
          </div>

          <!-- Status Connected -->
          <div
            v-if="device_editingItem?.status === 'connected'"
            class="flex items-center gap-2 bg-primary-50 text-primary px-2 py-1.5 rounded-full"
          >
            <svg width="15" height="15" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.66683 5.0026C8.66683 7.30379 6.80135 9.16927 4.50016 9.16927C2.19898 9.16927 0.333496 7.30379 0.333496 5.0026C0.333496 2.70142 2.19898 0.835938 4.50016 0.835938C6.80135 0.835938 8.66683 2.70142 8.66683 5.0026ZM7.1559 3.63057C7.31862 3.46785 7.31862 3.20403 7.1559 3.04131C6.99318 2.87859 6.72936 2.87859 6.56665 3.04131L3.80572 5.80224L2.71146 4.70798C2.54874 4.54526 2.28492 4.54526 2.1222 4.70798C1.95948 4.8707 1.95948 5.13451 2.1222 5.29723L3.51109 6.68612C3.67381 6.84884 3.93763 6.84884 4.10035 6.68612L7.1559 3.63057Z"
                fill="url(#paint0_linear_7721_60911)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_7721_60911"
                  x1="3.04183"
                  y1="3.54427"
                  x2="8.4585"
                  y2="11.2526"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#0F3C56" />
                  <stop offset="1" stop-color="#0F3C56" stop-opacity="0.5" />
                </linearGradient>
              </defs>
            </svg>

            <span class="text-sm font-medium">Connected</span>
          </div>
          <div
            v-else-if="device_editingItem?.status === 'disconnected'"
            class="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-1.5 rounded-full"
          >
            <AppBaseSvg name="close-circle-red" class="!w-5 !h-5" />
            <span class="text-sm font-medium">Disconnected</span>
          </div>
          <div v-else class="flex items-center gap-2 bg-yellow-50 text-yellow-500 px-4 py-1.5 rounded-full">
            <svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10 5C10 7.75983 7.75983 10 5 10C2.2402 10 0 7.75983 0 5C0 2.2402 2.2402 0 5 0C7.75983 0 10 2.2402 10 5ZM0.833336 5C0.833336 7.30392 2.69608 9.1667 5 9.1667C7.30392 9.1667 9.1667 7.30392 9.1667 5C9.1667 2.69608 7.30392 0.833336 5 0.833336C2.69608 0.833336 0.833336 2.69608 0.833336 5ZM4.9951 5.52944H2.43628C2.2402 5.52944 2.09314 5.38237 2.09314 5.18627C2.09314 4.99511 2.2402 4.84803 2.43628 4.84803H4.65687V1.88236C4.65687 1.69118 4.80394 1.54412 4.9951 1.54412C5.18627 1.54412 5.33824 1.69118 5.33824 1.88236V5.18627C5.33824 5.38237 5.18627 5.52944 4.9951 5.52944Z"
                fill="#FFB84D"
              />
            </svg>

            <span class="text-sm font-medium">Pending</span>
          </div>
        </section>
      </form>
    </template>

    <template #footer>
      <div
        class="flex flex-row gap-2"
        :class="
          device_formMode === 'edit'
            ? 'w-full justify-end'
            : device_formMode === 'create' && device_actionResponse.data.code === ''
            ? 'w-1/2 justify-end'
            : device_actionResponse.data.name !== ''
              ? 'mx-auto justify-center items-center gap-2'
              : 'w-full justify-end'
        "
      >
        <!-- Conditional Action -->
        <PrimeVueButton
          v-if="device_editingItem?.status === 'connected'"
          type="button"
          class="w-full bg-white text-red-600 border-none"
          @click="device_actionDisconnect(device_editingItem.id)"
        >
          <AppBaseSvg name="close-circle-red" class="!w-4 !h-4" />
          Disconnect
        </PrimeVueButton>

        <PrimeVueButton
          v-if="device_formMode === 'edit' && device_editingItem?.status !== 'connected'"
          type="button"
          class="w-full bg-white text-red-600 border-none"
          @click="device_actionOnDelete(device_editingItem?.id || '')"
        >
          <AppBaseSvg name="delete" class="!w-4 !h-4" />
          {{ useLocalization('device.deleteButton') || 'Delete' }}
        </PrimeVueButton>

        <!-- Cancel -->
        <PrimeVueButton
          type="button"
          :class="device_actionResponse.data.code === ''
           ? 'w-full bg-white text-primary border border-primary' : 'bg-white border-primary text-primary text-lg  px-9 py-2 rounded-md'"
          :disabled="device_actionLoading"
          @click="device_actionOnCancel"
        >
          {{ useLocalization('device.form.buttons.cancel') || 'Cancel' }}
        </PrimeVueButton>

        <!-- Update / Save -->
        <PrimeVueButton
          v-if="device_actionResponse.data.code === '' && device_editingItem?.code !== ''"
          type="submit"
          class="w-full text-white bg-primary border-white  disabled:bg-gray-400 disabled:text-white disabled:border-none"
          :loading="device_actionLoading"
          :disabled="!formIsValid || device_formMode === 'edit'"
          @click="handleSubmit"
        >
          {{
            device_formMode === 'edit'
              ? useLocalization('device.form.buttons.update') || 'Update'
              : useLocalization('device.form.buttons.create') || 'Save'
          }}
        </PrimeVueButton>
      </div>
    </template>
  </AppBaseDialog>
  <!-- Dialog Konfirmasi Update -->
  <!-- <PrimeVueDialog :visible="isUpdateModal" modal header="">
    <template #container>
      <div class="w-[35rem] p-8">
        <div class="flex flex-col items-center gap-4 text-center">
          <span><img :src="confirmationSVG" alt="confirmation" /></span>
          <h1 class="text-2xl font-semibold">Are you sure want to update this brand?</h1>
          <p>The update will affect the related brand data</p>
          <div class="flex items-center justify-between gap-4">
            <PrimeVueButton
              variant="text"
              class="w-56 text-lg border-2 border-primary text-primary font-semibold"
              @click="cancelUpdate"
              >Cancel</PrimeVueButton
            >
            <PrimeVueButton
              class="text-xl w-56 py-2 cursor-pointer border-2 border-primary rounded-lg text-white bg-primary font-semibold"
              unstyled
              label="Yes, I'm Sure"
              @click="confirmUpdate"
            />
          </div>
        </div>
      </div>
    </template>
  </PrimeVueDialog> -->
</template>
