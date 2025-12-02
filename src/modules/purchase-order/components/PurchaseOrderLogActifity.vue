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
      .replaceAll('/', '-');

    const waktu = d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return `${tanggal}, ${waktu} WIB`;
  };

  const baseEvents = [
    { status: 'Pending', date: format(data.createdAt ?? ''), icon: 'pi pi-clock', by: data.created?.fullname || '' },
    { status: 'Confirmed', date: format(data.confirmedAt ?? ''), icon: 'pi pi-check-circle', by: data.confirmed?.fullname || '' },
    { status: 'Shipped', date: format(data.shippedAt ?? ''), icon: 'pi pi-truck', by: data.shipped?.fullname || '' },
    { status: 'Received', date: format(data.receivedAt ?? ''), icon: 'pi pi-box', by: data.receiver?.fullname || '' },
    { status: 'Paid', date: format(data.paidAt ?? ''), icon: 'pi pi-dollar', by: data.paid?.fullname || '' },
    { status: 'Cancelled', date: format(data.cancelledAt ?? ''), icon: 'pi pi-times-circle', by: data.cancelled?.fullname || '' },
  ];

  const isCancelled = !!data.cancelledAt;

  if (isCancelled) {
    return baseEvents.filter(e => ['Pending', 'Cancelled'].includes(e.status) && e.date);
  }

  const filtered = baseEvents.filter(e => e.status !== 'Cancelled');

  const completed = filtered.filter(e => e.date !== null);

  if (completed.length < filtered.length) {
    const nextEvent = filtered[completed.length];
    completed.push({ ...nextEvent, date: 'Not yet started' });
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

    <div class="relative">
      <PrimeVueTimeline
        :value="events"
        layout="vertical"
        class="alternating-timeline"
        align="alternate"
      >
        <!-- Marker -->
        <template #marker="slotProps">
          <span
            class="timeline-marker flex items-center justify-center w-10 h-10 rounded-full bg-primary shadow-md border-2 border-white"
          >
            <i :class="slotProps.item.icon" class="text-white text-base"></i>
          </span>
        </template>

        <!-- Opposite (Date) -->
        <template #opposite="slotProps">
          <small
            class="date-text block text-xs text-gray-500 mb-1 mt-5 mx-10"
            :class="{ 'italic opacity-60': slotProps.item.date === 'Not yet started' }"
          >
            {{ slotProps.item.date }}
          </small>
        </template>

        <!-- Content -->
        <template #content="slotProps">
          <div class="content-box flex flex-col gap-1 p-3 mx-10 rounded-lg bg-gray-50 shadow-sm border border-gray-200">
            <p class="font-semibold text-sm text-gray-800">{{ slotProps.item.status }}</p>
            <p class="font-normal text-xs text-gray-600">By {{ slotProps.item.by }}</p>
          </div>
        </template>
      </PrimeVueTimeline>
    </div>
  </section>
</template>

<style scoped>
/* Garis Tengah */
.alternating-timeline {
  position: relative;
  padding: 0 2rem;
}

.alternating-timeline::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: rgba(0, 0, 0, 0.15);
  transform: translateX(-50%);
}

/* Sembunyikan garis PrimeVue default */
.alternating-timeline .p-timeline-event-connector {
  display: none !important;
}

/* Struktur Event */
.alternating-timeline .p-timeline-event-wrapper {
  position: relative;
  display: flex;
  min-height: 100px;
}

/* Marker ditengah */
.timeline-marker {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

/* =============================
   ALTERNATING FIX FINAL
   ============================= */

/* GANJIL → KANAN (Status) */
.alternating-timeline .p-timeline-event-wrapper:nth-of-type(odd) .p-timeline-event-opposite {
  order: 1;
  width: 50%;
  padding-right: 1rem;
  text-align: right;
}

.alternating-timeline .p-timeline-event-wrapper:nth-of-type(odd) .p-timeline-event-content {
  order: 2;
  width: 50%;
  padding-left: 1rem;
  text-align: left;
}

/* GENAP → KIRI (Status) */
.alternating-timeline .p-timeline-event-wrapper:nth-of-type(even) .p-timeline-event-opposite {
  order: 2;
  width: 50%;
  padding-left: 1rem;
  text-align: left;
}

.alternating-timeline .p-timeline-event-wrapper:nth-of-type(even) .p-timeline-event-content {
  order: 1;
  width: 50%;
  padding-right: 1rem;
  text-align: right;
}
</style>
