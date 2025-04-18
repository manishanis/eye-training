<template>
  <div>
    <!-- Render the main game component -->
    <GameContainer />
  </div>
</template>

<script setup lang="ts">
// Nuxt 3 auto-imports components from the components/ directory
// No explicit import needed here for GameContainer
</script>

<style>
/* Global styles */
body {
  margin: 0;
  font-family: sans-serif;
  /* Apply dark theme background and default text color */
  @apply bg-gray-900 text-gray-200;
}
</style>
