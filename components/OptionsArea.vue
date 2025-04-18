<script setup lang="ts">
// Define the structure for an option expected in the prop
interface Option {
  letters: string;
  id: string | number;
}

defineProps<{
  options: Option[];
}>();

// Emits will be handled in Phase 4
// const emit = defineEmits(['selectOption']);
</script>

<template>
  <div class="options-area bg-orange-900/30 p-6 rounded-lg min-h-[250px] relative">
    <!-- Layout for Option Items -->
    <div class="flex flex-wrap justify-center items-center gap-4">
      <OptionItem
        v-for="option in options"
        :key="option.id"
        :letters="option.letters"
        :id="option.id"
        @select="$emit('selectOption', $event)"
      />
    </div>
    <!-- Background dots will be added later -->
  </div>
</template>

<style scoped>
/* Scoped styles for OptionsArea if needed */
</style>
