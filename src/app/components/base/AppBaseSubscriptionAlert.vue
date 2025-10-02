<script setup lang="ts">
// Stores
import { useAuthenticationStore } from '@/modules/authentication/store';

// Constants
import { APP_BASE_URL_RENEW_SUBSCRIPTION } from '@/app/constants';
const ALERT_THRESHOLD_DAYS = 7; // Show alert when 7 days or less remaining

/**
 * @description Injected variables
 */
const authenticationStore = useAuthenticationStore();
const { authentication_userData } = storeToRefs(authenticationStore);

/**
 * @description Reactive data
 */
const isAlertVisible = ref<boolean>(true);

/**
 * @description Computed values
 */
const subscriptionData = computed(() => {
  console.log('authentication_userData:', authentication_userData.value);

  if (!authentication_userData.value?.subExpiredAt) {
    console.log('No subExpiredAt found in authentication_userData');
    return null;
  }

  const expiryDate = new Date(authentication_userData.value.subExpiredAt);
  const currentDate = new Date();
  const daysRemaining = Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  // Get locale with fallback
  let locale = 'en-US';
  try {
    const currentLocale = useLocalization('app.current-locale');
    locale = currentLocale === 'id' ? 'id-ID' : 'en-US';
  } catch {
    console.warn('Could not get locale, using en-US as fallback');
  }

  // Format date with fallback
  let formattedExpiryDate = '';
  try {
    formattedExpiryDate = expiryDate.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    // Fallback to simple format
    formattedExpiryDate = expiryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Additional fallback if still empty
  if (!formattedExpiryDate) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    formattedExpiryDate = new Intl.DateTimeFormat('en-US', options).format(expiryDate);
  }

  // Final fallback to basic string
  if (!formattedExpiryDate) {
    const month = expiryDate.toLocaleString('en-US', { month: 'long' });
    const day = expiryDate.getDate();
    const year = expiryDate.getFullYear();
    formattedExpiryDate = `${month} ${day}, ${year}`;
  }

  console.log('Debug Subscription Data:', {
    subExpiredAt: authentication_userData.value.subExpiredAt,
    expiryDate: expiryDate.toString(),
    currentDate: currentDate.toString(),
    daysRemaining: daysRemaining,
    ALERT_THRESHOLD_DAYS: ALERT_THRESHOLD_DAYS,
    shouldShowAlert: daysRemaining <= ALERT_THRESHOLD_DAYS && daysRemaining > 0,
    locale: locale,
    formattedExpiryDate: formattedExpiryDate
  });

  return {
    expiryDate,
    daysRemaining,
    shouldShowAlert: daysRemaining <= ALERT_THRESHOLD_DAYS && daysRemaining > 0,
    formattedExpiryDate,
  };
});

/**
 * @description Show alert when conditions are met
 */
const shouldShowSubscriptionAlert = computed(() => {
  const result = subscriptionData.value?.shouldShowAlert && isAlertVisible.value;
  console.log('shouldShowSubscriptionAlert Debug:', {
    subscriptionDataExists: !!subscriptionData.value,
    shouldShowAlert: subscriptionData.value?.shouldShowAlert,
    isAlertVisible: isAlertVisible.value,
    finalResult: result
  });
  return result;
});

/**
 * @description Handle closing alert
 */
const handleCloseAlert = (): void => {
  isAlertVisible.value = false;
};

/**
 * @description Handle renew action
 */
const handleRenewNow = (): void => {
  window.open(APP_BASE_URL_RENEW_SUBSCRIPTION, '_blank');
};

/**
 * @description Get severity level based on days remaining
 */
const messageSeverity = computed(() => {
  if (!subscriptionData.value) return 'warn';

  const daysRemaining = subscriptionData.value.daysRemaining;

  if (daysRemaining <= 7) return 'error';
  if (daysRemaining <= 14) return 'warn';
  return 'info';
});

/**
 * @description Get status text for badge
 */
const statusText = computed(() => {
  if (!subscriptionData.value) return '';

  const daysRemaining = subscriptionData.value.daysRemaining;

  if (daysRemaining <= 1) return useLocalization('app.subscription-alert.expires-today');
  if (daysRemaining <= 3) return useLocalization('app.subscription-alert.expires-soon');
  if (daysRemaining <= 7) return useLocalization('app.subscription-alert.expires-this-week');
  return useLocalization('app.subscription-alert.renewal-reminder');
});

/**
 * @description Get icon text based on severity
 */
const iconText = computed(() => {
  if (messageSeverity.value === 'error') return '⚠';
  if (messageSeverity.value === 'warn') return '⏰';
  return 'ℹ';
});

/**
 * @description Dynamic alert container classes
 */
const alertClasses = computed(() => {
  const base = 'border-l-4 bg-white shadow-lg border border-gray-200';

  if (messageSeverity.value === 'error') {
    return `${base} border-l-red-500`;
  }
  if (messageSeverity.value === 'warn') {
    return `${base} border-l-amber-500`;
  }
  return `${base} border-l-blue-500`;
});/**
 * @description Dynamic icon classes
 */
