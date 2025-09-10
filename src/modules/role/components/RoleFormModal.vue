<script setup lang="ts">
import { ref } from 'vue';
import eventBus from '@/plugins/mitt';
import { useRoleActionService } from '../services/role-action.service';
import { useRoleListService } from '../services/role-list.service';
import confirmationSVG from '@/app/assets/icons/confirmation.svg';

// ambil dari action service
const { role_formOnLoading, role_formData, role_formValidation, role_onSubmit, role_onCancel, role_formValid } =
  useRoleActionService();

const { roleList_onDelete, roleList_fetchData } = useRoleListService();

// state untuk konfirmasi update
const isUpdateModal = ref(false);

// handle submit form
const handleSubmit = async () => {
  if (role_formData.value?.id) {
    isUpdateModal.value = true;
    eventBus.emit('AppBaseDialog', {
      id: 'role-modal-form',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  } else {
    await role_onSubmit(role_formData.value, '');
    await roleList_fetchData();
  }
};

// fungsi jika user confirm update
const confirmUpdate = async () => {
  const id = role_formData.value?.id;
  await role_onSubmit(role_formData.value, id ?? '');
  await roleList_fetchData();
  isUpdateModal.value = false;
};

const cancelUpdate = () => {
  isUpdateModal.value = false;
};

const handleDelete = async () => {
  eventBus.emit('AppBaseDialog', {
    id: 'role-modal-form',
    isUsingClosableButton: false,
    isUsingBackdrop: true,
    isOpen: false,
    width: '600px',
  });
  if (role_formData.value?.id) {
    await roleList_onDelete(role_formData.value.id);
  }
};
</script>

<template>
  <!-- Modal Form role -->
  <AppBaseDialog id="role-modal-form">
    <template #header>
      <header class="flex flex-col gap-2">
        <h6 class="font-semibold text-black text-lg">
          {{ role_formData.id !== '' ? 'Edit Role' : 'Add New Role' }}
        </h6>
      </header>
    </template>

    <template #content>
      <form class="w-full" @submit.prevent="handleSubmit">
        <section class="flex flex-col gap-4 w-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            :name="useLocalization('role.form.name')"
            spacing-bottom="mb-0"
            :validators="role_formValidation.name"
          >
            <PrimeVueInputText
              v-model="role_formData.name"
              class="w-full"
              :class="{ ...classes }"
              placeholder="Enter role name"
              :v-on="useListenerForm(role_formValidation, 'name')"
            />
          </AppBaseFormGroup>
        </section>
      </form>
    </template>
    <template #footer>
      <div class="flex flex-row gap-2 w-1/2 justify-end">
        <!-- Cancel -->
        <PrimeVueButton
          type="button"
          class="w-full bg-white text-primary border border-primary"
          :disabled="role_formOnLoading"
          @click="role_onCancel"
        >
          {{ useLocalization('role.form.buttons.cancel') || 'Cancel' }}
        </PrimeVueButton>

        <!-- Update / Save -->
        <PrimeVueButton
          type="submit"
          class="w-full disabled:bg-gray-400 disabled:text-white disabled:border-none"
          :loading="role_formOnLoading"
          :disabled="!role_formValid"
          @click="handleSubmit"
        >
          {{
            role_formData.id !== ''
              ? useLocalization('role.form.buttons.update') || 'Update'
              : useLocalization('role.form.buttons.create') || 'Save'
          }}
        </PrimeVueButton>

        <!-- Delete (hanya muncul di edit mode) -->
        <PrimeVueButton
          v-if="role_formData.id !== ''"
          type="button"
          class="w-full bg-white text-red-600 border-none"
          @click="handleDelete"
        >
          <AppBaseSvg name="delete" class="!w-4 !h-4" />
          {{ useLocalization('role.deleteButton') || 'Delete' }}
        </PrimeVueButton>
      </div>
    </template>
  </AppBaseDialog>

  <!-- Dialog Konfirmasi Update -->
  <PrimeVueDialog :visible="isUpdateModal" modal header="">
    <template #container>
      <div class="w-[35rem] p-8">
        <div class="flex flex-col items-center gap-4 text-center">
          <span><img :src="confirmationSVG" alt="confirmation" /></span>
          <h1 class="text-2xl font-semibold">Are you sure want to update this role?</h1>
          <p>The update will affect the related role data</p>
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
  </PrimeVueDialog>
</template>
