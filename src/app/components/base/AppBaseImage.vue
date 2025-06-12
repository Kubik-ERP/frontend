<script setup lang="ts">
/**
 * @description Define the props interface
 */
interface IProps {
  src: string;
  alt: string;
}

/**
 * @description Explicitly disable auto-inheritance of attributes to root node
 */
defineOptions({ inheritAttrs: false });

/**
 * @description Define props and interfaces
 */
const { src, alt } = defineProps<IProps>();

/**
 * @description Get non-prop attributes
 */
const attrs = useAttrs();

/**
 * @description Reactive variable to hold the image source
 */
const imageSrc = ref(src);

/**
 * @description URL for the empty image to use when the original image fails to load
 */
const emptyImage = new URL('@/app/assets/images/empty-image.jpg', import.meta.url).href;

/**
 * @description Watch for changes in the src prop and update imageSrc accordingly
 */
watch(
  () => src,
  newVal => {
    if (newVal === '' || newVal === null || newVal === undefined) {
      onImageError();
    } else {
      imageSrc.value = newVal;
    }
  },
  { immediate: true },
);

/**
 * @description Handle image error
 */
function onImageError() {
  imageSrc.value = emptyImage;
}
</script>

<template>
  <img v-bind="attrs" :src="imageSrc" :alt="alt" @error="onImageError" />
</template>
