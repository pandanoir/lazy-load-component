import { useContext, useCallback } from 'react';
import { IndexContext, HeightContext } from './contexts';

/**
 * コンポーネントの高さをストアへ伝えるためのフック。
 */
export const useUpdateHeight = () => {
  const index = useContext(IndexContext);
  const [, setHeight] = useContext(HeightContext);
  return useCallback(
    (height: number) => setHeight(index, height),
    [index, setHeight]
  );
};
