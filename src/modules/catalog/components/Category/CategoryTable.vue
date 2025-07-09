<script setup lang="ts">
import { useCategoryService } from '../../services/Category/CategoryService';
import { ICategory } from '../../interfaces/Category/CategoryInterface';
//import { ICategory } from '@/modules/catalog/interfaces/Category/CategoryInterface';
import deletePolygonSVG from '@/app/assets/icons/delete-polygon.svg';
import deleteSVG from '@/app/assets/icons/delete.svg';
import editSVG from '@/app/assets/icons/edit.svg';
import plusLineWhiteSVG from '@/app/assets/icons/plus-line-white.svg';
import threeDotsSVG from '@/app/assets/icons/three-dots.svg';
import searchSVG from '@/app/assets/icons/search.svg';
import chevronLeftSVG from '@/app/assets/icons/chevron-left.svg';
import chevronRightSVG from '@/app/assets/icons/chevron-right.svg';
import imageSVG from '@/app/assets/icons/image.svg';

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryByID,
  category_formData,
  category_formValidations,
} = useCategoryService();

const isAddOpen = ref(false);
const isEditOpen = ref(false);
const isDeleteOpen = ref(false);
const selectedCategories = ref<ICategory[]>([]);
const categories = ref<ICategory[]>([]);
const selected = ref<ICategory>();
const loading = ref(false);

const route = useRoute();
const router = useRouter();

const page = ref<number>(1);
const limit = ref<number>(10);
const search = ref<string>('');
const lastPage = ref<number>(0);

// const category = ref('');
// const description = ref('');
const op = ref();

const fileInput = ref();
const triggerFileInput = () => {
  (fileInput.value as HTMLInputElement)?.click();
};

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    category_formData.imageFile = file; // ✅ Save the file

    const reader = new FileReader();
    reader.onload = () => {
      category_formData.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const loadCategories = async () => {
  loading.value = true;
  try {
    const response = await getAllCategories(page.value, limit.value, search.value);
    categories.value = response.categories;
    // console.log('🚀 ~ loadCategories ~ categories.value:', categories.value);
    lastPage.value = response.lastPage;
    // console.log('🚀 ~ loadCategories ~ lastPage.value:', lastPage.value);
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  } finally {
    loading.value = false;
  }
};

const loadCategoryByID = async (id: string) => {
  try {
    const response = await getCategoryByID(id);
    category_formData.name = response.category;
    category_formData.description = response.description ?? '-';
    category_formData.imagePreview = response.pictureUrl;
  } catch (error) {
    console.error('Failed to load category by ID:', error);
  }
};
function resetForm() {
  category_formData.name = '';
  category_formData.description = '';
  category_formData.imageFile = undefined;
  category_formData.imagePreview = undefined;
  category_formValidations.value.$reset();
}
const handleAddCategory = async () => {
  category_formValidations.value.$touch();
  if (category_formValidations.value.$invalid) return;
  try {
    const newCategory = await createCategory({
      category: category_formData.name,
      description: category_formData.description || '-',
      imageFile: category_formData.imageFile,
    });

    loadCategories();
    isAddOpen.value = false;
    category_formData.name = '';
    category_formData.description = '';
    if (newCategory.statusCode === 500) {
      alert(`${newCategory.message}`);
    }
    resetForm();
  } catch (error) {
    console.error('Failed to create category:', error);
    console.error(error);
    alert('Something went wrong while creating the category.');
  }
};
const openAddDialog = () => {
  isAddOpen.value = true;
  category_formData.name = '';
  category_formData.description = '';
};

const displayPopover = (event: Event, category: ICategory) => {
  selected.value = category;
  op.value?.show(event);
};

const displayEdit = (id: string) => {
  if (selected.value) {
    // console.log("🚀 ~ displayEdit ~ selected.value:", selected.value.id)
    loadCategoryByID(id);
    isEditOpen.value = true;
    op.value?.hide();
  }
};

const handleEditCategory = async () => {
  category_formValidations.value.$touch();
  if (category_formValidations.value.$invalid) return;
  if (selected.value) {
    try {
      const updatedCategory = await updateCategory(selected.value.id, {
        category: category_formData.name,
        description: category_formData.description || '-',
        imageFile: category_formData.imageFile,
      });
      categories.value = categories.value.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat));
      isEditOpen.value = false;
      resetForm();
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('Something went wrong while updating the category.');
    }
  }
};

