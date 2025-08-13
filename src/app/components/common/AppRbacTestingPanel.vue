<script setup lang="ts">
import { useRbac, useRbacDirective } from '@/app/composables/useRbac';
import { useRbacStore } from '@/app/store/rbac.store';
import { DEFAULT_ROLES } from '@/app/constants/rbac.constant';

const rbac = useRbac();
const rbacDirective = useRbacDirective();
const rbacStore = useRbacStore();

// Current role information
const currentRole = computed(() => rbac.getCurrentUserRole());
const currentRoleName = rbac.getCurrentRoleName;
const hasRole = rbac.hasRole;

// Permission examples for purchase order (Method 1: Composable)
const canCreatePO = rbac.canCreate('purchaseOrder');
const canReadPO = rbac.canRead('purchaseOrder');
const canUpdatePO = rbac.canUpdate('purchaseOrder');
const canDeletePO = rbac.canDelete('purchaseOrder');
const canApprovePO = rbac.canApprove('purchaseOrder');

// Role state checkers
const isOwner = rbac.isOwner;
const isSuperAdmin = rbac.isSuperAdmin;
const isManager = rbac.isManager;
const isStaff = rbac.isStaff;
const isCashier = rbac.isCashier;

// Method to switch roles for testing
const switchRole = (roleId: string) => {
  rbacStore.rbac_setUserRoleById(roleId);
};

// Method to clear role
const clearRole = () => {
  rbacStore.rbac_clearUserRole();
};

// Available roles
const availableRoles = DEFAULT_ROLES;
</script>

