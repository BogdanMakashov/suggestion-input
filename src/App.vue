<script setup lang="ts">
import { ref } from 'vue';
import { useRegisteredEntity } from '@/composables/useRegisteredEntity';
import Autocomplete from '@components/ui/Autocomplete/Autocomplete.vue';
import RegisteredEntityItem from '@components/ui/RegisteredEntityItem.vue';

import { RegisteredEntity } from '@/types';

const { 
  registeredEntityList,
  getRegisteredEntityList,
  resetRegisteredEntityList,
  isLoading,
  hasError
} = useRegisteredEntity();
const selectedEntity = ref<RegisteredEntity | null>(null);
</script>

<template>
  <div class="container">
    <Autocomplete
      v-model="selectedEntity"
      isRequired
      id="company-or-user"
      label="Пользователь или компания"
      name="company-or-user"
      tagDisplayKey="alias"
      :items="registeredEntityList"
      :isLoading="isLoading"
      :hasError="hasError"
      @custom-suggestions-request="getRegisteredEntityList" 
      @reset-suggestion-list="resetRegisteredEntityList"
    >
      <template #item="item">
        <RegisteredEntityItem :data="item" />
      </template>
    </Autocomplete>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100svh;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
</style>