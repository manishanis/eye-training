<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  letters: string;
  id: string | number;
  // Feedback props
  isSelectedAndActive: boolean; // Is this the item selected AND feedback is active?
  isCorrectFeedback: boolean; // Was the selection correct? (Only relevant if isSelectedAndActive)
}>();

const emit = defineEmits(['select']);

// Compute dynamic classes based on feedback state
const feedbackClasses = computed(() => {
  if (!props.isSelectedAndActive) {
    return 'border-gray-400 bg-gray-700 hover:bg-gray-600 hover:border-white'; // Default state
  }
  if (props.isCorrectFeedback) {
    return 'border-green-300 bg-green-600 ring-2 ring-green-300 ring-offset-2 ring-offset-gray-900'; // Correct feedback
  } else {
    return 'border-red-400 bg-red-700 ring-2 ring-red-400 ring-offset-2 ring-offset-gray-900 animate-shake'; // Incorrect feedback + shake
  }
});

function handleClick() {
  emit('select', props.id);
}
</script>

<template>
  <!-- Prevent re-clicking during feedback -->
  <button
    :class="[
      'option-item w-24 h-24 rounded-full border-2 flex items-center justify-center text-3xl font-medium focus:outline-none transition-colors duration-150',
      feedbackClasses // Apply computed classes
    ]"
    @click="handleClick"
    :disabled="isSelectedAndActive"
  >
    <span>{{ letters }}</span>
  </button>
</template>

<style scoped>
/* Simple shake animation for incorrect feedback */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
