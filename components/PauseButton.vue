<script setup lang="ts">
defineProps<{
   isPaused: boolean;
}>();
const emit = defineEmits(['togglePause']);
</script>

<template>
  <button
    class="pause-button px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors duration-150 w-24 text-center"
    @click="emit('togglePause')"
  >
    <!-- Change text based on isPaused prop -->
    <span v-if="isPaused">Resume</span>
    <span v-else>Pause</span>
  </button>
</template>

<style scoped>
/* Scoped styles for PauseButton if needed */
</style>
