<script setup lang="ts">
defineProps<{
  score: number;
  round: number;
  totalRounds: number; // Add total rounds prop
  // warmupRoundsLeft?: number; // Optional prop for warmup
}>();
</script>

<template>
  <div class="score-board flex justify-between items-center text-lg font-semibold text-gray-300 px-2">
    <!-- <span>Score: {{ score }}</span> -->
    <span></span>
    <span>Round: {{ round }} / {{ totalRounds }}</span>
    <!-- Optional Warmup display -->
    <!-- <span v-if="warmupRoundsLeft !== undefined">Warmup Left: {{ warmupRoundsLeft }}</span> -->
  </div>
</template>

<style scoped>
/* Scoped styles for ScoreBoard if needed */
</style>
