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
  // totalRounds is now in settings
  gameState,
  // Feedback state refs
  feedbackOptionId,
  lastSelectionCorrect,
  isFeedbackActive,
  // Getters can also be refs via storeToRefs
  isPaused,
  getRoundResults, // Getter for successful round results
  getClickHistory, // Getter for all click attempts
  getSettings, // Getter for settings
} = storeToRefs(gameStore);

// Actions can be destructured directly
const {
  startWarmup,
  // startGame, // Can call directly if needed
  selectOption,
  pauseGame,
  resumeGame,
  restartGame, // Add restartGame action
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

// Handler for restarting the game - calls the store action
function handleRestartGame() {
  console.log("Restart Game requested from GameContainer");
  restartGame(); // Call the store action
}
</script>

<template>
  <div class="game-container p-4 mx-auto min-h-screen flex flex-col">
    <!-- Header: Scoreboard & Settings Link -->
    <header class="mb-4 flex-shrink-0 flex justify-between items-center">
      <!-- ScoreBoard now uses totalRounds from settings -->
      <ScoreBoard :score="score" :round="currentRound" :total-rounds="getSettings.totalRounds" />
      <!-- Settings Link/Button - Show only when not actively playing -->
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
      <!-- Use GameOver component when game is over -->
      <div v-else-if="gameState === 'gameOver'" class="flex justify-center items-center h-full">
        <GameOver
          :score="score"
          :round="currentRound"
          :round-results="getRoundResults"
          :click-history="getClickHistory"
          @restart="handleRestartGame"
        />
      </div>
    </main>

    <!-- Footer: Controls -->
    <footer class="flex justify-center py-4 flex-shrink-0">
      <!-- <PauseButton :is-paused="isPaused" @toggle-pause="handleTogglePause" /> -->
      <!-- Settings button moved to header -->
      <NuxtLink
        v-if="gameState !== 'playing' && gameState !== 'warmup'"
        to="/settings"
        class="text-sm text-gray-400 hover:text-gray-200 border border-gray-600 px-3 py-1 rounded hover:border-gray-500 transition-colors"
        title="Game Settings"
      >
        ⚙️ Settings
      </NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
/* Scoped styles for GameContainer if needed */
.game-container {
  /* Using flex column and min-height to structure layout */
}
</style>
