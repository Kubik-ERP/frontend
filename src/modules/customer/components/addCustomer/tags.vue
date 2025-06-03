<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const selectedTags = ref([...props.modelValue]);

watch(selectedTags, val => {
  emit('update:modelValue', val);
});

const search = ref('');
const tags = ref([]);

onMounted(async () => {
  try {
    const response = await getTags();
    tags.value = response.data;
  } catch (error) {
    console.log(error);
  }
});

// const selectedTags = ref([]);
const isListBoxOpen = ref(false);
const filteredTags = ref([...tags.value]);

const closeListbox = () => {
  isListBoxOpen.value = false;
};

const filterTags = () => {
  // Filter out selected tags from the filtered list, based on the search input
  filteredTags.value = tags.value.filter(
    tag =>
      !selectedTags.value.some(selected => selected.name === tag.name) &&
      tag.name.toLowerCase().includes(search.value.toLowerCase()),
  );
};
const openListbox = () => {
  isListBoxOpen.value = true;
  filterTags(); // Make sure to filter when dropdown opens
};
const addTag = selectedTag => {
  if (!selectedTags.value.some(tag => tag.name === selectedTag.name)) {
    selectedTags.value.push(selectedTag);
  }
  search.value = '';
  closeListbox();
};

// Create a new tag from the search input
const createTag = () => {
  if (search.value && !selectedTags.value.some(tag => tag.name.toLowerCase() === search.value.toLowerCase())) {
    const newTag = { name: search.value };
    selectedTags.value.push(newTag);
    tags.value.push(newTag); // Add the new tag to the available list as well

    addTag(newTag);
  }
  search.value = '';
  closeListbox();
};

const removeTag = tagToRemove => {
  selectedTags.value = selectedTags.value.filter(tag => tag.name !== tagToRemove.name);

  // Avoid duplicate tags in the options list
  if (!tags.value.some(tag => tag.name === tagToRemove.name)) {
    tags.value.push(tagToRemove);
  }

  // Refilter the list after update
  filterTags();
};
</script>


<template>
  <div>
    <PrimeVueIconField>
      <PrimeVueInputText v-model="search" class="w-full" placeholder="Search or Create Tags" @focus="openListbox"
        @input="filterTags" />
      <PrimeVueInputIcon>
        <i class="pi pi-search" />
      </PrimeVueInputIcon>
    </PrimeVueIconField>

    <PrimeVueListbox v-if="isListBoxOpen" :options="filteredTags" option-label="name" class="w-full"
      list-style="max-height:250px">
      <template #option="slotProps">
        <div class="flex items-center w-full" @click="addTag(slotProps.option)">
          <div>{{ slotProps.option.name }}</div>
        </div>
      </template>

      <!-- Create New Tag Button if no matches are found -->
      <template #footer>
        <div v-if="search" class="mb-2">
          <PrimeVueButton
            class="bg-blue-secondary-background/50 text-blue-primary font-semibold text-lg justify-start border-none rounded-none text-start w-full"
            @click="createTag">+ Add "{{ search }}"</PrimeVueButton>
        </div>
      </template>
    </PrimeVueListbox>

    <div class="flex gap-2 mt-2 flex-wrap">
      <span v-for="tag in selectedTags" :key="tag"
        class="px-2 py-1 font-semibold bg-blue-secondary-background/50 rounded-full flex items-center justify-center gap-2">
        <p class="text-primary whitespace-nowrap">{{ tag.name }}</p>
        <button @click="removeTag(tag)">
          <i class="pi pi-times-circle text-sm cursor-pointer"></i>
        </button>
      </span>
    </div>
  </div>
</template>
