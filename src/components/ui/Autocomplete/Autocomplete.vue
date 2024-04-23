<script setup lang="ts">
import { ref, watch } from 'vue';

import BaseTag from '@components/ui/BaseTag.vue';
import RegisteredEntityItem from '@components/ui/RegisteredEntityItem.vue';

import { useClickOutside } from '@/composables/useClickOutside';

const props = defineProps(['modelValue', 'items']);
const emit = defineEmits(['update:modelValue', 'custom-suggestions-request', 'reset-suggestion-list']);

const query = ref('');
const currentOptionIndex = ref(0);
const selectedOption = ref(null);
const isDropdownVisible = ref(false);

const options: HTMLLIElement[] = [];
const suggestionListRef = ref<HTMLElement | null>(null);
const autocompleteRef = ref<HTMLElement | null>(null);

useClickOutside(
  autocompleteRef,
  () => {
    isDropdownVisible.value = false
  },
);

watch(query, (newQuery: string) => {
  if (newQuery.length <= 3 || !newQuery.length) {
    emit('reset-suggestion-list');
    isDropdownVisible.value = false;
    return;
  }

  emit('custom-suggestions-request', newQuery);
  isDropdownVisible.value = true;
});

watch(selectedOption, (newSelectedOption) => {
  currentOptionIndex.value = 0;
  emit('update:modelValue', newSelectedOption?.alias || '');
});

const scrollToOption = () => {
  const currentOptionScrollTop = options?.[currentOptionIndex.value]?.offsetTop;

  if (!suggestionListRef.value) {
    return;
  }

  suggestionListRef.value.scrollTo({
    top: currentOptionScrollTop
  });
}

const clearQuery = () => {
  query.value = '';
}

const removeTagHandler = () => {
  selectedOption.value = null;
}

const onUpKeyDownHandler = () => {
  if (currentOptionIndex.value > 0) {
    currentOptionIndex.value--;
    scrollToOption();
  }
}

const onDownKeyDownHandler = () => {
  if (currentOptionIndex.value < props.items.length - 1) {
    currentOptionIndex.value++;
    scrollToOption();
  }
}

const onEnterKeyDownHandler = () => {
  const currentItem = props.items[currentOptionIndex.value];

  selectedOption.value = currentItem;
  clearQuery();
}

const selectItemHandler = (item) => {
  selectedOption.value = item;
  clearQuery();
}
</script>

<template>
<div class="autocomplete" ref="autocompleteRef">
  <input type="hidden" :value="props.modelValue" class="autocomplete__hidden-input">

  <div class="autocomplete__wrapper">
    <BaseTag v-show="!!props.modelValue" @click="removeTagHandler">{{ `@${props.modelValue}` }}</BaseTag>

    <input 
      type="text"
      v-model="query"
      @keydown.up.prevent="onUpKeyDownHandler"
      @keydown.down.prevent="onDownKeyDownHandler"
      @keydown.enter.prevent="onEnterKeyDownHandler"
      @focus="isDropdownVisible = true"
      class="autocomplete__input"
    >
  </div>

  <ul class="autocomplete__suggestions" v-show="props.items.length && isDropdownVisible" ref="suggestionListRef">
    <li 
      v-for="item, index in items"
      :key="item.alias"
      class="autocomplete__suggestions-item"
      :class="{ 'autocomplete__suggestions-item--active': currentOptionIndex === index }"
      @click="() => selectItemHandler(item)"
      @mouseenter="() => currentOptionIndex = index"
      @mouseleave="() => currentOptionIndex = 0"
      :ref="(element) => options[index] = element"
    >
      <RegisteredEntityItem :data="item" />
    </li>
  </ul>
</div>
</template>

<style scoped>
.autocomplete {
  width: 100%;
  max-width: 400px;
  position: relative;
}

.autocomplete__wrapper {
  border: 1px solid var(--neutral);
  border-radius: var(--roundS);
  display: flex;
  align-items: stretch;
  height: 48px;
  padding: 4px;
}

.autocomplete__input {
  height: 100%;
  border: none;
  outline: none;
  padding: 0 4px;
}

.autocomplete__suggestions-item--active {
  background-color: var(--neutral);
}

.autocomplete__suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style-type: none;
  box-shadow: var(--boxShadowDefault);
  height: calc(72px * 4);
  overflow: auto;
}
</style>