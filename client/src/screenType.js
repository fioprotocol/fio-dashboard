import { useState, useEffect } from 'react';
import { SCREEN_TYPE } from './constants/screen';

function getWindowSize() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export function currentScreenType() {
  const { width } = useWindowSize();

  if (width <= 480) return { screenType: SCREEN_TYPE.MOBILE };
  if (width > 480 && width < 1024) return { screenType: SCREEN_TYPE.TABLET };
  return { screenType: SCREEN_TYPE.DESKTOP };
}

export const isDesktop = () => {
  const { screenType } = currentScreenType();
  return screenType === SCREEN_TYPE.DESKTOP;
};
