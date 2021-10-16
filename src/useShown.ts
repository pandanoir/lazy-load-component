import { useContext, useState, useEffect, useMemo } from 'react';
import { IndexContext, HeightContext } from './contexts';

/**
 * 「表示するべきか否か」を返すフック。一度 shown が true になったら false になることはない。
 * height store の更新はしない。
 */
export const useShown = ({
  shouldRender = (totalHeight) =>
    totalHeight < 3 * window.innerHeight + window.scrollY,
}: {
  shouldRender?: (totalHeight: number, index: number) => boolean;
} = {}) => {
  const index = useContext(IndexContext),
    [height] = useContext(HeightContext),
    [shown, setShown] = useState(false),
    nextIndexToMount = useMemo(() => {
      const indexOfFirstUndefined = height.findIndex(
        (x) => typeof x === 'undefined'
      );
      return indexOfFirstUndefined !== -1
        ? indexOfFirstUndefined
        : height.length;
    }, [height]),
    // 先頭から連続したマウント済み要素の高さの総和
    totalHeight = useMemo(
      () => height.slice(0, nextIndexToMount).reduce((a, b) => a + b, 0),
      [height, nextIndexToMount]
    );

  useEffect(() => {
    if (shown) {
      return;
    }
    if (nextIndexToMount === index && shouldRender(totalHeight, index)) {
      setShown(true);
    }
  }, [index, nextIndexToMount, shouldRender, shown, totalHeight]);
  useEffect(() => {
    if (shown) {
      return;
    }

    const listener = () => {
      if (nextIndexToMount === index && shouldRender(totalHeight, index)) {
        setShown(true);
      }
    };
    window.addEventListener('scroll', listener);
    return () => window.removeEventListener('scroll', listener);
  }, [height, index, nextIndexToMount, shouldRender, shown, totalHeight]);
  return shown;
};
