declare module 'popular-english-words' {
  export const words: {
    getMostPopular: (count: number) => string[];
  };
}
