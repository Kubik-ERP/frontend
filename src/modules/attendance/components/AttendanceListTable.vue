<script setup lang="ts">
import { ref } from 'vue';
import type { ComponentPublicInstance } from 'vue';

// Components
// import AttendanceListCreateDialog from './AttendanceListCreateDialog.vue';

// Interfaces
import type { IAttendanceListProvided } from '../interfaces';
import type { IAttendanceShift } from '../interfaces/attendance-data.interface';

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
  console.log('Edit clicked for record:', recordId);
  closeMainPopover(recordId);
  attendanceList_onEdit(recordId);
};

/**
 * @description Handle delete with popover close
 */
const handleDelete = (recordId: number) => {
  console.log('Delete clicked for record:', recordId);
  closeMainPopover(recordId);
  attendanceList_handleDelete(recordId);
};

/**
 * @description Handle create attendance
 */
const handleCreate = () => {
  console.log('Create attendance clicked');
  attendanceList_onCreate();
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
 * @description Expanded rows tracking
 */
const expandedRows = ref<Set<number>>(new Set());

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
} = inject('attendance') as IAttendanceListProvided;

/**
 * @description Toggle row expansion
 */
const toggleRowExpansion = (rowId: number) => {
  if (expandedRows.value.has(rowId)) {
    expandedRows.value.delete(rowId);
  } else {
    expandedRows.value.add(rowId);
  }
};

/**
 * @description Check if row is expanded
 */
const isRowExpanded = (rowId: number) => {
  return expandedRows.value.has(rowId);
};

/**
 * @description Get primary shift (first shift) for main row display
 */
const getPrimaryShift = (shifts: IAttendanceShift[]) => {
  return shifts.length > 0 ? shifts[0] : null;
};

/**
 * @description Get additional shifts (excluding first) for expanded rows
 */
const getAdditionalShifts = (shifts: IAttendanceShift[]) => {
  return shifts.slice(1);
};
</script>

