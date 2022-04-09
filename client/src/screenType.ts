import { useState, useEffect } from 'react';

import { SCREEN_TYPE } from './constants/screen';

const MOBILE_THRESHOLD = 480;
const TABLET_THRESHOLD = 1024;
const SMALL_DESKTOP_THRESHOLD = 1280;

function getWindowSize(): { width: number; height: number } {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>(getWindowSize());

  useEffect(() => {
    function handleResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export function useCurrentScreenType(): { screenType: string } {
  const { width } = useWindowSize();

  if (width <= MOBILE_THRESHOLD) return { screenType: SCREEN_TYPE.MOBILE };
  if (width > MOBILE_THRESHOLD && width < TABLET_THRESHOLD)
    return { screenType: SCREEN_TYPE.TABLET };
  return { screenType: SCREEN_TYPE.DESKTOP };
}

export function useCheckIfDesktop(): boolean {
  const { width } = useWindowSize();

  return width >= TABLET_THRESHOLD;
}

export function useCheckIfSmallDesktop(): boolean {
  const { width } = useWindowSize();

  return width >= TABLET_THRESHOLD && width < SMALL_DESKTOP_THRESHOLD;
}
