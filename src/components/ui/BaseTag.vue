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
  padding: 4px;
  background-color: var(--tagDefault);
  color: var(--lightPrimary);
  display: flex;
  align-items: center;
  border-radius: var(--roundS);
  font-size: 14px;
}

.base-tag__remove-button {
  background: none;
  border: none;
  padding: 0;
  color: var(--lightPrimary);
  height: 24px;
  width: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
