<script lang="ts" setup>
import Home from '@/components/Home.vue';
</script>

<template>
  <!-- Suspense before Home has an async script -->
  <Suspense>
    <template #default>
      <Home msg="WXT + Vue" />
    </template>
    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>
</template>

<style scoped></style>
