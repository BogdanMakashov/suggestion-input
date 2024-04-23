<script setup lang="ts">
import { ref, watch } from 'vue';

import { debounce } from '@/helpers';
import type { SuggestionList as SuggestionListType } from '@/types';

import SuggestionList from './SuggestionList.vue';
import BaseChip from '@/components/ui/BaseTag.vue';

defineProps<{
  label: string,
  id: string, // TODO: подумать как улчучшить
  isRequired: boolean
}>()

const suggestionList = ref<SuggestionListType>([]);
const query = ref('');
const selected = ref('');
const isSuggestionListVisible = ref(false);
const currentFocusedIndex = ref(0);

const getSuggestions = debounce(async (suggestionQuery: string) => {
  try {
    const response = await fetch(`https://habr.com/kek/v2/publication/suggest-mention?q=${suggestionQuery}`);
    const { data } = await response.json();

    if (!data) {
      throw new Error('Ошибка получения данных');
    }

    suggestionList.value = data;
    isSuggestionListVisible.value = true;
  } catch (error) {
    console.error(error);
  }
}, 150);

watch(query, async (newQuery: string) => {
  if (newQuery.length <= 3 || !newQuery.length) { //TODO: Подумать над тем, чтобы не было лишних перерисовок
    suggestionList.value = [];
    isSuggestionListVisible.value = false;
    return;
  }

  getSuggestions(newQuery);
});

const suggestionSelectHandler = (alias: string) => {
  selected.value = alias;
  isSuggestionListVisible.value = false;
  query.value = '';
}
</script>

<template>
  <div class="suggestion-box" @keydown.esc.exact="isSuggestionListVisible = false">
    <label :for="id" class="suggestion-box__label">
      <span class="suggestion-box__is-required">*</span>
      {{ label }}
    </label>

    <div class="suggestion-box__container">
      <BaseChip v-if="selected" @click="selected = ''">{{ selected }}</BaseChip>

      <input :id="id" :name="id" type="text" v-model="query" class="suggestion-box__input"
        @focus="isSuggestionListVisible = true" @keydown.up.exact="currentFocusedIndex--" @keydown.down.exact="currentFocusedIndex++" />
    </div>

    <div class="suggestion-box__suggestion-list-wrapper">
      <SuggestionList v-if="isSuggestionListVisible && suggestionList.length" :suggestion-list="suggestionList"
        @suggestion-select="suggestionSelectHandler" />
    </div>

    <input :value="selected" class="suggestion-box__hidden-input" />
  </div>
</template>

<style scoped>
.suggestion-box {
  position: relative;
  width: 100%;
}

.suggestion-box__label {
  display: block;
  margin-bottom: 16px;
}

.suggestion-box__is-required {
  color: red;
}

.suggestion-box__input {
  width: 100%;
  padding: 0 4px;
  border: none;
  outline: none;
  margin-left: 8px;
}

.suggestion-box__container {
  display: flex;
  align-items: center;
  border: 1px solid #e2e2e2;
  padding: 8px;
  border-radius: 4px;
  height: 40px;
}

.suggestion-box__hidden-input {
  visibility: hidden;
  position: absolute;
}

.suggestion-box__suggestion-list-wrapper {
  position: absolute;
  top: 100;
  left: 0;
  width: 100%;
}
</style>