const handleDeleteCategory = async (id: string) => {
  try {
    if (selected.value) {
      const deleteCat = await deleteCategory(selected.value.id);
      if (deleteCat === 200) {
        // alert('Category deleted successfully.');
        categories.value = categories.value.filter(cat => cat.id !== id);
      } else {
        alert('Something went wrong while deleting the category.');
      }
    }
  } catch (error) {
    console.error('Failed to delete category:', error);
  }

  isDeleteOpen.value = false;
};

const visiblePages = computed(() => {
  const range = 5;
  const start = Math.max(1, Math.min(page.value - 2, lastPage.value - range + 1));
  const end = Math.min(lastPage.value, start + range - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const handleSearch = () => {
  router.push({ query: { page: '1' } });
  page.value = 1;
  loadCategories();
};

function goToPage(p: number) {
  router.push({ query: { page: p.toString() } });
  page.value = p;
  loadCategories();
}

const nextPage = () => {
  if (page.value < lastPage.value) {
    page.value = page.value + 1;
    router.push({ query: { page: page.value.toString() } });
    loadCategories();
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value = page.value - 1;
    router.push({ query: { page: page.value.toString() } });
    loadCategories();
  }
};

onMounted(() => {
  loadCategories();
  const pageParam = route.query.page;
  if (typeof pageParam === 'string') {
    page.value = parseInt(pageParam) || 1;
  } else {
    page.value = 1;
  }
  if (!route.query.page) {
    router.push({ query: { page: '1' } });
  }
});
</script>

<template>
  <div class="m-4 p-1 border border-gray-200 rounded-lg shadow-2xl">
    <!-- <AppBaseDataTable
    header-title="Categories"
    :columns="category_columns"
    :data="categories"
    :is-loading="loading"
    is-using-custom-filter
    
    >
  </AppBaseDataTable> -->

    <PrimeVueDataTable
      :selection="selectedCategories"
      :value="categories"
      paginator
      :rows="limit"
      table-style="min-width: 50rem"
      data-key="id"
    >
      <template #header>
        <div class="flex justify-between">
          <h1 class="text-2xl font-bold">{{ useLocalization('main.title') }}</h1>
          <div class="flex gap-4">
            <form @submit.prevent="handleSearch">
              <PrimeVueIconField>
                <PrimeVueInputIcon><img :src="searchSVG" alt="" /></PrimeVueInputIcon>
                <PrimeVueInputText
                  v-model="search"
                  :placeholder="useLocalization('main.searchPlaceholder')"
                  @input="handleSearch"
                />
              </PrimeVueIconField>
            </form>
            <PrimeVueButton
              type="button"
              severity="info"
              :label="useLocalization('main.addButton')"
              class="bg-primary border-primary"
              @click="openAddDialog()"
            >
              <template #icon>
                <img :src="plusLineWhiteSVG" alt="" />
              </template>
            </PrimeVueButton>
          </div>
        </div>
      </template>

      <template #empty>No categories found.</template>

      <PrimeVueColumn class="w-1/2">
        <template #header>
          <span class="flex justify-center">{{ useLocalization('main.table.headerCategory') }}</span>
        </template>
        <template #body="slotProps">
          <template v-if="loading">
            <PrimeVueSkeleton height="1.5rem" />
          </template>
          <template v-else>
            {{ slotProps.data.category }}
          </template>
        </template>
      </PrimeVueColumn>

      <PrimeVueColumn class="w-1/2">
        <template #header>
          <span class="flex justify-center">{{ useLocalization('main.table.headerDescription') }}</span>
        </template>
        <template #body="slotProps">
          <template v-if="loading">
            <PrimeVueSkeleton height="1.5rem" />
          </template>
          <template v-else>
            {{ slotProps.data.description }}
          </template>
        </template>
      </PrimeVueColumn>

      <PrimeVueColumn>
        <template #body="slotProps">
          <PrimeVueButton
            class="bg-transparent text-gray-500 border-none float-end"
            @click="displayPopover($event, slotProps.data)"
          >
            <template #icon>
              <img :src="threeDotsSVG" alt="" />
            </template>
          </PrimeVueButton>
        </template>
      </PrimeVueColumn>

      <template #paginatorcontainer="{}">
        <div class="flex items-center gap-2 justify-between w-full py-2">
          <!-- Previous Page Button -->
          <PrimeVueButton
            variant="text"
            :label="useLocalization('main.pagination.previous')"
            class="border border-primary text-primary hover:bg-transparent"
            @click="prevPage()"
          >
            <template #icon>
              <img :src="chevronLeftSVG" alt="" />
            </template>
          </PrimeVueButton>

          <div class="flex gap-1">
            <PrimeVueButton
              v-for="p in visiblePages"
              :key="p"
              :label="p.toString()"
              class="border-none aspect-square p-4"
              :class="
                page === p ? 'bg-blue-secondary-background text-primary' : 'bg-transparent text-grayscale-20'
              "
              @click="goToPage(p)"
            />
          </div>
          <!-- Page Numbers -->

          <!-- Next Page Button -->
          <PrimeVueButton
            variant="text"
            :label="useLocalization('main.pagination.next')"
            class="border border-primary text-primary hover:bg-transparent flex-row-reverse"
            @click="nextPage()"
          >
            <template #icon>
              <img :src="chevronRightSVG" alt="" />
            </template>
          </PrimeVueButton>
        </div>
      </template>
    </PrimeVueDataTable>

    <!-- Popover -->
    <PrimeVuePopover ref="op">
      <div class="flex flex-col items-start">
        <PrimeVueButton
          variant="text"
          :label="useLocalization('popover.edit')"
          class="text-black"
          @click="selected && displayEdit(selected.id)"
        >
          <template #icon>
            <img :src="editSVG" alt="" />
          </template>
        </PrimeVueButton>
        <PrimeVueButton variant="text" :label="useLocalization('popover.delete')" class="text-red-500" @click="isDeleteOpen = true">
          <template #icon>
            <img :src="deleteSVG" alt="" />
          </template>
        </PrimeVueButton>
      </div>
    </PrimeVuePopover>

    <!-- Add Dialog -->
    <PrimeVueDialog v-model:visible="isAddOpen" modal :header="useLocalization('modal.title.add')" class="w-[45rem]" @hide="resetForm()">
      <form @submit.prevent="handleAddCategory">
        <div class="flex items-center flex-col">
          <p>{{useLocalization('modal.photoLabel')}}</p>
          <img
            class="rounded-lg mt-2 w-64 h-64 object-cover"
            :src="category_formData.imagePreview || 'https://placehold.co/250'"
            alt="Photo"
          />

          <!-- Hidden File Input -->
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />

          <!-- PrimeVue Button as file selector -->
          <PrimeVueButton
            :label="useLocalization('modal.selectImageButton')"
            class="mt-4 shadow-xs hover:bg-transparent rounded-xl px-8 py-2 text-primary border-primary border-2"
            variant="outlined"
            @click="triggerFileInput"
          >
            <template #icon>
              <img :src="imageSVG" alt="" />
            </template>
          </PrimeVueButton>
        </div>
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          :name="useLocalization('modal.nameLabel')"
          :validators="category_formValidations.name"
        >
          <PrimeVueInputText
            v-model="category_formData.name"
            name="name"
            type="text"
            class="w-full"
            :class="{ ...classes }"
            fluid
            v-on="useListenerForm(category_formValidations, 'name')"
          />
        </AppBaseFormGroup>
        <div class="mb-8">
          <label for="description">{{useLocalization('modal.notes.label')}} <span class="text-gray-300">{{ useLocalization('modal.notes.optional') }}</span></label>
          <PrimeVueTextarea v-model="category_formData.description" auto-resize rows="5" class="w-full" />
        </div>
        <div class="flex justify-end gap-2">
          <PrimeVueButton
            :label="useLocalization('modal.cancelButton')"
            severity="info"
            variant="outlined"
            class="w-48"
            @click="
              isAddOpen = false;
              resetForm();
            "
          />
          <PrimeVueButton
            :label="useLocalization('modal.addButton')"
            class="w-48 bg-primary border-primary"
            type="submit"
            :disabled="category_formValidations.$invalid"
          />
        </div>
      </form>
    </PrimeVueDialog>

    <!-- Edit Dialog -->
    <PrimeVueDialog
      v-model:visible="isEditOpen"
      modal
      :header="useLocalization('modal.title.edit')"
      class="w-[45rem]"
      @hide="resetForm()"
    >
      <form @submit.prevent="handleEditCategory">
        <div class="flex items-center flex-col">
          <p>{{useLocalization('modal.photoLabel')}}</p>
          <img
            class="rounded-lg mt-2 w-64 h-64 object-cover"
            :src="category_formData.imagePreview || 'https://placehold.co/250'"
            alt="Photo"
          />

          <!-- Hidden File Input -->
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />

          <!-- PrimeVue Button as file selector -->
          <PrimeVueButton
            :label="useLocalization('modal.selectImageButton')"
            class="mt-4 shadow-xs hover:bg-transparent rounded-xl px-8 py-2 text-primary border-primary border-2"
            variant="outlined"
            @click="triggerFileInput"
          >
            <template #icon>
              <img :src="imageSVG" alt="" />
            </template>
          </PrimeVueButton>
        </div>
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          :name="useLocalization('modal.nameLabel')"
          :validators="category_formValidations.name"
        >
          <PrimeVueInputText
            v-model="category_formData.name"
            name="name"
            type="text"
            class="w-full"
            :class="{ ...classes }"
            fluid
            v-on="useListenerForm(category_formValidations, 'name')"
          />
        </AppBaseFormGroup>
        <div class="mb-8">
          <label for="description">{{useLocalization('modal.notes.label')}} <span class="text-gray-300">{{ useLocalization('modal.notes.optional') }}</span></label>
          <PrimeVueTextarea v-model="category_formData.description" auto-resize rows="5" class="w-full" />
        </div>
        <div class="flex justify-end gap-2">
          <PrimeVueButton
            :label="useLocalization('modal.cancelButton')"
            severity="info"
            variant="outlined"
            class="w-48"
            @click="
              isAddOpen = false;
              resetForm();
            "
          />
          <PrimeVueButton
            :label="useLocalization('modal.editButton')"
            class="w-48 bg-primary border-primary"
            type="submit"
            :disabled="category_formValidations.$invalid"
          />
        </div>
      </form>
    </PrimeVueDialog>

    <!-- Delete Confirmation -->
    <PrimeVueDialog :visible="isDeleteOpen" modal header="" @hide="resetForm()">
      <template #container>
        <div class="w-[35rem] p-8 text-center">
          <img :src="deletePolygonSVG" alt="Delete icon" class="mx-auto mb-8" />
          <h1 class="text-2xl font-semibold mb-2">{{ useLocalization('modal.delete.title') }}</h1>
          <p class="mb-6">{{ useLocalization('modal.delete.description') }}</p>
          <div class="flex justify-center gap-4">
            <PrimeVueButton
              :label="useLocalization('modal.deleteButton')"
              class="w-40 text-red-500 bg-transparent border-none"
              @click="selected && handleDeleteCategory(selected.id)"
            />
            <PrimeVueButton :label="useLocalization('modal.cancelButton')" class="w-40 bg-primary border-primary" @click="isDeleteOpen = false" />
          </div>
        </div>
      </template>
    </PrimeVueDialog>
  </div>
</template>
