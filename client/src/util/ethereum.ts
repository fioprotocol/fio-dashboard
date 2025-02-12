import { log } from './general';

export const isMetaMask = () => {
  try {
    return window.ethereum?.isMetaMask;
  } catch (error) {
    log.error('Error checking MetaMask:', error);
    return false;
  }
};

export const isOpera = () => {
  try {
    return window.ethereum?.isOpera;
  } catch (error) {
    log.error('Error checking Opera wallet:', error);
    return false;
  }
};
