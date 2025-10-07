export const programmaticallyPause = () => new Promise<void>(resolve => setTimeout(resolve, 1000));
