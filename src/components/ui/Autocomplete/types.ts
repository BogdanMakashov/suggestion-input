export type SuggestionItem<T> = T & {
  _key: string;
};

export type AutoCompleteProps<T> = {
  modelValue: T[];
  items: T[];
  tagDisplayKey: string;
  label: string;
  isRequired?: boolean;
  id: string;
  name: string;
  isLoading: boolean;
  hasError: boolean;
  isMultiple?: boolean;
  itemsWithoutScroll?: number;
};
