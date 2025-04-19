<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game";

// Nuxt 3 auto-imports components/

// --- Connect to Pinia Store ---
const gameStore = useGameStore();

// Use storeToRefs to keep reactivity for state properties
const {
  currentTarget,
  currentOptions,
  score,
  currentRound,
  totalRounds, // Add totalRounds
  gameState,
  // Feedback state refs
  feedbackOptionId,
  lastSelectionCorrect,
  isFeedbackActive,
  // Getters can also be refs via storeToRefs
  isPaused,
} = storeToRefs(gameStore);

// Actions can be destructured directly
const {
  startWarmup,
  // startGame, // Can call directly if needed
  selectOption,
  pauseGame,
  resumeGame,
} = gameStore;
// --- End Store Connection ---

// Start the warmup phase when the component is mounted
onMounted(() => {
  // Component is mounted, game state defaults to 'idle'
  // The user will click the "Start Game" button to initiate the warmup
});

// Handler for option selection - calls the store action
function handleOptionSelected(optionId: string) {
  // Prevent selection if paused or game over
  if (gameState.value === "paused" || gameState.value === "gameOver") {
    return;
  }
  console.log("Option selected in GameContainer:", optionId);
  selectOption(optionId); // Call the store action
}

// Handler for pause toggle - calls the appropriate store action
function handleTogglePause() {
  console.log("Toggle Pause clicked");
  if (gameState.value === "paused") {
    resumeGame();
  } else if (gameState.value === "playing" || gameState.value === "warmup") {
    pauseGame();
  }
}
</script>

<template>
  <div class="game-container p-4 max-w-2xl mx-auto min-h-screen flex flex-col">
    <!-- Header: Scoreboard -->
    <!-- Header: Scoreboard - Use reactive state from store -->
    <header class="mb-4 flex-shrink-0">
      <ScoreBoard :score="score" :round="currentRound" :total-rounds="totalRounds" />
      <!-- :warmupRoundsLeft="warmupRoundsLeft" -->
    </header>

    <!-- Main Game Area - Use reactive state from store -->
    <main class="mb-4 flex-grow flex flex-col justify-center">
      <!-- Display Target/Options only when game is active -->
      <template
        v-if="
          gameState === 'playing' ||
          gameState === 'warmup' ||
          gameState === 'paused'
        "
      >
        <TargetDisplay :target-letters="currentTarget" />
        <OptionsArea
          :options="currentOptions"
          :feedback-option-id="feedbackOptionId"
          :last-selection-correct="lastSelectionCorrect"
          :is-feedback-active="isFeedbackActive || isPaused"
          @select-option="handleOptionSelected"
        />
      </template>
      <!-- Placeholder for other states like idle, gameOver -->
      <div v-else-if="gameState === 'idle'" class="text-center text-xl flex justify-center items-center h-full">
        <button
          id="start-game"
          @click="startWarmup"
          class="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 animate-pulse"
        >
          Start Game
        </button>
      </div>
      <div v-else-if="gameState === 'gameOver'" class="text-center text-xl">
        Game Over! Final Score: {{ score }}
        <!-- TODO: Add restart button -->
      </div>
    </main>

    <!-- Footer: Controls - Pass isPaused state -->
    <footer class="flex justify-center py-4 flex-shrink-0">
      <PauseButton :is-paused="isPaused" @toggle-pause="handleTogglePause" />
    </footer>
  </div>
</template>

<style scoped>
/* Scoped styles for GameContainer if needed */
.game-container {
  /* Using flex column and min-height to structure layout */
}
</style>
