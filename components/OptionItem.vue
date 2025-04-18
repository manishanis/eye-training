<script setup lang="ts">
defineProps<{
  letters: string;
  id: string | number; // Allow string or number for ID
}>();

// Emits will be added in Phase 4
// const emit = defineEmits(['select']);
</script>

<template>
  <button
    class="option-item w-24 h-24 rounded-full border-2 border-gray-400 bg-gray-700 flex items-center justify-center text-3xl font-medium hover:bg-gray-600 hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500 transition-colors duration-150"
    @click="$emit('select', id)"
  >
    <span>{{ letters }}</span>
  </button>
</template>

<style scoped>
/* Scoped styles for OptionItem if needed */
</style>
