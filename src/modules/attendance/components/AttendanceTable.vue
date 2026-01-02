<script setup lang="ts">
import { ref } from 'vue';
import type { ComponentPublicInstance } from 'vue';

// Interfaces
import type { IAttendanceListProvided } from '../interfaces';

/**
 * @description Reactive data binding
 */
const popoverRefs = ref<Record<string, ComponentPublicInstance | null>>({});

/**
 * @description Set popover ref
 */
const setPopoverRef = (recordId: number, el: Element | ComponentPublicInstance | null) => {
  if (el) {
    popoverRefs.value[`main-${recordId}`] = el as ComponentPublicInstance;
  }
};

/**
 * @description Set expansion popover ref
 */
const setExpansionPopoverRef = (
  recordId: number,
  shiftId: string,
  el: Element | ComponentPublicInstance | null,
) => {
  if (el) {
    popoverRefs.value[`expansion-${recordId}-${shiftId}`] = el as ComponentPublicInstance;
  }
};

/**
 * @description Toggle main popover
 */
const toggleMainPopover = (event: Event, recordId: number) => {
  const popover = popoverRefs.value[`main-${recordId}`] as ComponentPublicInstance & {
    toggle: (event: Event) => void;
  };
  if (popover && popover.toggle) {
    popover.toggle(event);
  }
};

/**
 * @description Toggle expansion popover
 */
const toggleExpansionPopover = (event: Event, recordId: number, shiftId: string) => {
  const popover = popoverRefs.value[`expansion-${recordId}-${shiftId}`] as ComponentPublicInstance & {
    toggle: (event: Event) => void;
  };
  if (popover && popover.toggle) {
    popover.toggle(event);
  }
};

/**
 * @description Close main popover
 */
const closeMainPopover = (recordId: number) => {
  const popover = popoverRefs.value[`main-${recordId}`] as ComponentPublicInstance & {
    hide: () => void;
  };
  if (popover && popover.hide) {
    popover.hide();
  }
};

/**
 * @description Close expansion popover
 */
const closeExpansionPopover = (recordId: number, shiftId: string) => {
  const popover = popoverRefs.value[`expansion-${recordId}-${shiftId}`] as ComponentPublicInstance & {
    hide: () => void;
  };
  if (popover && popover.hide) {
    popover.hide();
  }
};

/**
 * @description Handle edit with popover close
 */
const handleEdit = (recordId: number) => {
  closeMainPopover(recordId);
  attendanceList_onEdit(recordId);
};

/**
 * @description Handle delete with popover close
 */
const handleDelete = (recordId: number) => {
  closeMainPopover(recordId);
  attendanceList_handleDelete(recordId);
};

/**
 * @description Handle expansion edit with popover close
 */
const handleExpansionEdit = (recordId: number, shiftId: string) => {
  closeExpansionPopover(recordId, shiftId);
  attendanceList_onEdit(recordId);
};

/**
 * @description Handle expansion delete with popover close
 */
const handleExpansionDelete = (recordId: number, shiftId: string) => {
  closeExpansionPopover(recordId, shiftId);
  attendanceList_handleDelete(recordId);
};

/**
 * @description Inject all the data and methods what we need
 */
const {
  attendanceList_columns,
  attendanceList_listData,
  attendanceList_onCreate,
  attendanceList_onEdit,
  attendanceList_formatTime,
  attendanceList_getStatusColor,
  attendanceList_handleDelete,
  attendanceList_onChangePage,
  attendanceList_onSort,
  attendanceList_queryParams,
  attendanceList_staffList,
  attendanceList_fetchList,
} = inject('attendance') as IAttendanceListProvided;
</script>