<template>
  <div class="p-6 bg-white rounded-lg border border-gray-200">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">RBAC Testing Panel</h2>

    <!-- Current Role Information -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-semibold mb-3 text-gray-700">Current Role Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-600">
            Has Role:
            <span class="font-medium" :class="hasRole ? 'text-green-600' : 'text-red-600'">{{
              hasRole ? 'Yes' : 'No'
            }}</span>
          </p>
          <p class="text-sm text-gray-600">
            Role Name: <span class="font-medium text-blue-600">{{ currentRoleName }}</span>
          </p>
          <p class="text-sm text-gray-600">
            Role ID: <span class="font-medium text-purple-600">{{ currentRole?.id || 'None' }}</span>
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-600">
            Is Owner:
            <span class="font-medium" :class="isOwner ? 'text-green-600' : 'text-gray-500'">{{
              isOwner ? 'Yes' : 'No'
            }}</span>
          </p>
          <p class="text-sm text-gray-600">
            Is Super Admin:
            <span class="font-medium" :class="isSuperAdmin ? 'text-green-600' : 'text-gray-500'">{{
              isSuperAdmin ? 'Yes' : 'No'
            }}</span>
          </p>
          <p class="text-sm text-gray-600">
            Is Manager:
            <span class="font-medium" :class="isManager ? 'text-green-600' : 'text-gray-500'">{{
              isManager ? 'Yes' : 'No'
            }}</span>
          </p>
          <p class="text-sm text-gray-600">
            Is Staff:
            <span class="font-medium" :class="isStaff ? 'text-green-600' : 'text-gray-500'">{{
              isStaff ? 'Yes' : 'No'
            }}</span>
          </p>
          <p class="text-sm text-gray-600">
            Is Cashier:
            <span class="font-medium" :class="isCashier ? 'text-green-600' : 'text-gray-500'">{{
              isCashier ? 'Yes' : 'No'
            }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Role Switcher -->
    <div class="mb-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="text-lg font-semibold mb-3 text-gray-700">Switch Role (Testing)</h3>
      <div class="flex flex-wrap gap-2 mb-3">
        <button
          v-for="role in availableRoles"
          :key="role.id"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="
            currentRole?.id === role.id
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
          "
          @click="switchRole(role.id)"
        >
          {{ role.name }}
        </button>
        <button
          class="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
          @click="clearRole"
        >
          Clear Role
        </button>
      </div>
      <p class="text-xs text-gray-500">Click on a role to test different permission levels</p>
    </div>

    <!-- Purchase Order Permissions -->
    <div class="mb-6 p-4 bg-green-50 rounded-lg">
      <h3 class="text-lg font-semibold mb-3 text-gray-700">Purchase Order Permissions</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full mr-2" :class="canCreatePO ? 'bg-green-500' : 'bg-red-500'"></div>
          <span class="text-sm" :class="canCreatePO ? 'text-green-700' : 'text-red-700'">Create</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full mr-2" :class="canReadPO ? 'bg-green-500' : 'bg-red-500'"></div>
          <span class="text-sm" :class="canReadPO ? 'text-green-700' : 'text-red-700'">Read</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full mr-2" :class="canUpdatePO ? 'bg-green-500' : 'bg-red-500'"></div>
          <span class="text-sm" :class="canUpdatePO ? 'text-green-700' : 'text-red-700'">Update</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full mr-2" :class="canDeletePO ? 'bg-green-500' : 'bg-red-500'"></div>
          <span class="text-sm" :class="canDeletePO ? 'text-green-700' : 'text-red-700'">Delete</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full mr-2" :class="canApprovePO ? 'bg-green-500' : 'bg-red-500'"></div>
          <span class="text-sm" :class="canApprovePO ? 'text-green-700' : 'text-red-700'">Approve</span>
        </div>
      </div>
    </div>

    <!-- Role Description -->
    <div v-if="currentRole" class="p-4 bg-yellow-50 rounded-lg">
      <h3 class="text-lg font-semibold mb-2 text-gray-700">Role Description</h3>
      <p class="text-sm text-gray-600">{{ currentRole.description }}</p>
    </div>

    <!-- RBAC Usage Examples -->
    <div class="p-4 bg-purple-50 rounded-lg">
      <h3 class="text-lg font-semibold mb-3 text-gray-700">How to Use RBAC in Your Components</h3>
      <p class="text-sm text-gray-600 mb-4">
        This section demonstrates the three main ways to implement RBAC in Vue components. Switch roles above to
        see how each approach responds differently.
      </p>

      <!-- Method 1: Composable Approach -->
      <div class="mb-6">
        <h4 class="font-medium text-purple-700 mb-2">1. Composable Approach (Recommended)</h4>
        <p class="text-xs text-gray-600 mb-3">
          <code class="bg-gray-200 px-1 rounded">const rbac = useRbac()</code> - Reactive refs that update
          automatically when roles change
        </p>
        <div class="bg-white p-3 rounded border">
          <div class="flex flex-wrap gap-2 mb-2">
            <button v-if="canCreatePO" class="px-3 py-1 bg-green-600 text-white rounded text-xs">
              ✓ Create PO
            </button>
            <button v-if="canUpdatePO" class="px-3 py-1 bg-blue-600 text-white rounded text-xs">
              ✓ Update PO
            </button>
            <button v-if="canDeletePO" class="px-3 py-1 bg-red-600 text-white rounded text-xs">✓ Delete PO</button>
            <button v-if="canApprovePO" class="px-3 py-1 bg-orange-600 text-white rounded text-xs">
              ✓ Approve PO
            </button>
          </div>
          <div class="text-xs text-gray-500">
            <div v-if="!canCreatePO" class="text-red-600">✗ Create permission denied</div>
            <div v-if="!canUpdatePO" class="text-red-600">✗ Update permission denied</div>
            <div v-if="!canDeletePO" class="text-red-600">✗ Delete permission denied</div>
            <div v-if="!canApprovePO" class="text-red-600">✗ Approve permission denied</div>
          </div>
        </div>
        <div class="mt-2 text-xs text-gray-600">
          <strong>Usage:</strong> <code class="bg-gray-200 px-1 rounded">v-if="canCreatePO"</code> where
          <code class="bg-gray-200 px-1 rounded">canCreatePO = rbac.canCreate('purchaseOrder')</code>
        </div>
      </div>

      <!-- Method 2: Custom Directive -->
      <div class="mb-6">
        <h4 class="font-medium text-purple-700 mb-2">2. Custom Directive (Declarative)</h4>
        <p class="text-xs text-gray-600 mb-3">
          <code class="bg-gray-200 px-1 rounded">v-rbac="{ module, action, fallback }"</code> - Clean declarative
          syntax
        </p>
        <div class="bg-white p-3 rounded border">
          <div class="mb-3">
            <p class="text-xs font-medium text-gray-700 mb-2">Hide mode (default):</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-rbac="{ module: 'purchaseOrder', action: 'isCanCreate' }"
                class="px-3 py-1 bg-green-600 text-white rounded text-xs"
              >
                Create PO (Hidden if no permission)
              </button>
              <button
                v-rbac="{ module: 'purchaseOrder', action: 'isCanDelete' }"
                class="px-3 py-1 bg-red-600 text-white rounded text-xs"
              >
                Delete PO (Hidden if no permission)
              </button>
            </div>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-700 mb-2">Disable mode:</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-rbac="{ module: 'purchaseOrder', action: 'isCanUpdate', fallback: 'disable' }"
                class="px-3 py-1 bg-blue-600 text-white rounded text-xs"
              >
                Update PO (Disabled if no permission)
              </button>
              <button
                v-rbac="{ module: 'purchaseOrder', action: 'isCanApprove', fallback: 'disable' }"
                class="px-3 py-1 bg-orange-600 text-white rounded text-xs"
              >
                Approve PO (Disabled if no permission)
              </button>
            </div>
          </div>
        </div>
        <div class="mt-2 text-xs text-gray-600">
          <strong>Usage:</strong>
          <code class="bg-gray-200 px-1 rounded">v-rbac="{ module: 'purchaseOrder', action: 'isCanCreate' }"</code>
          <br />
          <strong>With disable:</strong>
          <code class="bg-gray-200 px-1 rounded"
            >v-rbac="{ module: 'purchaseOrder', action: 'isCanUpdate', fallback: 'disable' }"</code
          >
        </div>
      </div>

      <!-- Method 3: Template Helper Functions -->
      <div class="mb-6">
        <h4 class="font-medium text-purple-700 mb-2">3. Template Helper Functions</h4>
        <p class="text-xs text-gray-600 mb-3">
          <code class="bg-gray-200 px-1 rounded">const rbacDirective = useRbacDirective()</code> - Helper functions
          for v-if conditions
        </p>
        <div class="bg-white p-3 rounded border">
          <div class="mb-3">
            <p class="text-xs font-medium text-gray-700 mb-2">Basic permissions:</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-if="rbacDirective.checkPermission('purchaseOrder', 'isCanCreate')"
                class="px-3 py-1 bg-green-600 text-white rounded text-xs"
              >
                Create PO (Helper Function)
              </button>
              <button
                v-if="rbacDirective.checkPermission('purchaseOrder', 'isCanUpdate')"
                class="px-3 py-1 bg-blue-600 text-white rounded text-xs"
              >
                Update PO (Helper Function)
              </button>
            </div>
          </div>
          <div class="mb-3">
            <p class="text-xs font-medium text-gray-700 mb-2">Extended permissions:</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-if="rbacDirective.checkExtendedPermission('purchaseOrder', 'isCanApprove')"
                class="px-3 py-1 bg-orange-600 text-white rounded text-xs"
              >
                Approve PO (Extended Permission)
              </button>
            </div>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-700 mb-2">Module access check:</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-if="rbacDirective.checkModuleAccess('purchaseOrder')"
                class="px-3 py-1 bg-purple-600 text-white rounded text-xs"
              >
                Has PO Module Access
              </button>
              <div
                v-if="!rbacDirective.checkModuleAccess('purchaseOrder')"
                class="px-3 py-1 bg-gray-400 text-white rounded text-xs"
              >
                ✗ No PO Module Access
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2 text-xs text-gray-600">
          <strong>Usage:</strong>
          <code class="bg-gray-200 px-1 rounded">v-if="rbacDirective.checkPermission('module', 'action')"</code>
          <br />
          <strong>Extended:</strong>
          <code class="bg-gray-200 px-1 rounded"
            >v-if="rbacDirective.checkExtendedPermission('module', 'action')"</code
          >
        </div>
      </div>

      <!-- Role-based Examples -->
      <div class="mb-4">
        <h4 class="font-medium text-purple-700 mb-2">4. Role-based Conditions</h4>
        <p class="text-xs text-gray-600 mb-3">
          Role-specific UI elements using both composable and helper approaches
        </p>
        <div class="bg-white p-3 rounded border">
          <div class="flex flex-wrap gap-2 mb-2">
            <!-- Using composable approach -->
            <div v-if="isSuperAdmin" class="px-3 py-1 bg-red-700 text-white rounded text-xs">
              🔑 Super Admin Panel (Composable)
            </div>
            <div v-if="isManager" class="px-3 py-1 bg-blue-700 text-white rounded text-xs">
              👔 Manager Tools (Composable)
            </div>
            <div v-if="isCashier" class="px-3 py-1 bg-green-700 text-white rounded text-xs">
              💰 Cashier Interface (Composable)
            </div>

            <!-- Using helper approach -->
            <div v-if="rbacDirective.isSuperAdmin" class="px-3 py-1 bg-red-600 text-white rounded text-xs">
              🔑 Admin Panel (Helper)
            </div>
            <div v-if="rbacDirective.hasRole" class="px-3 py-1 bg-gray-600 text-white rounded text-xs">
              ✓ Has Role (Helper)
            </div>
          </div>
        </div>
        <div class="mt-2 text-xs text-gray-600">
          <strong>Composable:</strong> <code class="bg-gray-200 px-1 rounded">v-if="isSuperAdmin"</code> where
          <code class="bg-gray-200 px-1 rounded">isSuperAdmin = rbac.isSuperAdmin</code>
          <br />
          <strong>Helper:</strong> <code class="bg-gray-200 px-1 rounded">v-if="rbacDirective.isSuperAdmin"</code>
        </div>
      </div>

      <!-- Best Practices Summary -->
      <div class="bg-blue-50 p-3 rounded border">
        <h5 class="font-medium text-blue-800 mb-2">💡 When to Use Each Approach:</h5>
        <ul class="text-xs text-blue-700 space-y-1">
          <li><strong>Composable:</strong> Complex logic, reactive states, TypeScript autocompletion</li>
          <li><strong>Directive:</strong> Clean templates, quick hide/disable, visual feedback</li>
          <li><strong>Helper Functions:</strong> Simple v-if conditions, explicit function calls</li>
        </ul>
      </div>
    </div>
  </div>
</template>
