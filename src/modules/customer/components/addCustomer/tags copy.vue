<script setup>
import { ref } from 'vue';

const search = ref('');
const tags = ref([
  { name: 'Member' },
  { name: 'VIP' },
  { name: 'Super VIP' },
  { name: 'Customer' }
]);
const selectedTags = ref([]);
const isListBoxOpen = ref(false);
const filteredTags = ref([...tags.value]);

const openListbox = () => {
  isListBoxOpen.value = true;
};

const closeListbox = () => {
  isListBoxOpen.value = false;
};

const filterTags = () => {
  filteredTags.value = tags.value.filter(tag =>
    tag.name.toLowerCase().includes(search.value.toLowerCase())
  );
};

const addTag = (selectedTag) => {
  if (!selectedTags.value.some(tag => tag.name === selectedTag.name)) {
    selectedTags.value.push(selectedTag);
    tags.value = tags.value.filter(tag => tag.name !== selectedTag.name);
    filterTags(); // Refresh filtered list after tag removed
  }
  search.value = '';
  closeListbox();
};
</script>

<template>
  <div>
    <PrimeVueIconField>
      <PrimeVueInputText
        v-model="search"
        class="w-full"
        placeholder="Search or Create Tags"
        @focus="openListbox"
        @input="filterTags"
      />
      <PrimeVueInputIcon>
        <i class="pi pi-search" />
      </PrimeVueInputIcon>
    </PrimeVueIconField>

    <PrimeVueListbox
      v-if="isListBoxOpen"
      :options="filteredTags"
      option-label="name"
      class="w-full md:w-56"
      list-style="max-height:250px"
    >
      <template #option="slotProps">
        <div class="flex items-center w-full" @click="addTag(slotProps.option)">
          <div>{{ slotProps.option.name }}</div>
        </div>
      </template>
    </PrimeVueListbox>

    {{ selectedTags }}
  </div>
</template>
