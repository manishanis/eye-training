<script setup lang="ts">
// Define props expected by this component
defineProps<{
  score: number;
  round: number; // The round number when the game ended
}>();

// Define emits for component events
const emit = defineEmits<{
  (e: 'restart'): void; // Event emitted when restart button is clicked
}>();

function handleRestartClick() {
  emit('restart');
}
</script>

<template>
  <div class="game-over-container text-center p-6 rounded-lg shadow-md">
    <!-- TODO: table of results. columns: # round, letter, wright or wrong, miliseconds each, milisecons average in total -->
    <button
      @click="handleRestartClick"
      class="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 transition duration-150 ease-in-out"
    >
      Restart Game
    </button>
  </div>
</template>

<style scoped>
/* Add specific styles for the GameOver component if needed */
.game-over-container {
  /* Example style */
  border: 1px solid #e2e8f0;
}
</style>
