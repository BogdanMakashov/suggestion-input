<script setup lang="ts">
import { computed } from 'vue';
import type { RegisteredEntity } from '@/types';
import { RegisteredEntityType } from '@/enums';
import noPhoto from '@assets/no-photo.png';

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
      <img :src="data.avatar || noPhoto" alt="" class="registered-entity-item__avatar">
    </div>

    <div class="registered-entity-item__content-wrapper">
      <div class="registered-entity-item__name">{{ data.name || data.alias }}</div>
      <div class="registered-entity-item__description">{{ description }}</div>
    </div>
  </div>
</template>

<style scoped>
.registered-entity-item {
  display: flex;
  align-items: center;
  padding: 16px;
}

.registered-entity-item__avatar-wrapper {
  margin-right: 12px;
  width: 40px;
  height: 40px;
}

.registered-entity-item__avatar {
  max-width: 40px;
  max-height: 40px;
  object-fit: cover;
}

.registered-entity-item__name {
  color: var(--textDarker);
}

.registered-entity-item__description {
  color: var(--textDefault);
}
</style>
