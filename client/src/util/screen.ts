import { isSafari } from 'react-device-detect';

import { PRINT_SCREEN_PARAMS } from '../constants/screen';

export const getPagePrintScreenDimensions = (params?: {
  isPrint?: boolean;
}) => {
  const { isPrint } = params || {};

  if (isSafari && isPrint) return PRINT_SCREEN_PARAMS.safari;

  return PRINT_SCREEN_PARAMS.default;
};

export const getIsPageVisible = () => document.visibilityState === 'visible';
