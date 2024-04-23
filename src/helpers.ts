export const debounce = <T extends (...args: any[]) => any>(
  callback: T,
  ms: number
) => {
  let timer: number | null = null;

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => callback(...args), ms);
  };
};
