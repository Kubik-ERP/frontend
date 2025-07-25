<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
// Interfaces
import type {
  IAccountStoreTableConfigurationFormDataOfAddFloor,
  IAccountStoreTableConfigurationProvided,
} from '../../interfaces';
interface IProps {
  configuration: IAccountStoreTableConfigurationFormDataOfAddFloor;
}

// Interact.js
import interact from 'interactjs';

/**
 * @description Define props with default values and interfaces
 */
const props = withDefaults(defineProps<IProps>(), {
  configuration: () =>
    ({
      floorName: '',
      tables: [],
    }) as IAccountStoreTableConfigurationFormDataOfAddFloor,
});

/**
 * @description Inject all the data and methods what we need
 */
const {
  accountStoreTableConfiguration_onShowDialogAddTable,
  accountStoreTableConfiguration_onShowDialogEditFloor,
  accountStoreTableConfiguration_onShowDialogEditTable,
} = inject<IAccountStoreTableConfigurationProvided>('accountStoreTableConfiguration')!;

// 2. Gunakan onMounted untuk memastikan elemen DOM sudah ada sebelum interact.js dijalankan
onMounted(() => {
  const gridSnapSize = 20; // Ukuran grid untuk snapping

  interact('.table-item')
    .draggable({
      // Mengaktifkan snapping ke grid
      modifiers: [
        interact.modifiers.snap({
          targets: [interact.snappers.grid({ x: gridSnapSize, y: gridSnapSize })],
          range: Infinity,
          relativePoints: [{ x: 0, y: 0 }],
        }),
        // Membatasi pergerakan hanya di dalam parent element '#floor-plan-container'
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true,
        }),
      ],
      inertia: true,
      listeners: {
        // Pada setiap gerakan (drag), panggil fungsi dragMoveListener
        move: dragMoveListener,
      },
    })
    .resizable({
      // Tepi mana saja yang bisa di-resize
      edges: { left: true, right: true, bottom: true, top: true },
      // Mengaktifkan snapping ukuran ke grid
      modifiers: [
        interact.modifiers.snapSize({
          targets: [interact.snappers.grid({ width: gridSnapSize, height: gridSnapSize })],
          range: Infinity,
        }),
        // Membatasi resize hanya di dalam parent
        interact.modifiers.restrictSize({
          min: { width: 80, height: 80 }, // Ukuran minimum meja
          max: (_x, _y, interaction) => interaction!.element!.parentElement!.getBoundingClientRect(), // Ukuran maksimum adalah parent
        }),
      ],
      listeners: {
        move: resizeMoveListener,
      },
    });
});

/**
 * @description Menangani update posisi (x, y) saat meja digeser
 */
function dragMoveListener(event: InteractEvent) {
  const target = event.target as HTMLElement;
  const tableId = target.getAttribute('data-id');
  const table = props.configuration?.tables?.find(t => t.name === tableId);

  if (table) {
    // PENYESUAIAN: Bagi pergerakan mouse dengan level zoom saat ini
    table.positionX += event.dx / zoomLevel.value;
    table.positionY += event.dy / zoomLevel.value;
  }
}

/**
 * @description Menangani update ukuran (width, height) dan posisi saat meja di-resize
 */
function resizeMoveListener(event: any) {
  const target = event.target;
  const tableId = target.getAttribute('data-id');
  const table = props.configuration?.tables?.find(t => t.name === tableId);

  if (table) {
    // PENYESUAIAN: Bagi perubahan ukuran dan posisi dengan level zoom
    table.width = event.rect.width / zoomLevel.value;
    table.height = event.rect.height / zoomLevel.value;

    table.positionX += event.deltaRect.left / zoomLevel.value;
    table.positionY += event.deltaRect.top / zoomLevel.value;
  }
}

const zoomLevel = ref(1); // 1 = 100%
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5; // Batas zoom out 50%
const MAX_ZOOM = 1.5; // Batas zoom in 150%

/**
 * @description Menambah level zoom (Zoom In)
 */
function zoomIn() {
  if (zoomLevel.value < MAX_ZOOM) {
    // Membulatkan untuk menghindari masalah floating point
    zoomLevel.value = Math.round((zoomLevel.value + ZOOM_STEP) * 10) / 10;
  }
}

/**
 * @description Mengurangi level zoom (Zoom Out)
 */
