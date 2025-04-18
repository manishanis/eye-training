<script setup lang="ts">
defineProps<{
  targetLetters: string;
}>();
</script>

<template>
  <div class="target-display text-center p-4 my-4">
    <span
      class="text-6xl font-bold tracking-widest p-4 border-4 border-yellow-500 rounded-lg bg-gray-800 text-yellow-300"
    >
      {{ targetLetters }}
    </span>
  </div>
</template>

<style scoped>
/* Scoped styles for TargetDisplay if needed */
</style>