const iconClasses = computed(() => {
  if (messageSeverity.value === 'error') {
    return 'bg-gradient-to-br from-red-500 to-red-600';
  }
  if (messageSeverity.value === 'warn') {
    return 'bg-gradient-to-br from-amber-500 to-amber-600';
  }
  return 'bg-gradient-to-br from-blue-500 to-blue-600';
});

/**
 * @description Dynamic badge classes
 */
const badgeClasses = computed(() => {
  if (messageSeverity.value === 'error') {
    return 'bg-red-100 text-red-800';
  }
  if (messageSeverity.value === 'warn') {
    return 'bg-amber-100 text-amber-800';
  }
  return 'bg-blue-100 text-blue-800';
});

/**
 * @description Dynamic button classes
 */
const buttonClasses = computed(() => {
  const base = 'text-white shadow-lg focus:ring-4';

  if (messageSeverity.value === 'error') {
    return `${base} bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-500`;
  }
  if (messageSeverity.value === 'warn') {
    return `${base} bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:ring-amber-500`;
  }
  return `${base} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500`;
});
</script>

<template>
  <Transition
    name="subscription-alert"
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div
      v-if="shouldShowSubscriptionAlert"
      class="sticky top-0 z-50 h-0 w-screen"
    >
      <div class="mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <!-- Modern Minimalist Card -->
        <div
          class="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl"
          :class="alertClasses"
        >
          <!-- Content Container -->
          <div class="relative p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <!-- Left Content -->
              <div class="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <!-- Icon with Pulse Effect -->
                <div class="relative flex-shrink-0 mt-0.5 sm:mt-0">
                  <div
                    class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg"
                    :class="iconClasses"
                  >
                    {{ iconText }}
                  </div>
                  <!-- Pulse Ring for Critical -->
                  <div
                    v-if="messageSeverity === 'error'"
                    class="absolute inset-0 rounded-full animate-ping opacity-30"
                    :class="iconClasses"
                  ></div>
                </div>

                <!-- Text Content -->
                <div class="flex-1 min-w-0">
                  <!-- Status Badge - Mobile Stack -->
                  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                    <span
                      class="inline-flex items-center px-2.5 py-1 sm:px-3 rounded-full text-xs font-semibold tracking-wide uppercase w-fit"
                      :class="badgeClasses"
                    >
                      {{ statusText }}
                    </span>
                    <span class="text-xs sm:text-sm font-medium text-gray-600">
                      {{ subscriptionData?.daysRemaining === 1 ?
                        useLocalization('app.subscription-alert.day-remaining') :
                        useLocalization('app.subscription-alert.days-remaining').replace('[days]', String(subscriptionData?.daysRemaining || 0))
                      }}
                    </span>
                  </div>

                  <!-- Main Message -->
                  <p class="text-sm sm:text-base text-gray-800 font-medium leading-relaxed mb-1 sm:mb-0">
                    {{
                      useLocalization('app.subscription-alert.message')
                        .replace('[Expiry Date]', subscriptionData?.formattedExpiryDate || '')
                    }}
                  </p>
                </div>
              </div>

              <!-- Right Actions - Mobile Optimized -->
              <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
                <!-- CTA Button - Full width on mobile -->
                <button
                  class="group relative overflow-hidden flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50"
                  :class="buttonClasses"
                  @click="handleRenewNow"
                >
                  <span class="relative z-10">{{ useLocalization('app.subscription-alert.renew-now') }}</span>
                  <!-- Button Shine Effect -->
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                </button>

                <!-- Close Button - Smaller on mobile -->
                <button
                  class="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 flex-shrink-0"
                  @click="handleCloseAlert"
                >
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Enhanced Transitions */
.subscription-alert-enter-active,
.subscription-alert-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.subscription-alert-enter-from {
  transform: translateY(-100%) scale(0.95);
  opacity: 0;
}

.subscription-alert-leave-to {
  transform: translateY(-100%) scale(0.95);
  opacity: 0;
}

/* Custom Gradient Animation */
@keyframes gradient-x {
  0%, 100% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
}

/* .animate-gradient-x {
  animation: gradient-x 4s ease-in-out infinite;
} */

