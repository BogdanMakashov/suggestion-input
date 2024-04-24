<script setup lang="ts" generic="T">
import { ref, toRaw, watch, computed } from 'vue';

import type { ComponentPublicInstance } from 'vue';
import type { SuggestionItem } from '@/types';

import { getUniqueId } from '@/helpers';
import { isItem, isHtmlLiElement, isKeyOfItem } from '@/guardians';
import { useClickOutside } from '@/composables/useClickOutside';

import BaseTag from '@components/ui/BaseTag.vue';
import BaseLoader from '@components/ui/BaseLoader.vue';

const props = defineProps<{
  modelValue: T[],
  items: T[],
  tagDisplayKey: string,
  label: string,
  isRequired?: boolean,
  id: string,
  name: string,
  isLoading: boolean,
  hasError: boolean,
  isMultiple?: boolean
}>();
const emit = defineEmits(['update:modelValue', 'custom-suggestions-request', 'reset-suggestion-list']);

const query = ref('');
const currentOptionIndex = ref(0);
const isDropdownVisible = ref(false);
const suggestionListRef = ref<HTMLElement | null>(null);
const autocompleteRef = ref<HTMLElement | null>(null);
const options = ref<HTMLLIElement[]>([]);

// const proxyModelValue = toRef(props, 'modelValue'); //TODO: Тут бы DeepClone добавить

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

const cleanItemFromKey = (itemWithKey: SuggestionItem<T>): T | void => {
  const { _key, ...item} = itemWithKey;

  if (!isItem<T>(item)) {
    return;
  }

  return item;
}

const clearQuery = () => {
  query.value = '';
}

const removeTagHandler = (tag: keyof T) => {
  const modelWithoutItem = props.modelValue.filter((modelItem) => {
    if (isKeyOfItem<T>(props.tagDisplayKey)) {
      return toRaw(modelItem)[props.tagDisplayKey] !== tag;
    }
  });

  emit('update:modelValue', modelWithoutItem);
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

const isModelIncludesItem = (item: T) => {
  return !!props.modelValue.find((modelItem) => {
    if (isKeyOfItem<T>(props.tagDisplayKey)) {
      return toRaw(modelItem)[props.tagDisplayKey] === item[props.tagDisplayKey];
    }
  });
}

const pushItemToModel = (item: T) => {
  if (!item || isModelIncludesItem(item)) {
    return;
  }

  const tempModel = !props.isMultiple && props.modelValue.length > 0 ? [] : props.modelValue.map((modelItem) => structuredClone(toRaw(modelItem)));

  tempModel.push(item);

  emit('update:modelValue', tempModel);

  clearQuery();
}

const onEnterKeyDownHandler = () => {
  const currentItem = props.items[currentOptionIndex.value] || null;

  if (!currentItem) {
    return;
  }

  if (currentItem) {
    pushItemToModel(currentItem);
  }
}

const selectItemHandler = (item: SuggestionItem<T> | null) => {
  if (!item) {
    return;
  }

  const cleanedItem = cleanItemFromKey(item);

  if (cleanedItem) {
    pushItemToModel(cleanedItem);
  }

}

const tagsFromModel = computed(() => {
  return props.modelValue.map((item) => {
    if (isKeyOfItem<T>(props.tagDisplayKey)) {
      return item[props.tagDisplayKey];
    }
  });
});

const displayedValueOfModel = computed(() => {
  return props.modelValue.map((item) => {
    if (isKeyOfItem<T>(props.tagDisplayKey)) {
      return item[props.tagDisplayKey];
    }
  }).join(', ');
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
    :value="displayedValueOfModel" 
    class="autocomplete__hidden-input" 
    :required="isRequired"
  >

  <label :for="id" class="autocomplete__label">
    <span class="autocomplete__required-star" v-if="isRequired">*</span>
    {{ label }}
  </label>

  <div class="autocomplete__wrapper" :class="{ 'autocomplete__wrapper--error': hasError }">
    <div class="autocomplete__tag" v-for="tag in tagsFromModel">
      <BaseTag @click="() => {
          if (isKeyOfItem(tag)) {
            removeTagHandler(tag);
          }
        }">
        {{ `@${tag}` }}
      </BaseTag>
    </div>

    <input
      tabindex="0"
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

    <div class="autocomplete__loader" v-show="isLoading">
      <BaseLoader />
    </div>
  </div>

  <ul 
    class="autocomplete__suggestions" 
    v-show="props.items.length && isDropdownVisible" 
    ref="suggestionListRef" 
    role="listbox"
  >
    <li 
      v-for="item, index in itemsWithKeys"
      role="option"
      class="autocomplete__suggestions-item"
      :key="item._key"
      :class="{ 
        'autocomplete__suggestions-item--active': currentOptionIndex === index, 
        'autocomplete__suggestions-item--selected': isModelIncludesItem(item) 
      }"
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
  align-items: center;
  flex-wrap: wrap;
  border: 1px solid var(--neutral);
  border-radius: var(--roundS);
  min-height: 48px;
  padding: 4px;
  position: relative;
  gap: 4px;
}

.autocomplete__wrapper--error {
  border-color: var(--red);
}

.autocomplete__input {
  border: none;
  outline: none;
  height: 100%;
  flex: 1;
}

.autocomplete__suggestions-item {
  cursor: pointer;
}

.autocomplete__suggestions-item--active {
  background-color: var(--neutral);
}

.autocomplete__suggestions-item--selected {
  background-color: var(--secondary);
  cursor: not-allowed;
}

.autocomplete__suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  overflow: auto;
  margin: 0;
  box-shadow: var(--boxShadowDefault);
  width: 100%;
  height: calc(72px * 4);
  padding: 0;
  list-style-type: none;
}

.autocomplete__label {
  display: inline-block;
  margin-bottom: 12px;
}

.autocomplete__required-star {
  color: var(--red);
}

.autocomplete__loader {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translate(0, -50%);
}
</style>