<script setup lang="ts">
// Interfaces
import type { IMenuRecipeDetailProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  menuRecipeDetail_onResetToCurrentVersion,
  menuRecipeDetail_onSelectVersion,
  menuRecipeDetail_selectedVersionId,
  menuRecipeDetail_versions,
} = inject('menuRecipeDetail') as IMenuRecipeDetailProvided;

const formatedDate = (dateString: string): string => {
  // Convert date from "11 02, 16:19" into "02 Nov Current Year"
  const currentYear = new Date().getFullYear();
  const date = new Date(`${dateString} ${currentYear}`);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };

  return date.toLocaleDateString('en-US', options);
};

/**
 * @description Handle reset to current version
 */
const handleResetToCurrentVersion = (): void => {
  // Reset selected version to view current version
  menuRecipeDetail_onResetToCurrentVersion();
};
</script>

<template>
  <section id="menu-recipe-versions" class="flex flex-col gap-3 p-6">
    <div class="flex items-center justify-between">
      <h5 class="font-semibold text-primary text-lg">Versions</h5>

      <!-- Reset to Current Button -->
      <PrimeVueButton
        v-if="menuRecipeDetail_selectedVersionId"
        size="small"
        variant="text"
        class="text-xs"
        @click="handleResetToCurrentVersion"
      >
        View Current
      </PrimeVueButton>
    </div>

    <!-- Loading State -->
    <div v-if="!menuRecipeDetail_versions" class="flex flex-col gap-2">
      <PrimeVueSkeleton height="2rem" class="mb-2" />
      <PrimeVueSkeleton height="2rem" class="mb-2" />
      <PrimeVueSkeleton height="2rem" />
    </div>

    <!-- Current Version -->
    <section
      v-if="!menuRecipeDetail_selectedVersionId && menuRecipeDetail_versions"
      class="flex items-center justify-between w-full p-3 rounded-lg border border-primary bg-primary-50 cursor-pointer"
    >
      <div class="flex items-center gap-2">
        <span class="font-medium text-sm text-primary">Current Version</span>
        <PrimeVueChip class="text-xs font-medium bg-green-100 text-green-700" label="Latest" />
      </div>
      <span class="font-normal text-text-disabled text-sm">Active</span>
    </section>

    <!-- Versions List -->
    <div
      v-if="menuRecipeDetail_versions && menuRecipeDetail_versions.versions.length > 0"
      class="flex flex-col gap-2"
    >
      <section
        v-for="version in menuRecipeDetail_versions.versions"
        :key="version.versionId"
        class="flex items-center justify-between w-full p-3 rounded-lg border transition-colors duration-200 cursor-pointer hover:bg-gray-50"
        :class="[
          menuRecipeDetail_selectedVersionId === version.versionId
            ? 'border-primary bg-primary-50'
            : 'border-gray-200',
        ]"
        @click="menuRecipeDetail_onSelectVersion(version.versionId)"
      >
        <span
          class="font-medium text-sm"
          :class="[
            menuRecipeDetail_selectedVersionId === version.versionId ? 'text-primary' : 'text-text-primary',
          ]"
        >
          {{ version.versionNumber }}
        </span>

        <span class="font-normal text-text-disabled text-sm">
          <!-- Convert date from 11 02, 16:19 into DD MMM YYYY -->
          {{ formatedDate(version.createdAt) }}
        </span>
      </section>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="menuRecipeDetail_versions && menuRecipeDetail_versions.versions.length === 0"
      class="flex flex-col items-center justify-center py-8 text-center"
    >
      <span class="font-normal text-text-disabled text-sm">No versions available</span>
    </div>
  </section>
</template>
