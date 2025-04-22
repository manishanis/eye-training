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
  <div class="game-over-container text-center p-6 rounded-lg shadow-md bg-gray-800 text-gray-200 w-full max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-4 text-white">Game Over!</h2>
    <!-- <p class="mb-2 text-gray-300">Final Score: {{ score }}</p> -->
    <p class="mb-4 text-gray-300">Rounds Played: {{ round }}</p>

    <!-- Display Average Time for Successful Rounds -->
    <div class="mb-6">
      <!-- <h3 class="text-xl font-semibold mb-2 text-white">Performance Summary</h3> -->
        <p v-if="averageSuccessTimeMs > 0" class="text-lg text-gray-300">
            Average Time (Successful Rounds):
            <span class="font-bold text-white">{{ averageSuccessTimeMs }} ms</span>
        </p>
        <p v-else class="text-gray-400">
            No successful rounds were recorded to calculate an average time.
        </p>
    </div>

    <!-- Detailed Click Log Table -->
    <div class="click-log-section mt-6">
        <div v-if="clickHistory && (clickHistory as ClickRecord[]).length > 0" class="click-log-table-container overflow-auto">
            <table class="min-w-full divide-y divide-gray-700 border border-gray-600">
                <thead class="bg-gray-700">
                    <tr>
                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-r border-gray-600">Round Label</th>
                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-r border-gray-600">Clicked</th>
                        <th scope="col" class="px-4 py-2 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-r border-gray-600">Correct?</th>
                        <th scope="col" class="px-4 py-2 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Time (ms)</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700 bg-gray-800">
                    <tr v-for="(click, index) in (clickHistory as ClickRecord[])" :key="index" class="hover:bg-gray-700">
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-200 border-r border-gray-600">{{ click.roundLabel }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-200 font-mono border-r border-gray-600">{{ click.clickedLetters }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-center border-r border-gray-600">
                            <span :class="click.isCorrect ? 'text-green-400' : 'text-red-400'">
                                {{ click.isCorrect ? '✔️' : '❌' }}
                            </span>
                        </td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-200 text-right">{{ click.timeMs }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-else class="text-gray-400">No clicks were recorded.</p>
    </div>

    <!-- Restart button remains -->
    <button
      @click="handleRestartClick"
      class="px-6 py-3 bg-blue-700 text-blue-300 font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 transition duration-150 ease-in-out mt-4"
    >
      Restart Game
    </button>
  </div>
</template>

<style scoped>
.game-over-container {
  border: 1px solid #4a5568; /* Adjusted border for dark theme */
  /* Text color is handled by Tailwind classes now */
}

/* Styles for the click log table */
.click-log-table-container {
  max-height: 300px; /* Limit table height and enable scrolling */
  overflow-y: auto;
  border: 1px solid #4a5568; /* Adjusted border for dark theme */
  border-radius: 4px; /* Optional: slightly round corners */
}

.click-log-section table {
  width: 100%;
  border-collapse: collapse; /* Keep borders clean */
}

.click-log-section th,
.click-log-section td {
  /* Border color is handled by Tailwind on table, thead, tbody */
  padding: 8px; /* Keep padding */
  text-align: left; /* Default alignment */
  /* Text color is handled by Tailwind */
}

.click-log-section th {
  /* Background color handled by Tailwind */
  position: sticky;
  top: 0;
  z-index: 1; /* Keep header sticky */
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
