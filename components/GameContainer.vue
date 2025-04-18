<script setup lang="ts">
import { ref } from 'vue';
// Nuxt 3 auto-imports components/
// No explicit imports needed for TargetDisplay, OptionsArea, etc.

// --- Placeholder Data for Phase 2 ---
const placeholderTarget = ref('AB');
const placeholderOptions = ref([
  { letters: 'CD', id: 'opt1' },
  { letters: 'EF', id: 'opt2' },
  { letters: 'AB', id: 'opt3' }, // The correct one
  { letters: 'GH', id: 'opt4' },
  { letters: 'IJ', id: 'opt5' },
]);
const placeholderScore = ref(0);
const placeholderRound = ref(1);
// --- End Placeholder Data ---

// Placeholder: Import the store - will be used in Phase 3
// import { useGameStore } from '@/stores/game';
// const gameStore = useGameStore();

// Placeholder: Call startGame or startWarmup on mount (example)
// import { onMounted } from 'vue';
// onMounted(() => {
//   gameStore.startWarmup(); // Or startGame()
// });

// Placeholder handler for option selection - will call store action in Phase 4
function handleOptionSelected(optionId: string | number) {
  console.log('Option selected in GameContainer:', optionId);
  // Find the selected option text for demo purposes
  const selected = placeholderOptions.value.find(opt => opt.id === optionId);
  alert(`You selected: ${selected?.letters} (ID: ${optionId})`);
  // In Phase 4, this will call gameStore.selectOption(optionId)
}

// Placeholder handler for pause toggle - will call store action in Phase 5
function handleTogglePause() {
    console.log('Toggle Pause clicked');
    alert('Pause toggled!');
    // In Phase 5, this will call gameStore.pauseGame() or gameStore.resumeGame()
}

</script>

<template>
  <div class="game-container p-4 max-w-2xl mx-auto min-h-screen flex flex-col">
    <!-- Header: Scoreboard -->
    <header class="mb-4 flex-shrink-0">
      <ScoreBoard
        :score="placeholderScore"
        :round="placeholderRound"
      />
    </header>

    <!-- Main Game Area -->
    <main class="mb-4 flex-grow flex flex-col justify-center">
      <TargetDisplay :target-letters="placeholderTarget" />
      <OptionsArea
        :options="placeholderOptions"
        @select-option="handleOptionSelected"
      />
    </main>

    <!-- Footer: Controls -->
    <footer class="flex justify-center py-4 flex-shrink-0">
      <PauseButton @toggle-pause="handleTogglePause" />
    </footer>
  </div>
</template>

<style scoped>
/* Scoped styles for GameContainer if needed */
.game-container {
  /* Using flex column and min-height to structure layout */
}
</style>
