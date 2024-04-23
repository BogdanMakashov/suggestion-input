import { onMounted, onBeforeUnmount, Ref } from 'vue';

export const useClickOutside = (component: Ref<HTMLElement | null>, callback: () => void) => {
  if (!component || !callback) {
    throw new Error('Не указан компонент или callback');
  }

  const listener = (event: Event) => {
    const { value: refElement } = component;

    if (!refElement || event.target === refElement || event.composedPath().includes(refElement)) {
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
