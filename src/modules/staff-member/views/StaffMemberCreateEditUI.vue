<script setup lang="ts">
// Components
import StaffMemberDetailForm from '../components/StaffMemberDetailForm.vue';

// Services
import { useStaffMemberCreateEditService } from '../services/staff-member-create-edit.service.ts';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  staffMemberCreateEdit_formData,
  staffMemberCreateEdit_formValidations,
  staffMemberCreateEdit_isEditable,
  staffMemberCreateEdit_isLoading,
  // staffMemberCreateEdit_fetchDetailStaffMember,
  staffMemberCreateEdit_onCancel,
  staffMemberCreateEdit_onDelete,
  staffMemberCreateEdit_onSubmit,
  staffMemberCreateEdit_onUploadPhotoProfile,
  staffMemberCreateEdit_routeParamsId,
  staffMemberCreateEdit_typesOfSocialMedia,
  staffMemberCreateEdit_typesOfUserPermissions,
} = useStaffMemberCreateEditService();

/**
 * @description Provide all the data and methods what we need
 */
provide('staffMemberCreateEdit', {
  staffMemberCreateEdit_formData,
  staffMemberCreateEdit_formValidations,
  staffMemberCreateEdit_isEditable,
  staffMemberCreateEdit_isLoading,
  staffMemberCreateEdit_onCancel,
  staffMemberCreateEdit_onDelete,
  staffMemberCreateEdit_onSubmit,
  staffMemberCreateEdit_onUploadPhotoProfile,
  staffMemberCreateEdit_routeParamsId,
  staffMemberCreateEdit_typesOfSocialMedia,
  staffMemberCreateEdit_typesOfUserPermissions,
});
</script>

<template>
  <section id="staff-member-create-edit" class="default-wrapper">
    <StaffMemberDetailForm />
  </section>
</template>
