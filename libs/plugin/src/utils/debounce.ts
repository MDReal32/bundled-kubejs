export const debounce = <TFn extends (...args: any[]) => void>(fn: TFn, ms = 150) => {
  let t: NodeJS.Timeout | null = null;
  return (...args: Parameters<TFn>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};
