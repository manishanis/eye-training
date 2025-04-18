<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  dotCount?: number;
  isPaused: boolean;
}>();

interface Dot {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number; // pixels
  delay: number; // animation delay (seconds)
  duration: number; // animation duration (seconds)
}

const dots = ref<Dot[]>([]);
const defaultDotCount = 20; // Adjust as needed

onMounted(() => {
  generateDots();
});

function generateDots() {
  const count = props.dotCount ?? defaultDotCount;
  const newDots: Dot[] = [];
  for (let i = 0; i < count; i++) {
    newDots.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2, // Size between 2px and 5px
      delay: Math.random() * 5, // Random start delay up to 5s
      duration: Math.random() * 10 + 10, // Duration between 10s and 20s
    });
  }
  dots.value = newDots;
}
</script>

<template>
  <div class="dots-container absolute inset-0 overflow-hidden pointer-events-none">
    <div
      v-for="dot in dots"
      :key="dot.id"
      class="dot absolute rounded-full bg-white/10"
      :style="{
        width: `${dot.size}px`,
        height: `${dot.size}px`,
        left: `${dot.x}%`,
        top: `${dot.y}%`,
        animationName: 'move',
        animationDuration: `${dot.duration}s`,
        animationDelay: `${dot.delay}s`,
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
        animationPlayState: isPaused ? 'paused' : 'running', // Control animation based on prop
      }"
    ></div>
  </div>
</template>

<style scoped>
@keyframes move {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
  }
  25% {
    /* Move slightly */
    transform: translate(
      calc(cos(var(--random-angle, 0deg)) * 15px), /* Use CSS variable for randomness if needed */
      calc(sin(var(--random-angle, 90deg)) * 15px)
    ) scale(1.1);
    opacity: 1;
  }
  50% {
     transform: translate(
      calc(cos(var(--random-angle-2, 180deg)) * 10px),
      calc(sin(var(--random-angle-2, 270deg)) * 10px)
    ) scale(0.9);
     opacity: 0.7;
  }
   75% {
     transform: translate(
      calc(cos(var(--random-angle-3, 45deg)) * 5px),
      calc(sin(var(--random-angle-3, 135deg)) * 5px)
    ) scale(1);
     opacity: 0.9;
  }
}

/* Assign random angles via style if more complex movement needed,
   otherwise the simple keyframes provide some variation */
.dot {
  /* Example of setting CSS variables if needed, though might be overkill */
   /* --random-angle: calc(random() * 360deg); */
}
</style>
