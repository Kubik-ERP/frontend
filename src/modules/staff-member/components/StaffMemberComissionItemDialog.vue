<script setup lang="ts">
// Interfaces
import { IProduct } from '@/modules/catalog-product/interfaces';
import type { ICommissionTableData, IStaffMemberCreateEditProvided } from '../interfaces';
import { IVoucher } from '@/modules/voucher/interfaces';

const {
  staffMemberCreateEdit_columnsOfCommissions,
  staffMemberCreateEdit_commisionType,
  staffMemberCreateEdit_onCloseDialogCommission,
  staffMemberCreateEdit_dataColumnsOfProduct,
  staffMemberCreateEdit_dataColumnsOfVoucher,
  staffMemberCreateEdit_commissionsSearch,
  staffMemberCreateEdit_onSubmitDialogCommission,
  staffMemberCreateEdit_formData,
  // staffMemberCreateEdit_formData
} = inject<IStaffMemberCreateEditProvided>('staffMemberCreateEdit')!;

/**
 * @description Default Commission
 */
const defaultCommissionValue = ref<number | null>(0);
const defaultCommissionType = ref<string | "amount" | "percentage" | null>('amount');
const commissionTypes = ref([
  {
    label: 'Rp',
    value: 'amount',
  },
  {
    label: '%',
    value: 'percentage',
  },
]);
const isAllCommissionSame = ref(false);

const commissionTableData = ref<ICommissionTableData[]>([]);

watchEffect(() => {
  if (staffMemberCreateEdit_commisionType.value === 'PRODUCT') {
    defaultCommissionValue.value = staffMemberCreateEdit_formData.defaultCommissionProduct;
    defaultCommissionType.value = staffMemberCreateEdit_formData.defaultCommissionProductType;

    commissionTableData.value = staffMemberCreateEdit_dataColumnsOfProduct.value.map((p: IProduct) => {
      const existing = staffMemberCreateEdit_formData.commissions.productCommission.productItems?.find((c) => c.product_id === p.id);

      return {
        id: p.id,
        name: p.name,
        price: p.price,
        discountPrice: p.discountPrice,
        commissionType: existing?.is_percent === true ? 'percentage' : 'amount',
        commissionValue: existing?.amount ?? 0,
      };
    });
  } else {
    defaultCommissionValue.value = staffMemberCreateEdit_formData.defaultCommissionVoucher;
    defaultCommissionType.value = staffMemberCreateEdit_formData.defaultCommissionVoucherType;

    commissionTableData.value = staffMemberCreateEdit_dataColumnsOfVoucher.value.map((v: IVoucher) => {
      const existing = staffMemberCreateEdit_formData.commissions.voucherCommission.voucherItems?.find((c) => c.voucher_id === v.id);
      console.log('existing', existing);
      return {
        id: v.id,
        name: v.name,
        amount: v.amount,
        isPercent: v.isPercent,
        commissionType: existing?.is_percent === true ? 'percentage' : 'amount',
        commissionValue: existing?.amount ?? 0,
      };
    });
  }
});

/**
 * @description Filter data berdasarkan search
 */
const filteredCommissionTableData = computed(() => {
  const keyword = staffMemberCreateEdit_commissionsSearch.value?.toLowerCase() || '';
  if (!keyword) return commissionTableData.value;

  return commissionTableData.value.filter(item => item.name.toLowerCase().includes(keyword));
});

/**
 * @description Format currency
 */
