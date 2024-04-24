<script setup lang="ts" generic="T">
import { ref, watch, computed } from 'vue';

import type { ComponentPublicInstance } from 'vue';
import type { SuggestionItem } from '@/types';

import { getUniqueId } from '@/helpers';
import { isItem, isHtmlLiElement, isKeyOfItem } from '@/guardians';
import { useClickOutside } from '@/composables/useClickOutside';

import BaseTag from '@components/ui/BaseTag.vue';

const props = defineProps<{
  modelValue: T,
  items: T[],
  tagDisplayKey: string,
  label: string,
  isRequired?: boolean,
  id: string,
  name: string
}>();
const emit = defineEmits(['update:modelValue', 'custom-suggestions-request', 'reset-suggestion-list']);

const query = ref('');
const currentOptionIndex = ref(0);
const isDropdownVisible = ref(false);
const suggestionListRef = ref<HTMLElement | null>(null);
const autocompleteRef = ref<HTMLElement | null>(null);
const options = ref<HTMLLIElement[]>([]);

useClickOutside(autocompleteRef, () => isDropdownVisible.value = false);

watch(query, (newQuery: string) => {
  if (newQuery.length <= 3 || !newQuery.length) {
    emit('reset-suggestion-list');
    isDropdownVisible.value = false;
    return;
  }

  emit('custom-suggestions-request', newQuery);
  isDropdownVisible.value = true;
});

const itemsWithKeys = computed(() => {
  return props.items.map((item) => ({
    ...item,
    _key: getUniqueId(),
  }))
});

const itemHeight = computed(() => {
  return `${options.value[0]?.getBoundingClientRect().height}px` || 0;
});

const scrollToOption = () => {
  const currentOptionScrollTop = options?.value?.[currentOptionIndex.value]?.offsetTop;

  if (!suggestionListRef.value) {
    return;
  }

  suggestionListRef.value.scrollTo({
    top: currentOptionScrollTop
  });
}

const cleanItemFromKey = (itemWithKey: SuggestionItem<T>) => {
  const { _key, ...item} = itemWithKey;

  if (isItem<T>(item)) {
    return item;
  }
}

const clearQuery = () => {
  query.value = '';
}

const removeTagHandler = () => {
  emit('update:modelValue', null);
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
  const currentItem = props.items[currentOptionIndex.value] || null;

  if (!currentItem) {
    return;
  }

  emit('update:modelValue', currentItem);
  
  clearQuery();
}

const selectItemHandler = (item: SuggestionItem<T> | null) => {
  if (!item) {
    return;
  }

  emit('update:modelValue', cleanItemFromKey(item));

  clearQuery();
}

const computedTagLabel = computed(() => {
  if (isKeyOfItem<T>(props.tagDisplayKey)) {
    return `@${props.modelValue?.[props.tagDisplayKey]}`;
  }
});

const setListItemRef = (element: Element | ComponentPublicInstance | null, index: number) => {
  if (isHtmlLiElement(element)) {
    options.value[index] = element;
  }
}
</script>

<template>
<div class="autocomplete" ref="autocompleteRef">
  <input 
    type="hidden" 
    :value="props.modelValue" 
    class="autocomplete__hidden-input" 
    :required="isRequired"
  >

  <label :for="id" class="autocomplete__label">
    <span class="autocomplete__required-star" v-if="isRequired">*</span>
    {{ label }}
  </label>

  <div class="autocomplete__wrapper">
    <BaseTag 
      v-show="!!props.modelValue" 
      @click="removeTagHandler"
    >
      {{ computedTagLabel }}
    </BaseTag>

    <input 
      type="text"
      v-model="query"
      @keydown.up.prevent="onUpKeyDownHandler"
      @keydown.down.prevent="onDownKeyDownHandler"
      @keydown.enter.prevent="onEnterKeyDownHandler"
      @focus="isDropdownVisible = true"
      class="autocomplete__input"
      :name="name"
      :id="id"
    >
  </div>

  <ul 
    class="autocomplete__suggestions" 
    v-show="props.items.length && isDropdownVisible" 
    ref="suggestionListRef" 
    role="listbox"
  >
    <li 
      v-for="item, index in itemsWithKeys"
      :key="item._key"
      class="autocomplete__suggestions-item"
      :class="{ 'autocomplete__suggestions-item--active': currentOptionIndex === index }"
      :ref="(element) => setListItemRef(element, index)"
      @click="() => selectItemHandler(item)"
      @mouseenter="() => currentOptionIndex = index"
      @mouseleave="() => currentOptionIndex = 0"
    >
      <slot name="item" v-bind="item"></slot>
    </li>
  </ul>
</div>
</template>

<style scoped>
.autocomplete {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.autocomplete__wrapper {
  display: flex;
  align-items: stretch;
  border: 1px solid var(--neutral);
  border-radius: var(--roundS);
  height: 48px;
  padding: 4px;
}

.autocomplete__input {
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  padding: 0 4px;
}

.autocomplete__suggestions-item--active {
  background-color: var(--neutral);
}

.autocomplete__suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  overflow: auto;
  margin: 0;
  box-shadow: var(--boxShadowDefault);
  width: 100%;
  height: calc(v-bind(itemHeight) * 4);
  padding: 0;
  list-style-type: none;
}

.autocomplete__label {
  display: inline-block;
  margin-bottom: 12px;
}

.autocomplete__required-star {
  color: var(--requireStar);
}
</style>