<script setup lang="ts">
import { computed } from 'vue';
import type { RegisteredEntity } from '@/types';
import { RegisteredEntityType } from '@/enums';

const props = defineProps<{
  data: RegisteredEntity
}>();

const description = computed(() => {
  return props.data.type === RegisteredEntityType.Company ? 'Компания' : `@${props.data.alias}`;
})
</script>

<template>
  <div class="registered-entity-item">
    <div class="registered-entity-item__avatar-wrapper">
      <img :src="data.avatar || ''" alt="" class="registered-entity-item__avatar">
    </div>

    <div class="registered-entity-item__content-wrapper">
      <div class="registered-entity-item__name">{{ data.name || data.alias }}</div>
      <div class="registered-entity-item__description">{{ description }}</div>
    </div>
  </div>
</template>

<style scoped>
.registered-entity-item {
  padding: 16px;
  display: flex;
  align-items: center;
}

.registered-entity-item__avatar-wrapper {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

.registered-entity-item__avatar {
  max-width: 40px;
  max-height: 40px;
  object-fit: cover;
}

.registered-entity-item__name {
  font-weight: 500;
}

.registered-entity-item__description {
  color: #a2a2a2;
}
</style>
