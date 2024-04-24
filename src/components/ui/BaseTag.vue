<script setup lang="ts">
const emit = defineEmits(['click']);

const onClickHandler = () => {
  emit('click');
}
</script>

<template>
  <span class="base-tag">
    <slot />

    <button class="base-tag__remove-button" @click="onClickHandler">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 25 25" fill="none">
        <path d="M3 21.32L21 3.32001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 3.32001L21 21.32" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </span>
</template>

<style scoped>
.base-tag {
  display: flex;
  align-items: center;
  border-radius: var(--roundS);
  padding: 4px;
  background-color: var(--tagDefault);
  font-size: 14px;
  color: var(--lightPrimary);
}

.base-tag__remove-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  width: 24px;
  height: 24px;
  color: var(--lightPrimary);
  cursor: pointer;
}
</style>
