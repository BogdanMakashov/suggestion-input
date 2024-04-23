import { onMounted, onBeforeUnmount, Ref } from 'vue';

export const useClickOutside = (component: Ref<HTMLElement>, callback: () => void) => {
  if (!component || !callback) {
    throw new Error('Не указан компонент или callback');
  }

  const listener = (event: Event) => {
    if (event.target === component.value || event.composedPath().includes(component.value)) {
      return;
    }
    if (typeof callback === 'function') {
      callback();
    }
  };

  onMounted(() => {
    window.addEventListener('click', listener);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('click', listener);
  });
};