<template>
  <section id="attendance-table" class="flex flex-col gap-4 w-full">
    <AppBaseDataTable
      :columns="attendanceList_columns"
      :data="attendanceList_listData.items"
      :total-records="attendanceList_listData.meta.total"
      :rows-per-page="attendanceList_queryParams.limit"
      :first="(attendanceList_listData.meta.currentPage - 1) * attendanceList_listData.meta.perPage"
      header-title="Attendance Records"
      btn-cta-create-title="Add Attendance"
      :is-using-custom-table="true"
      :is-using-expandable-rows="true"
      :is-using-custom-body="true"
      :is-using-btn-cta-create="true"
      :is-using-filter="true"
      expandable-rows-field="shifts"
      expandable-rows-id-field="id"
      :sort-by="attendanceList_queryParams.sortBy"
      :sort-order="attendanceList_queryParams.sortOrder"
      @click-btn-cta-create="attendanceList_onCreate"
      @change-page="attendanceList_onChangePage"
      @sort="attendanceList_onSort"
    >
      <template #filter>
        <div class="flex items-center gap-4">
          <PrimeVueCalendar
            v-model="attendanceList_queryParams.startDate"
            date-format="dd/mm/yy"
            placeholder="Start Date"
            show-icon
            class="text-sm"
          />
          <PrimeVueCalendar
            v-model="attendanceList_queryParams.endDate"
            date-format="dd/mm/yy"
            placeholder="End Date"
            show-icon
            class="text-sm"
          />
          <PrimeVueSelect
            v-model="attendanceList_queryParams.staffId"
            :options="attendanceList_staffList"
            option-label="label"
            option-value="value"
            placeholder="Select Staff"
            class="text-sm"
          />
          <PrimeVueButton label="Filter" @click="attendanceList_fetchList" />
        </div>
      </template>

      <!-- Custom body slot for main rows -->
      <template #body="{ column, data, isExpandable, isExpanded, toggleExpansion, primaryItem }">
        <!-- Date Column -->
        <template v-if="column.value === 'date'">
          <div class="flex items-center gap-2">
            <!-- Collapse/Expand Button -->
            <PrimeVueButton v-if="isExpandable" variant="text" size="small" @click="toggleExpansion">
              <template #icon>
                <AppBaseSvg :name="isExpanded ? 'chevron-down' : 'chevron-right'" class="!w-4 !h-4" />
              </template>
            </PrimeVueButton>

            <!-- Date -->
            <span class="font-normal text-sm text-text-primary">
              {{ data.date }}
            </span>
          </div>
        </template>

        <!-- Staff Name -->
        <template v-else-if="column.value === 'staffName'">
          <span class="font-medium text-sm text-text-primary">
            {{ data.staffName }}
          </span>
        </template>

        <!-- Primary Shift Data -->
        <template v-else-if="primaryItem && column.value === 'shift'">
          <span class="font-normal text-sm text-text-primary">
            {{ primaryItem.shiftStart }} - {{ primaryItem.shiftEnd }}
          </span>
        </template>

        <template v-else-if="primaryItem && column.value === 'clockIn'">
          <span class="font-normal text-sm" :class="primaryItem.clockIn ? 'text-text-primary' : 'text-gray-400'">
            {{ attendanceList_formatTime(primaryItem.clockIn || null) }}
          </span>
        </template>

        <template v-else-if="primaryItem && column.value === 'clockOut'">
          <span class="font-normal text-sm" :class="primaryItem.clockOut ? 'text-text-primary' : 'text-gray-400'">
            {{ attendanceList_formatTime(primaryItem.clockOut || null) }}
          </span>
        </template>

        <template v-else-if="primaryItem && column.value === 'duration'">
          <span class="font-medium text-sm text-text-primary">
            {{ primaryItem.duration }}
          </span>
        </template>

        <template v-else-if="primaryItem && column.value === 'early'">
          <span
            class="font-normal text-sm"
            :class="attendanceList_getStatusColor(primaryItem.early || '', 'early')"
          >
            {{ primaryItem.early }}
          </span>
        </template>

        <template v-else-if="primaryItem && column.value === 'late'">
          <span class="font-normal text-sm" :class="attendanceList_getStatusColor(primaryItem.late || '', 'late')">
            {{ primaryItem.late }}
          </span>
        </template>

        <template v-else-if="primaryItem && column.value === 'overtime'">
          <span
            class="font-normal text-sm"
            :class="attendanceList_getStatusColor(primaryItem.overtime || '', 'overtime')"
          >
            {{ primaryItem.overtime }}
          </span>
        </template>

        <!-- Action -->
        <template v-else-if="column.value === 'action'">
          <div class="flex justify-center">
            <PrimeVueButton
              class="w-10 h-10"
              variant="text"
              rounded
              aria-label="actions"
              @click="toggleMainPopover($event, data.id)"
            >
              <template #icon>
                <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
              </template>
            </PrimeVueButton>

            <PrimeVuePopover
              :ref="(el: Element | ComponentPublicInstance | null) => setPopoverRef(data.id, el)"
              :pt="{
                content: 'p-0',
              }"
            >
              <section id="popover-content" class="flex flex-col">
                <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="handleEdit(data.id)">
                  <template #default>
                    <section id="content" class="flex items-center gap-2 w-full">
                      <AppBaseSvg name="edit" class="!w-4 !h-4" />
                      <span class="font-normal text-sm text-text-primary">Edit</span>
                    </section>
                  </template>
                </PrimeVueButton>

                <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="handleDelete(data.id)">
                  <template #default>
                    <section id="content" class="flex items-center gap-2 w-full">
                      <AppBaseSvg name="delete" class="!w-4 !h-4" />
                      <span class="font-normal text-sm text-text-primary">Delete</span>
                    </section>
                  </template>
                </PrimeVueButton>
              </section>
            </PrimeVuePopover>
          </div>
        </template>

        <!-- Default fallback -->
        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>

      <!-- Custom expanded body slot for additional shifts -->
      <template #expanded-body="{ column, data, item }">
        <!-- Empty cells for date and staff name -->
        <template v-if="column.value === 'date' || column.value === 'staffName'">
          <!-- Empty cell -->
        </template>

        <!-- Shift data for expanded rows -->
        <template v-else-if="column.value === 'shift'">
          <span class="font-normal text-sm text-text-primary"> {{ item.shiftStart }} - {{ item.shiftEnd }} </span>
        </template>

        <template v-else-if="column.value === 'clockIn'">
          <span class="font-normal text-sm" :class="item.clockIn ? 'text-text-primary' : 'text-gray-400'">
            {{ attendanceList_formatTime(item.clockIn || null) }}
          </span>
        </template>

        <template v-else-if="column.value === 'clockOut'">
          <span class="font-normal text-sm" :class="item.clockOut ? 'text-text-primary' : 'text-gray-400'">
            {{ attendanceList_formatTime(item.clockOut || null) }}
          </span>
        </template>

        <template v-else-if="column.value === 'duration'">
          <span class="font-medium text-sm text-text-primary">
            {{ item.duration }}
          </span>
        </template>

        <template v-else-if="column.value === 'early'">
          <span class="font-normal text-sm" :class="attendanceList_getStatusColor(item.early, 'early')">
            {{ item.early }}
          </span>
        </template>

        <template v-else-if="column.value === 'late'">
          <span class="font-normal text-sm" :class="attendanceList_getStatusColor(item.late, 'late')">
            {{ item.late }}
          </span>
        </template>

        <template v-else-if="column.value === 'overtime'">
          <span class="font-normal text-sm" :class="attendanceList_getStatusColor(item.overtime, 'overtime')">
            {{ item.overtime }}
          </span>
        </template>

        <!-- Action for expanded rows -->
        <template v-else-if="column.value === 'action'">
          <PrimeVueButton
            class="w-10 h-10"
            variant="text"
            rounded
            aria-label="actions"
            @click="toggleExpansionPopover($event, data.id, item.id)"
          >
            <template #icon>
              <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>

          <PrimeVuePopover
            :ref="(el: Element | ComponentPublicInstance | null) => setExpansionPopoverRef(data.id, item.id, el)"
            :pt="{
              content: 'p-0',
            }"
          >
            <section id="popover-content" class="flex flex-col">
              <PrimeVueButton
                class="w-full px-4 py-3"
                variant="text"
                @click="handleExpansionEdit(data.id, item.id)"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="edit" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">Edit</span>
                  </section>
                </template>
              </PrimeVueButton>

              <PrimeVueButton
                class="w-full px-4 py-3"
                variant="text"
                @click="handleExpansionDelete(data.id, item.id)"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="delete" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">Delete</span>
                  </section>
                </template>
              </PrimeVueButton>
            </section>
          </PrimeVuePopover>
        </template>

        <!-- Default fallback for other columns -->
        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ item[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>
