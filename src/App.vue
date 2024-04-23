<script setup lang="ts">
import { ref, watch } from 'vue';
// import SuggestionBox from '@components/ui/SuggestionBox/SuggestionBox.vue';
import { useRegisteredEntity } from '@/composables/useRegisteredEntity';
import Autocomplete from '@components/ui/Autocomplete/Autocomplete.vue';

const { registeredEntityList, getRegisteredEntityList, resetRegisteredEntityList } = useRegisteredEntity();
const query = ref('');
const selectedEntity = ref('');

// watch(query, async (query: string) => {
//   if (query.length <= 3 || !query.length) {
//     //TODO: Подумать над тем, чтобы не было лишних перерисовок
//     resetRegisteredEntityList();
//     return;
//   }

//   getRegisteredEntityList(query);
// });

</script>

<template>
  <div class="container">
    <!-- <SuggestionBox 
      id="user-or-company"
      label="Пользователь или компания"
      :items="registeredEntityList"
      v-model="query"
      isRequired
    /> -->
    <Autocomplete 
      v-model="selectedEntity"
      :items="registeredEntityList"
      @custom-suggestions-request="getRegisteredEntityList" 
      @reset-suggestion-list="resetRegisteredEntityList" 
    />
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