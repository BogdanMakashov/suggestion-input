<template>
<span class="base-loader"></span>
</template>

<style scoped>
.base-loader {
  width: 32px;
  height: 32px;
  border: 4px solid var(--neutral);
  border-bottom-color: var(--secondary);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
      transform: rotate(0deg);
  }
  100% {
      transform: rotate(360deg);
  }
}
</style>