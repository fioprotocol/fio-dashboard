import { useState, useEffect } from 'react';
import { SCREEN_TYPE } from './constants/screen';

const MOBILE_THRESHOLD = 480;
const TABLET_THRESHOLD = 1024;

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

export function useCurrentScreenType() {
  const { width } = useWindowSize();

  if (width <= MOBILE_THRESHOLD) return { screenType: SCREEN_TYPE.MOBILE };
  if (width > MOBILE_THRESHOLD && width < TABLET_THRESHOLD)
    return { screenType: SCREEN_TYPE.TABLET };
  return { screenType: SCREEN_TYPE.DESKTOP };
}

export function useCheckIfDesktop() {
  const { width } = useWindowSize();

  return width >= TABLET_THRESHOLD;
}
