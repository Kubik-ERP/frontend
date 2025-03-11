<script setup lang="ts">
const router = useRouter();

router.replace({
  name: 'sign-in',
});
</script>

<template>
  <section id="entry-point">
    <!-- Adjust entry point to your needs, for this sample only use for redirect to dashboard or login if user access "/" -->
    <p>If you can see me, your network is slow :D.</p>
  </section>
</template>
