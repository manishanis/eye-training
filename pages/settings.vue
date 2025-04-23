<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();
const { getSettings } = storeToRefs(gameStore);
const { updateSettings } = gameStore;

// Local refs to bind to the inputs, initialized from store settings
// Use default values if settings are somehow not loaded yet
const localTotalRounds = ref(getSettings.value?.totalRounds ?? 5);
const localGridRows = ref(getSettings.value?.optionsGridRows ?? 4);
const localGridCols = ref(getSettings.value?.optionsGridCols ?? 5);
const localOptionCount = ref(getSettings.value?.optionCount ?? 18);
const localOptionMoveInterval = ref(getSettings.value?.optionMoveIntervalSeconds ?? 0.8);

// Watch for changes in the Total Rounds input and update the store
watch(localTotalRounds, (newValue) => {
  // Ensure the value is a positive number
  const newTotalRounds = Math.max(1, Number(newValue) || 1);
  if (newTotalRounds !== getSettings.value.totalRounds) {
    updateSettings({ totalRounds: newTotalRounds });
    // Optionally update local ref in case input was invalid/corrected
    localTotalRounds.value = newTotalRounds;
  }
});

// Watch for changes in the Grid Rows input and update the store
watch(localGridRows, (newValue) => {
  // Ensure the value is a positive number, at least 1
  const newGridRows = Math.max(1, Number(newValue) || 1);
  if (newGridRows !== getSettings.value.optionsGridRows) {
    updateSettings({ optionsGridRows: newGridRows });
    localGridRows.value = newGridRows; // Update local ref if corrected
  }
});

// Watch for changes in the Grid Columns input and update the store
watch(localGridCols, (newValue) => {
  // Ensure the value is a positive number, at least 1
  const newGridCols = Math.max(1, Number(newValue) || 1);
  if (newGridCols !== getSettings.value.optionsGridCols) {
    updateSettings({ optionsGridCols: newGridCols });
    localGridCols.value = newGridCols; // Update local ref if corrected
  }
});

// Watch for changes in the Option Count input and update the store
watch(localOptionCount, (newValue) => {
  // Ensure the value is a positive number, at least 2 (1 correct + 1 distractor)
  const newOptionCount = Math.max(2, Number(newValue) || 2);
  if (newOptionCount !== getSettings.value.optionCount) {
    updateSettings({ optionCount: newOptionCount });
    localOptionCount.value = newOptionCount; // Update local ref if corrected
  }
});

// Watch for changes in the Option Move Interval input and update the store
watch(localOptionMoveInterval, (newValue) => {
  // Ensure the value is a positive number (allow decimals, minimum small value like 0.1)
  const newInterval = Math.max(0.1, Number(newValue) || 0.1);
  if (newInterval !== getSettings.value.optionMoveIntervalSeconds) {
    updateSettings({ optionMoveIntervalSeconds: newInterval });
    localOptionMoveInterval.value = newInterval; // Update local ref if corrected
  }
});


// Watch for external changes in store settings (e.g., defaults loading)
// and update the local input values
watch(
  getSettings,
  (newSettings) => {
    if (newSettings) {
        // Update Total Rounds if changed
        if (newSettings.totalRounds !== localTotalRounds.value) {
            localTotalRounds.value = newSettings.totalRounds;
        }
        // Update Grid Rows if changed
        if (newSettings.optionsGridRows !== localGridRows.value) {
            localGridRows.value = newSettings.optionsGridRows;
        }
        // Update Grid Columns if changed
        if (newSettings.optionsGridCols !== localGridCols.value) {
            localGridCols.value = newSettings.optionsGridCols;
        }
        // Update Option Count if changed
        if (newSettings.optionCount !== localOptionCount.value) {
            localOptionCount.value = newSettings.optionCount;
        }
        // Update Option Move Interval if changed
        if (newSettings.optionMoveIntervalSeconds !== localOptionMoveInterval.value) {
            localOptionMoveInterval.value = newSettings.optionMoveIntervalSeconds;
        }
    }
  },
  { deep: true }, // Use deep watch as we are watching an object
);

// Computed property to check if grid size is sufficient
const isGridTooSmall = computed(() => {
  return (localGridRows.value * localGridCols.value) < localOptionCount.value;
});
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

      <div class="mb-4">
        <label for="gridRows" class="block text-sm font-medium mb-1"
          >Grid Rows:</label
        >
        <input
          id="gridRows"
          v-model.number="localGridRows"
          type="number"
          min="1"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="text-xs text-gray-400 mt-1">
          Number of rows in the options grid.
        </p>
      </div>

      <div class="mb-4">
        <label for="gridCols" class="block text-sm font-medium mb-1"
          >Grid Columns:</label
        >
        <input
          id="gridCols"
          v-model.number="localGridCols"
          type="number"
          min="1"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="text-xs text-gray-400 mt-1">
          Number of columns in the options grid. Ensure Rows x Columns is enough for all options.
        </p>
      </div>

      <!-- Warning message for insufficient grid size -->
      <div v-if="isGridTooSmall" class="mb-4 p-3 bg-red-900 border border-red-700 rounded-md text-red-300 text-sm">
        <strong>Warning:</strong> The current grid size ({{ localGridRows }} rows x {{ localGridCols }} columns = {{ localGridRows * localGridCols }} cells) is smaller than the Number of Options ({{ localOptionCount }}). Some options may not be displayed. Please increase grid dimensions or decrease the number of options.
      </div>

       <div class="mb-4">
        <label for="optionCount" class="block text-sm font-medium mb-1"
          >Number of Options:</label
        >
        <input
          id="optionCount"
          v-model.number="localOptionCount"
          type="number"
          min="2"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="text-xs text-gray-400 mt-1">
          Total options displayed (1 correct + distractors). Must be at least 2.
        </p>
      </div>

      <div class="mb-4">
        <label for="optionMoveInterval" class="block text-sm font-medium mb-1"
          >Option Move Interval (seconds):</label
        >
        <input
          id="optionMoveInterval"
          v-model.number="localOptionMoveInterval"
          type="number"
          min="0.1"
          step="0.1"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="text-xs text-gray-400 mt-1">
          How often an option moves to a new position (e.g., 0.5, 1, 1.5). Minimum 0.1 seconds.
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
