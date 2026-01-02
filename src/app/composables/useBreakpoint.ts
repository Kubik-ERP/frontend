import { ref } from 'vue';

const windowWidth = ref(window.innerWidth);

const onResize = () => {
  windowWidth.value = window.innerWidth;
};

window.addEventListener('resize', onResize);

export const useIsMobile = () => {
  return windowWidth.value <= 768;
};

export const useIsTablet = () => {
  return windowWidth.value > 768 && windowWidth.value <= 1024;
};

export const useIsDesktop = () => {
  return windowWidth.value > 1024;
};
