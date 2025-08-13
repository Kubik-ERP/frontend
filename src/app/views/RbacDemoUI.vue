<script setup lang="ts">
// Components
import AppRbacTestingPanel from '../components/common/AppRbacTestingPanel.vue';
</script>

<template>
  <section id="rbac-demo-ui" class="default-wrapper">
    <div class="space-y-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">RBAC Demo & Testing</h1>
        <p class="text-gray-600">Test Role-Based Access Control functionality in your application</p>
      </div>

      <AppRbacTestingPanel />

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-blue-800 mb-4">How to Use RBAC in Your Components</h2>

        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium text-blue-700 mb-2">1. In Script Setup</h3>
            <pre
              class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"
            ><code>import { useRbac } from '@/app/composables/useRbac';

const rbac = useRbac();
const canCreatePO = rbac.canCreate('purchaseOrder');
const canUpdatePO = rbac.canUpdate('purchaseOrder');</code></pre>
          </div>

          <div>
            <h3 class="text-lg font-medium text-blue-700 mb-2">2. In Template</h3>
            <pre
              class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"
            ><code>&lt;button v-if="canCreatePO" @click="createPurchaseOrder"&gt;
  Create Purchase Order
&lt;/button&gt;

&lt;button v-if="canUpdatePO" @click="editPurchaseOrder"&gt;
  Edit Purchase Order
&lt;/button&gt;</code></pre>
          </div>

          <div>
            <h3 class="text-lg font-medium text-blue-700 mb-2">3. Route Protection</h3>
            <pre
              class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"
            ><code>// Routes are automatically protected based on ROUTE_PERMISSION_MAPPING
// Define mappings in rbac.constant.ts:
'purchase-order.create': { module: 'purchaseOrder', action: 'isCanCreate' }</code></pre>
          </div>

          <div>
            <h3 class="text-lg font-medium text-blue-700 mb-2">4. Available Permissions</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div class="bg-white p-2 rounded border">isCanCreate</div>
              <div class="bg-white p-2 rounded border">isCanRead</div>
              <div class="bg-white p-2 rounded border">isCanUpdate</div>
              <div class="bg-white p-2 rounded border">isCanDelete</div>
              <div class="bg-white p-2 rounded border">isCanExport</div>
              <div class="bg-white p-2 rounded border">isCanImport</div>
              <div class="bg-white p-2 rounded border">isCanPrint</div>
              <div class="bg-white p-2 rounded border">isCanApprove</div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-green-800 mb-4">Integration with Backend</h2>

        <div class="space-y-3 text-green-700">
          <p>When the backend is ready, you'll need to:</p>
          <ol class="list-decimal list-inside space-y-2 ml-4">
            <li>Update the authentication profile API response to include role information</li>
            <li>Create APIs for role management (CRUD operations)</li>
            <li>Implement permission APIs that return user-specific permissions</li>
            <li>Update the authentication service to set roles from the backend response</li>
            <li>Create role management pages for administrators</li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>
