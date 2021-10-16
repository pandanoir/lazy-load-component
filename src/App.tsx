import {
  useEffect,
  useState,
  useCallback,
  Children,
  useRef,
  VFC,
  PropsWithChildren,
} from 'react';
import { HeightContext, IndexContext } from './contexts';
import { useShown } from './useShown';
import { useUpdateHeight } from './useUpdateHeight';

/**
 * height store をつなぐ処理と、index を各要素に与えるためのラッパー
 */
const LazyLoadWrapper: VFC<PropsWithChildren<{}>> = ({ children }) => {
  const [height, setHeight] = useState<number[]>([]);
  const updateHeight = useCallback((index: number, height: number) => {
    setHeight((arr) => {
      const newValue = arr.concat();
      newValue[index] = height;
      return newValue;
    });
  }, []);
  return (
    <HeightContext.Provider value={[height, updateHeight]}>
      {Children.map(children, (child, index) => (
        <IndexContext.Provider value={index} key={index}>
          {child}
        </IndexContext.Provider>
      ))}
    </HeightContext.Provider>
  );
};

/**
 * 遅延読み込みされるコンポーネント
 */
const Child: VFC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const shown = useShown({
    shouldRender: (totalHeight, index) => {
      return index < 3 || totalHeight < 3 * window.innerHeight + window.scrollY;
    },
  });
  const updateHeight = useUpdateHeight();
  const height = useRef((Math.floor(Math.random() * 9) + 1) * 100).current;

  useEffect(() => {
    if (divRef.current && shown) {
      updateHeight(divRef.current.clientHeight);
    }
  }, [shown, updateHeight]);

  if (!shown) {
    return null;
  }
  return (
    <div style={{ width: 300, height, border: '1px solid black' }} ref={divRef}>
      element(height: {height}px)
    </div>
  );
};

export const App = () => {
  return (
    <LazyLoadWrapper>
      <Child />
      <Child />
      <Child />
      <Child />
      <Child />
    </LazyLoadWrapper>
  );
};