function formatCurrency(value?: number) {
  if (!value && value !== 0) return '';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * @description Handle submit
 */
function handleSubmit() {
  const form = new FormData();

  if (staffMemberCreateEdit_commisionType.value === 'PRODUCT') {
    form.append('defaultCommission', String(defaultCommissionValue.value));
    form.append('defaultCommissionType', defaultCommissionType.value ?? 'amount');
    form.append('isAllItemsHaveDefaultCommission', String(isAllCommissionSame.value));

    commissionTableData.value
      .filter(item => item.commissionValue > 0)
      .forEach((item, idx) => {
        form.append(`productItems[${idx}].product_id`, String(item.id));
        form.append(`productItems[${idx}].amount`, String(item.commissionValue));
        form.append(`productItems[${idx}].is_percent`, item.commissionType === 'percentage' ? 'true' : 'false');
      });
  } else {
    form.append('defaultCommission', String(defaultCommissionValue.value));
    form.append('defaultCommissionType', defaultCommissionType.value ?? 'amount');
    form.append('isAllItemsHaveDefaultCommission', String(isAllCommissionSame.value));

    commissionTableData.value
      .filter(item => item.commissionValue > 0)
      .forEach((item, idx) => {
        console.log(item);
        form.append(`voucherItems[${idx}].voucher_id`, String(item.id));
        form.append(`voucherItems[${idx}].amount`, String(item.commissionValue));
        form.append(`voucherItems[${idx}].is_percent`, item.commissionType === 'percentage' ? 'true' : 'false');
      });
  }
  staffMemberCreateEdit_onSubmitDialogCommission?.(form);
}

watch([isAllCommissionSame, defaultCommissionValue, defaultCommissionType], () => {
  if (isAllCommissionSame.value) {
    commissionTableData.value = commissionTableData.value.map(item => ({
      ...item,
      commissionValue: defaultCommissionValue.value ?? 0,
      commissionType: defaultCommissionType.value ?? 'amount',
    }));
  }
});

const handleClose = () => {
  staffMemberCreateEdit_onCloseDialogCommission();
};
</script>

<template>
  <AppBaseDialog id="staff-member-comission-item-dialog" width="100%">
    <template #header>
      <h6 class="font-semibold text-black text-lg">
        {{ staffMemberCreateEdit_commisionType === 'PRODUCT' ? 'Product Commissions' : 'Voucher Commissions' }}
      </h6>
    </template>

    <template #content>
      <form class="flex flex-col gap-4 w-full">
        <!-- Default commission input -->
        <div class="flex flex-col gap-2 w-full sm:w-fit">
          <label for="commission-input" class="text-base text-gray-800">
            Default {{ staffMemberCreateEdit_commisionType === 'PRODUCT' ? 'Product' : 'Voucher' }} Commissions
          </label>

          <PrimeVueInputGroup class="w-full sm:w-64 rounded-lg border border-gray-300 overflow-hidden">
            <PrimeVueInputNumber
              id="commission-input"
              v-model="defaultCommissionValue"
              placeholder="0"
              :min-fraction-digits="0"
              :max-fraction-digits="2"
              :prefix="defaultCommissionType === 'amount' ? 'Rp' : ''"
              :suffix="defaultCommissionType === 'percentage' ? '%' : ''"
              mode="decimal"
              class="flex-1"
            />

            <PrimeVueInputGroupAddon class="bg-transparent pr-0 pl-2">
              <PrimeVueSelect
                v-model="defaultCommissionType"
                :options="commissionTypes"
                option-label="label"
                option-value="value"
                :default-value="defaultCommissionType ?? 'amount'"
                :pt="{
                  root: 'border-none bg-transparent shadow-none ring-0 focus:ring-0 p-0',
                  label: 'pr-2',
                }"
              />
            </PrimeVueInputGroupAddon>
          </PrimeVueInputGroup>
        </div>

        <!-- Checkbox -->
        <div class="flex items-center gap-2 flex-wrap">
          <PrimeVueCheckbox v-model="isAllCommissionSame" binary />
          <span class="font-normal text-black text-sm">
            All
            {{ staffMemberCreateEdit_commisionType === 'PRODUCT' ? 'products' : 'vouchers' }}
            have same default commission
          </span>
        </div>

        <!-- Search Input -->
        <div class="flex flex-col gap-2 w-full">
          <label for="search-input" class="font-semibold text-md text-black">
            {{ staffMemberCreateEdit_commisionType === 'PRODUCT' ? 'Product' : 'Voucher' }}
          </label>
          <PrimeVueInputText
            v-model="staffMemberCreateEdit_commissionsSearch"
            placeholder="Search..."
            class="w-full"
          />
        </div>

        <!-- DataTable -->
        <div class="w-full overflow-x-auto">
          <PrimeVueDataTable
            :value="filteredCommissionTableData"
            class="w-full min-w-[500px] border border-gray-300 rounded-2xl max-h-[20rem] overflow-y-scroll"
          >
            <PrimeVueColumn
              v-for="(column, columnIndex) in staffMemberCreateEdit_columnsOfCommissions"
              :key="`column-${columnIndex}`"
              :field="column.value"
              :header="column.label"
            >
              <template #body="{ data, index }">
                <!-- Commission input -->
                <template v-if="column.value === 'commissions'">
                  <PrimeVueInputGroup class="w-full sm:w-64 rounded-lg border border-gray-300 overflow-hidden">
                    <PrimeVueInputNumber
                      v-model="filteredCommissionTableData[index].commissionValue"
                      placeholder="0"
                      :min-fraction-digits="0"
                      :max-fraction-digits="2"
                      :prefix="filteredCommissionTableData[index].commissionType === 'amount' ? 'Rp' : ''"
                      :suffix="filteredCommissionTableData[index].commissionType === 'percentage' ? '%' : ''"
                      mode="decimal"
                      class="flex-1"
                    />
                    <PrimeVueInputGroupAddon class="bg-transparent pr-0 pl-2">
                      <PrimeVueSelect
                        v-model="filteredCommissionTableData[index].commissionType"
                        :options="commissionTypes"
                        option-label="label"
                        option-value="value"
                        :default-value="filteredCommissionTableData[index].commissionType === 'amount' ? 'amount' : 'percentage'"
                        :pt="{
                          root: 'border-none bg-transparent shadow-none ring-0 focus:ring-0 p-0',
                          label: 'pr-2',
                        }"
                      />
                    </PrimeVueInputGroupAddon>
                  </PrimeVueInputGroup>
                </template>

                <!-- Item -->
                <template v-else-if="column.value === 'item'">
                  {{ data.name }}
                </template>

                <!-- Price / Amount -->
                <template v-else-if="column.value === 'price'">
                  <div v-if="staffMemberCreateEdit_commisionType === 'PRODUCT'">
                    <span v-if="data.discountPrice">
                      <s>{{ formatCurrency(data.price) }}</s>
                      <span class="ml-2 text-red-500">{{ formatCurrency(data.discountPrice) }}</span>
                    </span>
                    <span v-else>
                      {{ formatCurrency(data.price) }}
                    </span>
                  </div>
                  <div v-else>
                    <span v-if="data.isPercent">{{ data.amount }}%</span>
                    <span v-else>{{ formatCurrency(data.amount) }}</span>
                  </div>
                </template>
              </template>
            </PrimeVueColumn>
          </PrimeVueDataTable>
        </div>
      </form>
    </template>

    <template #footer>
      <footer class="flex flex-col sm:flex-row items-center justify-end w-full gap-3 mt-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full sm:w-auto border border-solid border-primary"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="handleClose"
        />
        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] w-full sm:w-auto"
          label="Save"
          type="button"
          @click="handleSubmit"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>

