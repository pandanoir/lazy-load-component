import { createContext } from 'react';

export const HeightContext = createContext<
  [number[], (index: number, height: number) => void]
>([[], () => null]);
export const IndexContext = createContext(0);
