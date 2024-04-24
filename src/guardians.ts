export const isItem = <T>(val: any): val is T => {
  return (val as T) !== undefined;
};

export const isHtmlLiElement = (val: any): val is HTMLLIElement => {
  return (val as HTMLLIElement) !== undefined;
};

export const isKeyOfItem = <T>(val: any): val is keyof T => {
  return (val as keyof T) !== undefined;
};