/* Pulse Animation for Critical Alerts */
@keyframes urgentPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* Floating Animation */
@keyframes floating {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* Enhanced Card Styling */
.subscription-card {
  animation: floating 6s ease-in-out infinite;
}

/* Glass Morphism Effect */
.glass-effect {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Button Shine Effect Animation */
@keyframes shine {
  0% { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
}

/* Enhanced Shadows */
.enhanced-shadow {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* Responsive Typography */
@media (max-width: 640px) {
  .responsive-text {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  /* Mobile-specific adjustments */
  .subscription-alert-enter-from,
  .subscription-alert-leave-to {
    transform: translateY(-100%) scale(0.98);
  }

  /* Optimize mobile animations */
  .animate-gradient-x {
    animation: gradient-x 6s ease-in-out infinite;
  }

  /* Mobile button improvements */
  .group:active {
    transform: scale(0.98);
  }

  /* Reduce motion for mobile performance */
  @media (prefers-reduced-motion: reduce) {
    .animate-gradient-x,
    .animate-ping {
      animation: none;
    }

    .group:hover {
      transform: none;
    }
  }
}

/* Extra small devices (phones, 375px and down) */
@media (max-width: 375px) {
  .subscription-alert-container {
    margin: 0 0.5rem;
  }

  /* Compact layout for very small screens */
  .mobile-compact .flex {
    gap: 0.5rem;
  }

  .mobile-compact .px-4 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .mobile-compact .py-2\.5 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}

/* Tablet devices (768px and up) */
@media (min-width: 768px) {
  .subscription-alert-enter-from,
  .subscription-alert-leave-to {
    transform: translateY(-100%) scale(0.96);
  }
}

/* Large devices (1024px and up) */
/* @media (min-width: 1024px) { */
  /* Enhanced animations for larger screens */
  /* .animate-gradient-x {
    animation: gradient-x 3s ease-in-out infinite;
  } */

  /* Better hover effects on larger screens */
  /* .group:hover {
    transform: scale(1.05) translateY(-1px);
  }
} */

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  /* Touch-friendly button sizing */
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }

  /* Remove hover animations on touch devices */
  .group:hover {
    transform: none;
  }

  /* Enhanced touch feedback */
  .group:active {
    transform: scale(0.96);
    transition: transform 0.1s ease-out;
  }

  /* Larger touch targets for close button */
  button:not(.group) {
    padding: 0.75rem;
    min-height: 44px;
    min-width: 44px;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  /* Crisp text rendering on retina displays */
  .text-crisp {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Enhanced shadow quality */
  .enhanced-shadow {
    box-shadow:
      0 25px 30px -5px rgba(0, 0, 0, 0.15),
      0 15px 15px -5px rgba(0, 0, 0, 0.08),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }
}

/* Landscape orientation on mobile */
@media (max-height: 500px) and (orientation: landscape) {
  /* Compact vertical spacing in landscape */
  .relative.p-4 {
    padding: 0.75rem 1rem;
  }

  /* Smaller icon in landscape mobile */
  .w-10.h-10 {
    width: 2rem;
    height: 2rem;
  }
}

/* Print styles (hide subscription alert) */
@media print {
  .sticky.top-0 {
    display: none;
  }
}

/* Utility classes for responsive behavior */
.mobile-stack {
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.mobile-full-width {
  @media (max-width: 640px) {
    width: 100%;
  }
}

.mobile-text-center {
  @media (max-width: 640px) {
    text-align: center;
  }
}

/* Performance optimizations for mobile */
@media (max-width: 640px) {
  /* Reduce shadow complexity on mobile */
  .shadow-2xl {
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
  }

  /* Simplify backdrop blur on mobile for better performance */
  .backdrop-blur-xl {
    backdrop-filter: blur(4px);
  }

  /* Reduce transform complexity */
  .transform {
    transform: none;
  }

  /* Optimize gradient animations */
  /* .animate-gradient-x {
    animation-duration: 8s;
  } */
}

/* Safe area adjustments for notched devices */
@supports (padding: max(0px)) {
  .sticky.top-0 {
    padding-top: max(env(safe-area-inset-top), 0);
  }

  .mx-auto.px-3 {
    padding-left: max(env(safe-area-inset-left), 0.75rem);
    padding-right: max(env(safe-area-inset-right), 0.75rem);
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .subscription-alert-enter-active,
  .subscription-alert-leave-active {
    transition: opacity 0.3s ease;
  }

  .subscription-alert-enter-from,
  .subscription-alert-leave-to {
    transform: none;
  }

  .animate-gradient-x,
  .animate-ping {
    animation: none;
  }
}

/* Focus improvements for keyboard navigation */
@media (hover: hover) and (pointer: fine) {
  .focus\:ring-4:focus {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
  }
}

/* Interactive Hover States */
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-out;
}

/* Focus States for Accessibility */
.focus-ring:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Modern Button Styling */
.modern-button {
  position: relative;
  overflow: hidden;
  transform: perspective(1px) translateZ(0);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modern-button:hover {
  transform: perspective(1px) translateZ(0) scale(1.05);
}

.modern-button:active {
  transform: perspective(1px) translateZ(0) scale(0.98);
}

/* Subtle Border Animation */
@keyframes borderGlow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
  }
}

.glow-border {
  animation: borderGlow 2s ease-in-out infinite;
}

/* Text Gradient Effect */
.gradient-text {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Enhanced Close Button */
.close-button {
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.close-button:hover {
  transform: rotate(90deg) scale(1.1);
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Dark Mode Enhancements */
@media (prefers-color-scheme: dark) {
  .glass-effect {
    background: rgba(17, 24, 39, 0.25);
    border: 1px solid rgba(75, 85, 99, 0.18);
  }

  .enhanced-shadow {
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.4),
      0 10px 10px -5px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.02);
  }
}

/* Loading State (Future Enhancement) */
.loading-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.5) 60%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>