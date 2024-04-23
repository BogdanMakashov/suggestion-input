<script setup lang="ts">
import { computed } from 'vue';
import type { SuggestionListItem } from '@/types';
import { SuggestionType } from '@/enums';

const props = defineProps<{
  data: SuggestionListItem
  isFocused: boolean
}>();

const description = computed(() => {
  return props.data.type === SuggestionType.Company ? 'Компания' : `@${props.data.alias}`;
})
</script>

<template>
  <div class="suggestion-list-item" :class="{'suggestion-list-item--focused': isFocused}">
    <div class="suggestion-list-item__avatar-wrapper">
      <img :src="data.avatar || ''" alt="" class="suggestion-list-item__avatar">
    </div>

    <div class="suggestion-list-item__content-wrapper">
      <div class="suggestion-list-item__name">{{ data.name || data.alias }}</div>
      <div class="suggestion-list-item__description">{{ description }}</div>
    </div>
  </div>
</template>

<style scoped>
/* TODO: Сделать порядок свойств */

.suggestion-list-item {
  padding: 16px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #e2e2e2;
  }
}

.suggestion-list-item--focused {
  background-color: #e2e2e2;
}

.suggestion-list-item__avatar-wrapper {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

.suggestion-list-item__avatar {
  max-width: 40px;
  max-height: 40px;
  object-fit: cover;
}

.suggestion-list-item__name {
  font-weight: 500;
}

.suggestion-list-item__description {
  color: #a2a2a2;
}
</style>
