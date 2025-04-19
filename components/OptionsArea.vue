<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "@/stores/game"; // Import store
// import BackgroundDots from "./BackgroundDots.vue";

// Define the structure for an option expected in the prop, including position
interface OptionWithPosition {
  letters: string;
  id: string;
  isCorrect: boolean;
  gridRow: number;
  gridCol: number;
}

const emit = defineEmits(["selectOption"]);

// Feedback state passed down from GameContainer
const props = defineProps<{
  options: OptionWithPosition[]; // Expect options with position data
  feedbackOptionId: string | null;
  lastSelectionCorrect: boolean | null;
  isFeedbackActive: boolean;
}>();

// Access store to get grid dimensions
const gameStore = useGameStore();
const gridRows = computed(() => gameStore.optionsGridRows);
const gridCols = computed(() => gameStore.optionsGridCols);

// Calculate position styles based on grid data
// Adding padding/offset to prevent items hitting the very edge
const calculatePosition = (row: number, col: number) => {
  const rowCount = gridRows.value <= 0 ? 1 : gridRows.value; // Avoid division by zero
  const colCount = gridCols.value <= 0 ? 1 : gridCols.value;

  // Calculate base percentage position
  let topPercent = (row / rowCount) * 100;
  let leftPercent = (col / colCount) * 100;

  // Add some offset based on grid position to distribute more centrally
  // This distributes items within their grid cell area rather than just at the top-left corner
  topPercent += (1 / rowCount) * 50; // Center vertically within the cell 'band'
  leftPercent += (1 / colCount) * 50; // Center horizontally within the cell 'band'

  // Use transform to center the item itself on the calculated point
  // Note: OptionItem size (w-24 h-24 -> 6rem) needs to be considered
  // We apply transform directly in the style binding below for simplicity here

  return {
    top: `${topPercent}%`,
    left: `${leftPercent}%`,
  };
};
</script>

<template>
  <div
    class="options-area bg-orange-900/30 p-6 rounded-lg min-h-[500px] relative"
  >
    <!-- Background Dots Layer -->
    <!-- <BackgroundDots :is-paused="props.isFeedbackActive" /> -->
    <!-- Pause dots during feedback -->
    <!-- Container for Absolutely Positioned Option Items -->
    <!-- Removed flex/wrap/justify/items/gap classes -->
    <OptionItem
      v-for="option in props.options"
      :key="option.id"
      :letters="option.letters"
      :id="option.id"
      :top-style="calculatePosition(option.gridRow, option.gridCol).top"
      :left-style="calculatePosition(option.gridRow, option.gridCol).left"
      :is-selected-and-active="
        props.isFeedbackActive && props.feedbackOptionId === option.id
      "
      :is-correct-feedback="props.lastSelectionCorrect === true"
      @select="emit('selectOption', $event)"
    />
  </div>
</template>

<style scoped>
/* Scoped styles for OptionsArea if needed */
</style>
