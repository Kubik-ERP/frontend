import type { App, DirectiveBinding } from 'vue';
import { useRbacStore } from '../store/rbac.store';
import type { IModulePermissions, IBasePermissions, IExtendedPermissions } from '../interfaces/rbac.interface';

interface RbacDirectiveValue {
  module: keyof IModulePermissions;
  action: keyof IBasePermissions | keyof IExtendedPermissions;
  fallback?: 'hide' | 'disable';
}

/**
 * @description RBAC directive for controlling element visibility/state based on permissions
 * Usage: v-rbac="{ module: 'purchaseOrder', action: 'isCanCreate' }"
 * Usage with fallback: v-rbac="{ module: 'purchaseOrder', action: 'isCanUpdate', fallback: 'disable' }"
 */
export const rbacDirective = {
  name: 'rbac',
  directive: {
    mounted(el: HTMLElement, binding: DirectiveBinding<RbacDirectiveValue>) {
      updateElement(el, binding);
    },
    updated(el: HTMLElement, binding: DirectiveBinding<RbacDirectiveValue>) {
      updateElement(el, binding);
    },
  },
};

function updateElement(el: HTMLElement, binding: DirectiveBinding<RbacDirectiveValue>) {
  const rbacStore = useRbacStore();
  const { module, action, fallback = 'hide' } = binding.value;

  // Check if user has the required permission
  const hasPermission = rbacStore.rbac_hasPermission(module, action);

  if (hasPermission) {
    // Restore element if permission is granted
    el.removeAttribute('disabled');
    el.style.opacity = '';
    el.style.cursor = '';
    el.style.display = '';
    el.title = '';
  } else if (fallback === 'disable') {
    // Disable the element
    el.setAttribute('disabled', 'true');
    el.style.opacity = '0.5';
    el.style.cursor = 'not-allowed';
    el.title = 'You do not have permission to perform this action';
  } else {
    // Hide the element
    el.style.display = 'none';
  }
}

/**
 * @description Install RBAC directive globally
 */
export const installRbacDirective = (app: App) => {
  app.directive(rbacDirective.name, rbacDirective.directive);
};

export default rbacDirective;
