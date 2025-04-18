<script setup lang="ts">
// Define the structure for an option expected in the prop
interface Option {
  letters: string;
  id: string; // Ensure ID is string as used in store
  isCorrect: boolean; // Include correctness info if needed, though store handles logic
}

import BackgroundDots from './BackgroundDots.vue'; // Import the new component

const emit = defineEmits(['selectOption']);

// Feedback state passed down from GameContainer
const props = defineProps<{ // Define props explicitly to access isPaused
  options: Option[];
  feedbackOptionId: string | null;
  lastSelectionCorrect: boolean | null;
  isFeedbackActive: boolean;
}>();

</script>

<template>
  <div class="options-area bg-orange-900/30 p-6 rounded-lg min-h-[250px] relative">
     <!-- Background Dots Layer -->
    <BackgroundDots :is-paused="props.isFeedbackActive" /> <!-- Pause dots during feedback -->
    <!-- Layout for Option Items (ensure it's above the dots) -->
    <div class="relative z-10 flex flex-wrap justify-center items-center gap-4">
      <OptionItem
        v-for="option in options"
        :key="option.id"
        :letters="option.letters"
        :id="option.id"
        :is-selected-and-active="isFeedbackActive && feedbackOptionId === option.id"
        :is-correct-feedback="lastSelectionCorrect === true"
        @select="emit('selectOption', $event)"
      />
    </div>
    <!-- Background dots will be added later -->
  </div>
</template>

<style scoped>
/* Scoped styles for OptionsArea if needed */
</style>
