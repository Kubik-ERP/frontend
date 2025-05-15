export const useIsMobile = () => {
  return window.innerWidth <= 768;
};

export const useIsTablet = () => {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

export const useIsDesktop = () => {
  return window.innerWidth > 1024;
};