<template>
  <section id="attendance-list-table" class="flex flex-col gap-4 w-full">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-text-primary">Attendance Records</h2>
      <PrimeVueButton class="w-40" @click="handleCreate">
        <template #icon>
          <AppBaseSvg name="plus" class="!w-4 !h-4" />
        </template>
        Add Attendance
      </PrimeVueButton>
    </div>

    <!-- Custom Table -->
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <table class="w-full">
        <!-- Table Header -->
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              v-for="column in attendanceList_columns"
              :key="column.value"
              class="px-4 py-3 text-center text-sm font-medium text-gray-700"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="divide-y divide-gray-200">
          <template v-for="record in attendanceList_listData.items" :key="record.id">
            <!-- Main Row -->
            <tr class="hover:bg-gray-50">
              <!-- Date Column -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <!-- Collapse/Expand Button -->
                  <PrimeVueButton
                    v-if="record.shifts.length > 1"
                    variant="text"
                    size="small"
                    @click="toggleRowExpansion(record.id)"
                  >
                    <template #icon>
                      <AppBaseSvg
                        :name="isRowExpanded(record.id) ? 'chevron-down' : 'chevron-right'"
                        class="!w-4 !h-4"
                      />
                    </template>
                  </PrimeVueButton>

                  <!-- Date -->
                  <span class="font-normal text-sm text-text-primary">
                    {{ record.date }}
                  </span>
                </div>
              </td>

              <!-- Staff Name -->
              <td class="px-4 py-3">
                <span class="font-medium text-sm text-text-primary">
                  {{ record.staffName }}
                </span>
              </td>

              <!-- Primary Shift Data -->
              <template v-if="getPrimaryShift(record.shifts)">
                <!-- Shift -->
                <td class="px-4 py-3 text-center">
                  <span class="font-normal text-sm text-text-primary">
                    {{ getPrimaryShift(record.shifts)?.shiftStart }} -
                    {{ getPrimaryShift(record.shifts)?.shiftEnd }}
                  </span>
                </td>

                <!-- Clock In -->
                <td class="px-4 py-3 text-center">
                  <span
                    class="font-normal text-sm"
                    :class="getPrimaryShift(record.shifts)?.clockIn ? 'text-text-primary' : 'text-gray-400'"
                  >
                    {{ attendanceList_formatTime(getPrimaryShift(record.shifts)?.clockIn || null) }}
                  </span>
                </td>

                <!-- Clock Out -->
                <td class="px-4 py-3 text-center">
                  <span
                    class="font-normal text-sm"
                    :class="getPrimaryShift(record.shifts)?.clockOut ? 'text-text-primary' : 'text-gray-400'"
                  >
                    {{ attendanceList_formatTime(getPrimaryShift(record.shifts)?.clockOut || null) }}
                  </span>
                </td>

                <!-- Duration -->
                <td class="px-4 py-3 text-center">
                  <span class="font-medium text-sm text-text-primary">
                    {{ getPrimaryShift(record.shifts)?.duration }}
                  </span>
                </td>

                <!-- Early -->
                <td class="px-4 py-3 text-center">
                  <span
                    class="font-normal text-sm"
                    :class="attendanceList_getStatusColor(getPrimaryShift(record.shifts)?.early || '', 'early')"
                  >
                    {{ getPrimaryShift(record.shifts)?.early }}
                  </span>
                </td>

                <!-- Late -->
                <td class="px-4 py-3 text-center">
                  <span
                    class="font-normal text-sm"
                    :class="attendanceList_getStatusColor(getPrimaryShift(record.shifts)?.late || '', 'late')"
                  >
                    {{ getPrimaryShift(record.shifts)?.late }}
                  </span>
                </td>

                <!-- Overtime -->
                <td class="px-4 py-3 text-center">
                  <span
                    class="font-normal text-sm"
                    :class="
                      attendanceList_getStatusColor(getPrimaryShift(record.shifts)?.overtime || '', 'overtime')
                    "
                  >
                    {{ getPrimaryShift(record.shifts)?.overtime }}
                  </span>
                </td>
              </template>

              <!-- Action -->
              <td class="px-4 py-3">
                <div class="flex justify-center">
                  <PrimeVueButton
                    class="w-10 h-10"
                    variant="text"
                    rounded
                    aria-label="actions"
                    @click="toggleMainPopover($event, record.id)"
                  >
                    <template #icon>
                      <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
                    </template>
                  </PrimeVueButton>

                  <PrimeVuePopover
                    :ref="(el: Element | ComponentPublicInstance | null) => setPopoverRef(record.id, el)"
                    :pt="{
                      content: 'p-0',
                    }"
                  >
                    <section id="popover-content" class="flex flex-col">
                      <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="handleEdit(record.id)">
                        <template #default>
                          <section id="content" class="flex items-center gap-2 w-full">
                            <AppBaseSvg name="edit" class="!w-4 !h-4" />
                            <span class="font-normal text-sm text-text-primary">Edit</span>
                          </section>
                        </template>
                      </PrimeVueButton>

                      <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="handleDelete(record.id)">
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
              </td>
            </tr>

            <!-- Expanded Rows for Additional Shifts -->
            <template v-if="isRowExpanded(record.id) && getAdditionalShifts(record.shifts).length > 0">
              <tr
                v-for="shift in getAdditionalShifts(record.shifts)"
                :key="`${record.id}-${shift.id}`"
                class="bg-gray-50 border-l-4 border-blue-200"
              >
                <!-- Empty Date Column -->
                <td class="px-4 py-2 border-l-4 border-transparent"></td>

                <!-- Empty Staff Name Column -->
                <td class="px-4 py-2"></td>

                <!-- Shift -->
                <td class="px-4 py-2 text-center">
                  <span class="font-normal text-sm text-text-primary">
                    {{ shift.shiftStart }} - {{ shift.shiftEnd }}
                  </span>
                </td>

                <!-- Clock In -->
                <td class="px-4 py-2 text-center">
                  <span class="font-normal text-sm" :class="shift.clockIn ? 'text-text-primary' : 'text-gray-400'">
                    {{ attendanceList_formatTime(shift.clockIn) }}
                  </span>
                </td>

                <!-- Clock Out -->
                <td class="px-4 py-2 text-center">
                  <span
                    class="font-normal text-sm"
                    :class="shift.clockOut ? 'text-text-primary' : 'text-gray-400'"
                  >
                    {{ attendanceList_formatTime(shift.clockOut) }}
                  </span>
                </td>

                <!-- Duration -->
                <td class="px-4 py-2 text-center">
                  <span class="font-medium text-sm text-text-primary">
                    {{ shift.duration }}
                  </span>
                </td>

                <!-- Early -->
                <td class="px-4 py-2 text-center">
                  <span class="font-normal text-sm" :class="attendanceList_getStatusColor(shift.early, 'early')">
                    {{ shift.early }}
                  </span>
                </td>

                <!-- Late -->
                <td class="px-4 py-2 text-center">
                  <span class="font-normal text-sm" :class="attendanceList_getStatusColor(shift.late, 'late')">
                    {{ shift.late }}
                  </span>
                </td>

                <!-- Overtime -->
                <td class="px-4 py-2 text-center">
                  <span
                    class="font-normal text-sm"
                    :class="attendanceList_getStatusColor(shift.overtime, 'overtime')"
                  >
                    {{ shift.overtime }}
                  </span>
                </td>

                <!-- Action -->
                <td class="px-4 py-2 text-center">
                  <PrimeVueButton
                    class="w-10 h-10"
                    variant="text"
                    rounded
                    @click="toggleExpansionPopover($event, record.id, shift.id)"
                  >
                    <template #icon>
                      <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
                    </template>
                  </PrimeVueButton>

                  <PrimeVuePopover
                    :ref="
                      (el: Element | ComponentPublicInstance | null) =>
                        setExpansionPopoverRef(record.id, shift.id, el)
                    "
                    :pt="{
                      content: 'p-0',
                    }"
                  >
                    <section id="expansion-popover-content" class="flex flex-col">
                      <PrimeVueButton
                        class="w-full px-4 py-3"
                        variant="text"
                        @click="handleExpansionEdit(record.id, shift.id)"
                      >
                        <template #default>
                          <section id="content" class="flex items-center gap-2 w-full">
                            <AppBaseSvg name="edit" class="!w-3 !h-3" />
                            <span class="font-normal text-sm text-text-primary">Edit Shift</span>
                          </section>
                        </template>
                      </PrimeVueButton>

                      <PrimeVueButton
                        class="w-full px-4 py-3"
                        variant="text"
                        @click="handleExpansionDelete(record.id, shift.id)"
                      >
                        <template #default>
                          <section id="content" class="flex items-center gap-2 w-full">
                            <AppBaseSvg name="delete" class="!w-3 !h-3" />
                            <span class="font-normal text-sm text-text-primary">Delete Shift</span>
                          </section>
                        </template>
                      </PrimeVueButton>
                    </section>
                  </PrimeVuePopover>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </section>
</template>
