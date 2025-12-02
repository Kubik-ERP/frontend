<script setup lang="ts">
// Interfaces
import type { IAuthenticationSignUpCountryInformations } from '@/modules/authentication/interfaces';
import type { IStaffMemberCreateEditProvided } from '../interfaces';

const {
  staffMemberCreateEdit_formData,
  staffMemberCreateEdit_formValidations,
  staffMemberCreateEdit_isLoading,
  staffMemberCreateEdit_typesOfSocialMedia,
  staffMemberCreateEdit_typesOfUserPermissions,
  staffMemberCreateEdit_onUploadPhotoProfile,
} = inject<IStaffMemberCreateEditProvided>('staffMemberCreateEdit')!;

const addSocialMedia = () => {
  staffMemberCreateEdit_formData.socialMedia.push({
    name: null, // Default value
    account: null,
  });
};

/**
 * Removes a social media entry by its index.
 * @param index - The index of the item to remove.
 */
const removeSocialMedia = (index: number) => {
  staffMemberCreateEdit_formData.socialMedia.splice(index, 1);
};

// If you want to start with one social media field by default
// if (staffMemberCreateEdit_formData.socialMedia.length === 0) {
//   addSocialMedia();
// }

const findSocialMediaOption = (value: string | null) => {
  if (!value) return null;
  return staffMemberCreateEdit_typesOfSocialMedia.find(opt => opt.value === value);
};
</script>

