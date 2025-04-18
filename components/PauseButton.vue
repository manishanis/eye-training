<script setup lang="ts">
// Props and Emits will be added later
// defineProps<{ isPaused: boolean }>();
// const emit = defineEmits(['togglePause']);
</script>

<template>
  <button
    class="pause-button px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors duration-150"
    @click="$emit('togglePause')"
  >
    <!-- Placeholder text - icon/text will change based on state later -->
    <span>Pause</span>
  </button>
</template>

<style scoped>
/* Scoped styles for PauseButton if needed */
</style>
