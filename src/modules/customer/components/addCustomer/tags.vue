<script setup>
import { useCustomerService } from '../../services/CustomersService';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const { getCustomerTags } = useCustomerService();

const emit = defineEmits(['update:modelValue']);

const selectedTags = ref([...props.modelValue]);

const search = ref('');
const tags = ref([]);

onMounted(async () => {
  try {
    const response = await getCustomerTags();
    tags.value = response;
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
// const openListbox = () => {
//   isListBoxOpen.value = true;
//   filterTags(); // Make sure to filter when dropdown opens
// };
const addTag = selectedTag => {
  if (!selectedTags.value.some(tag => tag.name === selectedTag.name)) {
    selectedTags.value.push(selectedTag);
  }
  search.value = '';
  filterTags();
  closeListbox();
  emit('update:modelValue', selectedTags.value);
};

// Create a new tag from the search input
const createTag = () => {
  if (search.value && !selectedTags.value.some(tag => tag.name.toLowerCase() === search.value.toLowerCase())) {
    const newTag = { name: search.value };
    selectedTags.value.push(newTag);
    tags.value.push(newTag); // Add the new tag to the available list as well

    addTag(newTag);
    filterTags();
    emit('update:modelValue', selectedTags.value);
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
  emit('update:modelValue', selectedTags.value);
  // Refilter the list after update
  filterTags();
};
</script>

<template>
  <div>
    <form @submit.prevent="createTag">
      <PrimeVueInputText
        v-model="search"
        name="name"
        type="text"
        :class="{ ...classes }"
        class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full"
        fluid
      />
    </form>

    <div class="flex gap-2 mt-2 flex-wrap">
      <span
        v-for="tag in selectedTags"
        :key="tag"
        class="px-2 py-1 font-semibold bg-blue-secondary-background/50 rounded-full flex items-center justify-center gap-2"
      >
        <p class="text-primary whitespace-nowrap">{{ tag.name }}</p>
        <button @click="removeTag(tag)">
          <i class="pi pi-times-circle text-sm cursor-pointer"></i>
        </button>
      </span>
    </div>
  </div>
</template>
