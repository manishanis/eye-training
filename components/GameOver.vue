<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { RoundResult, ClickRecord } from '~/stores/game'; // Import interfaces

// Define props expected by this component
const props = defineProps<{
  score: number;
  round: number; // The round number when the game ended
  roundResults: { type: PropType<RoundResult[]>, required: true };
  clickHistory: { type: PropType<ClickRecord[]>, required: true }; // Add clickHistory prop
}>();

// Define emits for component events
const emit = defineEmits<{
  (e: 'restart'): void; // Event emitted when restart button is clicked
}>();

function handleRestartClick() {
  emit('restart');
}

// Calculate average time for successful rounds
const averageSuccessTimeMs = computed(() => {
  // Ensure props.roundResults is treated as an array
  const results = props.roundResults as RoundResult[];
  if (!results || results.length === 0) {
    return 0;
  }
  const totalTime = results.reduce((sum, result) => sum + result.timeMs, 0);
  return Math.round(totalTime / results.length);
});

</script>

<template>
  <div class="game-over-container text-center p-6 rounded-lg shadow-md bg-white w-full max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Game Over!</h2>
    <!-- <p class="mb-2 text-gray-700">Final Score: {{ score }}</p> -->
    <p class="mb-4 text-gray-700">Rounds Played: {{ round }}</p>

    <!-- Display Average Time for Successful Rounds -->
    <div class="mb-6">
      <!-- <h3 class="text-xl font-semibold mb-2 text-gray-800">Performance Summary</h3> -->
        <p v-if="averageSuccessTimeMs > 0" class="text-lg text-gray-700">
            Average Time (Successful Rounds):
            <span class="font-bold">{{ averageSuccessTimeMs }} ms</span>
        </p>
        <p v-else class="text-gray-500">
            No successful rounds were recorded to calculate an average time.
        </p>
    </div>

    <!-- Detailed Click Log Table -->
    <div class="click-log-section mt-6">
        <div v-if="clickHistory && (clickHistory as ClickRecord[]).length > 0" class="click-log-table-container overflow-auto">
            <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Round Label</th>
                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Clicked</th>
                        <th scope="col" class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Correct?</th>
                        <th scope="col" class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Time (ms)</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(click, index) in (clickHistory as ClickRecord[])" :key="index" class="hover:bg-gray-50">
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">{{ click.roundLabel }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-mono border-r border-gray-300">{{ click.clickedLetters }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-center border-r border-gray-300">
                            <span :class="click.isCorrect ? 'text-green-600' : 'text-red-600'">
                                {{ click.isCorrect ? '✔️' : '❌' }}
                            </span>
                        </td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{{ click.timeMs }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-else class="text-gray-500">No clicks were recorded.</p>
    </div>

    <!-- Restart button remains -->
    <button
      @click="handleRestartClick"
      class="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 transition duration-150 ease-in-out mt-4"
    >
      Restart Game
    </button>
  </div>
</template>

<style scoped>
.game-over-container {
  border: 1px solid #e2e8f0; /* Keep existing border or adjust */
  color: #333; /* Ensure text is readable on white background */
}

/* Styles for the click log table */
.click-log-table-container {
  max-height: 300px; /* Limit table height and enable scrolling */
  overflow-y: auto;
  border: 1px solid #e2e8f0; /* Add border around the scrollable container */
}

.click-log-section table {
  width: 100%;
  border-collapse: collapse;
}

.click-log-section th,
.click-log-section td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.click-log-section th {
  background-color: #f2f2f2;
  position: sticky;
  top: 0;
  z-index: 1;
}

/* Right-align time column */
.click-log-section td:last-child,
.click-log-section th:last-child {
  text-align: right;
}

/* Center align Correct? column */
.click-log-section td:nth-child(3),
.click-log-section th:nth-child(3) {
    text-align: center;
}

/* Mono font for letter columns */
.click-log-section td:nth-child(2),
.click-log-section th:nth-child(2) {
    font-family: monospace;
}
</style>
