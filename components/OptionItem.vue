<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  letters: string;
  id: string | number;
  // Feedback props
  isSelectedAndActive: boolean;
  isCorrectFeedback: boolean;
  // Positioning props
  topStyle: string; // e.g., '50%'
  leftStyle: string; // e.g., '25%'
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
  <!-- Bind position styles -->
  <button
    :class="[
      'option-item w-24 h-24 rounded-full border-2 flex items-center justify-center text-3xl font-medium focus:outline-none transition-colors duration-150',
      'absolute', // Add absolute positioning
      feedbackClasses // Apply computed classes
    ]"
    :style="{
       top: props.topStyle,
       left: props.leftStyle,
       transform: 'translate(-50%, -50%)' // Center the item on its top/left point
    }"
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

/* Add transition for smooth movement */
.option-item {
  /* Ensure transform is also transitioned if needed, though top/left are primary */
  transition: top 0.5s ease-in-out, left 0.5s ease-in-out, transform 0.5s ease-in-out, background-color 0.15s linear, border-color 0.15s linear;
}
</style>