<template>
  <section id="staff-member-detail-form" class="flex flex-col gap-3">
    <h6 class="font-semibold text-black text-lg">Staff Details</h6>

    <section id="staff-information-form" class="grid-wrapper gap-4">
      <section id="staff-title" class="col-span-full lg:col-span-6 flex flex-col gap-1">
        <label for="staff-title-input" class="font-normal text-sm text-text-secondary">
          Photo <span class="text-text-disabled">(Optional)</span>
        </label>
        <div class="flex items-center gap-4">
          <AppBaseImage
            class="rounded-full w-24 h-24 object-cover"
            :src="staffMemberCreateEdit_formData.imagePreview"
          />
          <PrimeVueFileUpload
            v-model="staffMemberCreateEdit_formData.image"
            url="/api/upload"
            accept="image/*"
            custom-upload
            :max-file-size="2097152"
            :show-cancel-button="false"
            :show-upload-button="false"
            :pt="{
              content: 'hidden',
              header: 'p-0 border-none w-fit',
              root: 'w-fit border-none',
            }"
            @select="staffMemberCreateEdit_onUploadPhotoProfile"
          >
            <template #header="{ chooseCallback }">
              <PrimeVueButton
                class="text-primary border-solid border-primary basic-smooth-animation hover:bg-grayscale-10 w-fit px-[18px]"
                severity="secondary"
                variant="outlined"
                @click="chooseCallback()"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2">
                    <AppBaseSvg name="image" class="filter-primary-color w-4 h-4" />
                    <span class="font-normal text-sm">Change Image</span>
                  </section>
                </template>
              </PrimeVueButton>
            </template>
          </PrimeVueFileUpload>
        </div>
      </section>
      <section id="staff-name" class="col-span-full lg:col-span-6 flex flex-col gap-1">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="staff-name"
          name="Staff Name"
          :validators="staffMemberCreateEdit_formValidations.name"
        >
          <PrimeVueInputText
            id="staff-name"
            v-model="staffMemberCreateEdit_formData.name"
            :loading="staffMemberCreateEdit_isLoading"
            class="text-sm w-full"
            :class="{ ...classes }"
            v-on="useListenerForm(staffMemberCreateEdit_formValidations, 'name')"
          />
        </AppBaseFormGroup>
      </section>
      <section id="staff-title" class="col-span-full lg:col-span-6 flex flex-col gap-1">
        <label for="staff-title-input" class="font-normal text-sm text-text-secondary">
          Staff Title <span class="text-text-disabled">(Optional)</span>
        </label>

        <PrimeVueInputText
          id="staff-title-input"
          v-model="staffMemberCreateEdit_formData.title"
          class="text-sm w-full"
        />
      </section>

      <section id="staff-first-name" class="col-span-full lg:col-span-6 flex flex-col">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="staff-permission"
          name="Staff Permission"
          :validators="staffMemberCreateEdit_formValidations.permission"
        >
          <PrimeVueSelect
            id="staff-permission"
            v-model="staffMemberCreateEdit_formData.permission"
            filter
            :options="staffMemberCreateEdit_typesOfUserPermissions"
            option-label="name"
            option-value="id"
            placeholder="Select"
            class="text-base text-text-primary w-full"
            :class="{ ...classes }"
            v-on="useListenerForm(staffMemberCreateEdit_formValidations, 'permission')"
          />
        </AppBaseFormGroup>
      </section>

      <section id="email" class="col-span-full lg:col-span-6 flex flex-col">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="email"
          name="Email"
          spacing-bottom="mb-0"
          :validators="staffMemberCreateEdit_formValidations.email"
        >
          <PrimeVueInputText
            v-model="staffMemberCreateEdit_formData.email"
            :loading="staffMemberCreateEdit_isLoading"
            class="text-sm w-full"
            :class="{ ...classes }"
            v-on="useListenerForm(staffMemberCreateEdit_formValidations, 'email')"
          />
        </AppBaseFormGroup>
      </section>

      <section id="phone-number" class="col-span-full lg:col-span-6 flex items-center gap-3">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="phoneCountryCode"
          name="Phone Code"
          spacing-bottom="mb-0"
        >
          <PrimeVueSelect
            id="phoneCountryCode"
            v-model="staffMemberCreateEdit_formData.phoneCode"
            filter
            :options="COUNTRY_INFORMATIONS"
            :option-label="
              (value: IAuthenticationSignUpCountryInformations) => {
                return `${value.name} (${value.dialCodes})`;
              }
            "
            option-value="dialCodes"
            placeholder="+62"
            class="text-sm h-full min-h-9 w-full"
            :class="{ ...classes }"
          >
            <template #option="{ option }">
              <section id="phone-option" class="flex items-center gap-1">
                <img :src="option.image" alt="country-flag" class="w-6 h-6" />
                <span class="text-sm">{{ option.name }} ({{ option.dialCodes }})</span>
              </section>
            </template>

            <template #value="{ value }">
              <section id="phone-value" class="flex items-center gap-1">
                <span class="text-sm">{{ value }}</span>
              </section>
            </template>
          </PrimeVueSelect>
        </AppBaseFormGroup>

        <section id="phone-number" class="w-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="phoneNumber"
            name="Phone Number"
            spacing-bottom="mb-0"
            :validators="staffMemberCreateEdit_formValidations.phoneNumber"
          >
            <PrimeVueInputText
              v-model="staffMemberCreateEdit_formData.phoneNumber"
              :loading="staffMemberCreateEdit_isLoading"
              class="text-sm w-full"
              :class="{ ...classes }"
              type="tel"
              v-on="useListenerForm(staffMemberCreateEdit_formValidations, 'phoneNumber')"
            />
          </AppBaseFormGroup>
        </section>
      </section>

      <section id="gender" class="col-span-full lg:col-span-6 flex flex-col">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="gender"
          name="Gender"
          :validators="staffMemberCreateEdit_formValidations.gender"
        >
          <div class="flex items-center gap-4 pt-4">
            <PrimeVueRadioButton
              id="`option-male`"
              v-model="staffMemberCreateEdit_formData.gender"
              input-id="option-male"
              name="gender"
              class="text-sm"
              value="male"
              :class="{ ...classes }"
              v-on="useListenerForm(staffMemberCreateEdit_formValidations, 'gender')"
            />

            <label for="option-male" class="font-normal text-black text-sm"> Male </label>

            <PrimeVueRadioButton
              id="`option-female`"
              v-model="staffMemberCreateEdit_formData.gender"
              input-id="option-female"
              name="gender"
              class="text-sm"
              value="female"
              :class="{ ...classes }"
              v-on="useListenerForm(staffMemberCreateEdit_formValidations, 'gender')"
            />

            <label for="option-female" class="font-normal text-black text-sm"> Female </label>
          </div>
        </AppBaseFormGroup>
      </section>

      <div class="col-span-full lg:col-span-6">&nbsp;</div>

      <section id="employment-start-date" class="col-span-full lg:col-span-6 flex flex-col">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="employmentStartDate"
          name="Employment Start Date"
          :validators="staffMemberCreateEdit_formValidations.startDate"
        >
          <PrimeVueDatePicker
            id="employmentStartDate"
            v-model="staffMemberCreateEdit_formData.startDate"
            :loading="staffMemberCreateEdit_isLoading"
            class="text-sm w-full"
            :class="{ ...classes }"
            show-icon
            date-format="dd/mm/yy"
            show-button-bar
            v-on="useListenerForm(staffMemberCreateEdit_formValidations, 'startDate')"
            @clear-click="staffMemberCreateEdit_formData.startDate = null"
          />
        </AppBaseFormGroup>
      </section>

      <section id="employment-end-date" class="col-span-full lg:col-span-6">
        <label for="employmentEndDate" class="font-normal text-sm text-text-secondary">
          Employment End Date <span class="text-text-disabled">(Optional)</span>
        </label>
        <AppBaseFormGroup
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          label-for="employmentEndDate"
          name="Employment End Date"
          :validators="staffMemberCreateEdit_formValidations.endDate"
        >
          <PrimeVueDatePicker
            id="employmentEndDate"
            v-model="staffMemberCreateEdit_formData.endDate"
            :loading="staffMemberCreateEdit_isLoading"
            class="text-sm w-full"
            date-format="dd/mm/yy"
            show-icon
            show-button-bar
            v-on="useListenerForm(staffMemberCreateEdit_formValidations, 'endDate')"
            @clear-click="staffMemberCreateEdit_formData.endDate = null"
          />
        </AppBaseFormGroup>
      </section>

      <section
        v-for="(socialMediaItem, index) in staffMemberCreateEdit_formData.socialMedia"
        :key="index"
        class="col-span-full lg:col-span-6 flex flex-col gap-1"
      >
        <label :for="`socialMediaType-${index}`" class="font-normal text-text-secondary text-sm">
          Social Media <span class="text-text-disabled">(Optional)</span>
        </label>

        <section class="flex items-center gap-2">
          <PrimeVueSelect
            :id="`socialMediaType-${index}`"
            v-model="socialMediaItem.name"
            filter
            :options="staffMemberCreateEdit_typesOfSocialMedia"
            option-label="label"
            option-value="value"
            class="text-sm h-full w-fit"
          >
            <template #option="{ option }">
              <section id="social-media-option" class="flex items-center gap-1">
                <AppBaseSvg :name="option.iconName" class="!w-5 !h-5" />
                <span class="text-sm">{{ option.label }}</span>
              </section>
            </template>

            <template #value="{ value, placeholder }">
              <section id="social-media-value" class="flex items-center gap-1">
                <template v-if="value">
                  <AppBaseSvg :name="findSocialMediaOption(value)?.iconName" class="!w-5 !h-5" />
                </template>
                <template v-else>
                  <span class="text-sm text-text-disabled">{{ placeholder }}</span>
                </template>
              </section>
            </template>
          </PrimeVueSelect>

          <PrimeVueInputText
            v-model="socialMediaItem.account"
            :loading="staffMemberCreateEdit_isLoading"
            class="text-sm w-full"
            type="text"
            placeholder="Account Name / URL"
          />

          <PrimeVueButton icon="pi pi-trash" severity="danger" text rounded @click="removeSocialMedia(index)" />
        </section>
      </section>

      <section id="add-social-media" class="col-span-full lg:col-span-6 place-content-end">
        <PrimeVueButton
          class="border-none basic-smooth-animation w-fit px-3 py-2 rounded-lg hover:bg-grayscale-10"
          severity="secondary"
          variant="outlined"
          @click="addSocialMedia"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="plus-line" class="filter-primary-color w-4 h-4" />
              <span class="font-semibold text-xs text-primary">Add Social Media</span>
            </section>
          </template>
        </PrimeVueButton>
      </section>
    </section>
  </section>
</template>
