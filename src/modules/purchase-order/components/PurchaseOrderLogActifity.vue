<script setup lang="ts">
import { computed, inject } from 'vue';
import PrimeVueTimeline from 'primevue/timeline';
import type { IPurchaseOrderDetailProvided } from '../interfaces';

const { purchaseOrderDetail_data } = inject<IPurchaseOrderDetailProvided>('purchaseOrderDetail')!;

const events = computed(() => {
  const data = purchaseOrderDetail_data.value;
  if (!data) return [];

  const format = (date: string | null) => {
    if (!date) return null;
    const d = new Date(date);

    const tanggal = d
      .toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replaceAll('/', '-'); // jadi DD-MM-YYYY

    const waktu = d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return `${tanggal}, ${waktu}`;
  };
  const allEvents = [
    {
      status: 'Pending',
      date: format(data.createdAt ?? ''),
      icon: 'pi pi-clock',
      by: data.created?.fullname || '',
    },
    {
      status: 'Confirmed',
      date: format(data.confirmedAt ?? ''),
      icon: 'pi pi-check-circle',
      by: data.confirmed?.fullname || '',
    },
    {
      status: 'Shipped',
      date: format(data.shippedAt ?? ''),
      icon: 'pi pi-truck',
      by: data.shipped?.fullname || '',
    },
    {
      status: 'Received',
      date: format(data.receivedAt ?? ''),
      icon: 'pi pi-box',
      by: data.receiver?.fullname || '',
    },
    {
      status: 'Paid',
      date: format(data.paidAt ?? ''),
      icon: 'pi pi-dollar',
      by: data.paid?.fullname || '',
    },
    {
      status: 'Cancelled',
      date: format(data.cancelledAt ?? ''),
      icon: 'pi pi-times-circle',
      by: data.cancelled?.fullname || '',
    },
  ];

  const completed = allEvents.filter(e => e.date !== null);
  if (completed.length < allEvents.length) {
    completed.push({
      ...allEvents[completed.length],
      date: 'Not yet started',
    });
  }
  return completed;
});
</script>

<template>
  <section
    id="purchase-order-log-activity"
    class="border border-solid border-primary/30 flex flex-col gap-6 p-6 rounded-2xl bg-white shadow-sm"
  >
    <h6 class="font-semibold text-lg text-primary flex items-center gap-2">
      <i class="pi pi-history text-primary text-base"></i>
      Activity Log
    </h6>

    <div class="relative overflow-x-auto">
      <PrimeVueTimeline :value="events" layout="horizontal" align="top" class="perfect-timeline w-full">
        <!-- Marker -->
        <template #marker="slotProps">
          <span
            class="timeline-marker flex items-center justify-center w-10 h-10 rounded-full bg-primary shadow-md border-2 border-white relative z-10"
          >
            <i :class="slotProps.item.icon" class="text-white text-base"></i>
          </span>
        </template>

        <!-- Content -->
        <template #content="slotProps">
          <div class="flex flex-col items-center text-center mt-10 w-40">
            <p class="font-normal text-sm text-gray-600 mb-1">By {{ slotProps.item.by }}</p>
            <p class="font-semibold text-sm text-gray-800">{{ slotProps.item.status }}</p>
          </div>
        </template>

        <!-- Opposite (Date) -->
        <template #opposite="slotProps">
          <small
            class="block text-xs text-gray-500"
            :class="{ 'italic opacity-60': slotProps.item.date === 'Not yet started' }"
          >
            {{ slotProps.item.date }}
          </small>
        </template>
      </PrimeVueTimeline>

      <!-- Custom line sejajar marker -->
      <!-- <div class="absolute left-0 right-0 top-[34px] h-[3px] bg-gray-200 rounded-full z-0"></div> -->
    </div>
  </section>
</template>

<style scoped>
.perfect-timeline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  padding-top: 1rem;
  padding-bottom: 2rem;
}

/* Hilangkan semua garis default PrimeVue */
.perfect-timeline .p-timeline-event-connector,
.perfect-timeline::before {
  display: none !important;
}

/* Tiap event sejajar */
.perfect-timeline .p-timeline-event {
  flex: 1;
  text-align: center;
  position: relative;
}
</style>