function zoomOut() {
  if (zoomLevel.value > MIN_ZOOM) {
    // Membulatkan untuk menghindari masalah floating point
    zoomLevel.value = Math.round((zoomLevel.value - ZOOM_STEP) * 10) / 10;
  }
}
</script>

<template>
  <section id="table-configuration-layout" class="flex flex-col gap-6 border border-solid border-grayscale-10 p-4">
    <header class="flex items-center justify-between w-full">
      <section id="left-content" class="flex items-center gap-2">
        <h6 class="font-semibold text-black text-lg w-fit">
          {{ configuration.floorName }}
        </h6>

        <PrimeVueButton
          class="w-fit px-2 py-3"
          variant="text"
          @click="accountStoreTableConfiguration_onShowDialogEditFloor(configuration.floorName)"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2 w-full">
              <AppBaseSvg name="edit" />
              <span class="font-semibold text-sm text-primary">Edit Floor Name</span>
            </section>
          </template>
        </PrimeVueButton>
      </section>

      <PrimeVueButton
        class="bg-primary border-none w-fit px-5"
        @click="accountStoreTableConfiguration_onShowDialogAddTable(configuration)"
      >
        <template #default>
          <section class="flex items-center gap-2">
            <AppBaseSvg name="plus-line-white" />
            <span class="font-semibold text-base text-white">Add Table</span>
          </section>
        </template>
      </PrimeVueButton>
    </header>

    <section id="content" class="flex flex-col gap-2">
      <span class="font-normal text-black-secondary text-sm">
        Click and drag a table to move it around the floor plan.
      </span>

      <section
        :id="`${configuration.floorName}`"
        class="floor-plan-container relative w-full h-[500px] bg-dots touch-none inset-0 z-0"
        :style="{ transform: `scale(${zoomLevel})` }"
      >
        <section
          id="zoom-in-out"
          class="absolute right-5 top-5 bg-white flex items-center gap-3 rounded-lg button-shadow w-fit px-2 py-1"
        >
          <span class="font-medium text-sm text-grayscale-70"> Zoom </span>

          <div class="flex items-center gap-3">
            <AppBaseSvg name="zoom-in" class="cursor-pointer" @click="zoomIn" />

            <div id="divider" class="w-[0.5px] h-[18px] bg-grayscale-30">&nbsp;</div>

            <AppBaseSvg name="zoom-out" class="cursor-pointer" @click="zoomOut" />
          </div>
        </section>

        <div
          v-for="(table, tableIndex) in configuration.tables"
          :key="`table-${tableIndex}`"
          class="table-item flex flex-col items-center bg-white border-2 border-teal-400 pt-2 gap-1"
          :class="[
            table.shape === 'ROUND' ? 'rounded-full' : 'rounded-lg',
            table.isEnableQrCode ? 'has-qr-code' : '',
          ]"
          :data-id="table.name"
          :style="{
            transform: `translate(${table.positionX}px, ${table.positionY}px)`,
            width: `${table.width}px`,
            height: `${table.height}px`,
          }"
        >
          <AppBaseSvg
            name="edit"
            class="!w-4 !h-4 cursor-pointer"
            @click="accountStoreTableConfiguration_onShowDialogEditTable(table)"
          />
          <div class="font-bold text-sm text-secondary-hover">{{ table.name }}</div>
          <div class="text-sm text-secondary-hover pb-2">{{ table.seats }} seats</div>
        </div>
      </section>
    </section>
  </section>
</template>

<style>
/* Latar belakang titik-titik untuk container lantai */
.floor-plan-container {
  background-image: radial-gradient(#d1d5db 2px, transparent 2px);
  background-size: 20px 20px;
  border: 1px solid #8cc8eb;
  border-radius: 4px;
}

/* Styling dasar untuk setiap item meja */
.table-item {
  position: absolute; /* Penting untuk positioning */
  box-sizing: border-box; /* Agar border dan padding termasuk dalam width/height */
  user-select: none; /* Mencegah seleksi teks saat dragging */
  cursor: grab;
}

.table-item:active {
  cursor: grabbing;
}

/* Mengatur agar transisi saat resize lebih mulus (opsional) */
.table-item,
.table-item .text {
  transition: all 0.05s ease-in-out;
}

section#zoom-in-out {
  box-shadow: 0px 0px 10px 2px #00000026;
}
</style>
