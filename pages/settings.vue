<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();
const { getSettings } = storeToRefs(gameStore);
const { updateSettings } = gameStore;

// Local ref to bind to the input, initialized from store settings
// Use a default value if settings are somehow not loaded yet
const localTotalRounds = ref(getSettings.value?.totalRounds ?? 5);

// Watch for changes in the input and update the store
watch(localTotalRounds, (newValue) => {
  // Ensure the value is a positive number
  const newTotalRounds = Math.max(1, Number(newValue) || 1);
  if (newTotalRounds !== getSettings.value.totalRounds) {
    updateSettings({ totalRounds: newTotalRounds });
    // Optionally update local ref in case input was invalid/corrected
    localTotalRounds.value = newTotalRounds;
  }
});

// Watch for external changes in store settings (e.g., defaults loading)
// and update the local input value
watch(
  getSettings,
  (newSettings) => {
    if (newSettings && newSettings.totalRounds !== localTotalRounds.value) {
      localTotalRounds.value = newSettings.totalRounds;
    }
  },
  { deep: true },
);
</script>

<template>
  <div class="main">
    <div
      class="settings-page p-6 max-w-md mx-auto bg-gray-800 text-gray-200 rounded-lg shadow-lg"
    >
      <h1 class="text-2xl font-bold mb-6 text-center">Game Settings</h1>

      <div class="mb-4">
        <label for="totalRounds" class="block text-sm font-medium mb-1"
          >Total Rounds:</label
        >
        <input
          id="totalRounds"
          v-model.number="localTotalRounds"
          type="number"
          min="1"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="text-xs text-gray-400 mt-1">
          Number of rounds before the game ends.
        </p>
      </div>

      <!-- Add more settings here later -->

      <div class="mt-8 text-center">
        <NuxtLink
          to="/"
          class="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Back to Game
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add specific styles for the settings page if needed */
input[type="number"] {
  /* Optional: Improve appearance for number input */
}
</style>

<style>
.main {
  display: flex;
  flex-direction: column; /* Stack children vertically */
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
  min-height: 100vh; /* Ensure it takes full viewport height */
}
</style>
