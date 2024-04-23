<script setup lang="ts">
import SuggestionListItem from './SuggestionListItem.vue';
import type { SuggestionList } from '@/types';

defineProps<{
  suggestionList: SuggestionList;
}>();

const emit = defineEmits(['suggestion-select']);

const handleSuggestionSelect = (alias: string) => {
  emit('suggestion-select', `@${alias}`);
};
</script>

<template>
  <ul class="suggestion-list" role="listbox">
    <li
      v-for="suggestion, index in suggestionList"
      :key="suggestion.alias"
      tabindex="-1"
      class="suggestion-list__item"
      :isFocused="currentFocusedIndex === index"
      role="option"
      @click="() => handleSuggestionSelect(suggestion.alias)"
    >
      <SuggestionListItem :data="suggestion" :isFocused="currentFocusedIndex === index" />
    </li>
  </ul>
</template>

<style scoped>
.suggestion-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
  box-shadow: var(--boxShadowDefault);
  height: calc(72px * 4);
  overflow: auto;
}
</style>
