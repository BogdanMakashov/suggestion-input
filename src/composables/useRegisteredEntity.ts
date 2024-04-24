import { ref } from 'vue';

import { debounce } from '@/helpers';
import type { RegisteredEntityList } from '@/types';

export const useRegisteredEntity = () => {
  const registeredEntityList = ref<RegisteredEntityList>([]);
  const isLoading = ref(false);
  const hasError = ref(false);

  const getRegisteredEntityList = debounce(async (query: string) => {
    try {
      isLoading.value = true;
      const response = await fetch(`https://habr.com/kek/v2/publication/suggest-mention?q=${query}`);
      const { data } = await response.json();

      if (!data) {
        throw new Error('Ошибка получения данных');
      }

      registeredEntityList.value = data;
    } catch (error) {
      hasError.value = true;
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  }, 150);

  const resetRegisteredEntityList = () => {
    registeredEntityList.value = [];
  };

  return {
    registeredEntityList,
    getRegisteredEntityList,
    resetRegisteredEntityList,
    isLoading,
    hasError,
  };
};
