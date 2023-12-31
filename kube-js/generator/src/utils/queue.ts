export const queue = async <TData>(
  data: TData[],
  cb: (data: TData, queue: TData[]) => Promise<void>
) => {
  const cache = new Set<TData>();
  const queue = data.slice();

  const next = async () => {
    const datum = queue.shift();
    if (!datum) return;
    if (cache.has(datum)) return;
    cache.add(datum);
    await cb(datum, queue);
    await next();
  };

  await Promise.all(Array.from({ length: 10 }).map(next));
};
