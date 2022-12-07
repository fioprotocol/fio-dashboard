import { ReduxState } from './redux/init';
import { AnyObject } from './types';

export const parseState = (serializedState: string): AnyObject | undefined => {
  try {
    if (!serializedState) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const loadState = (): AnyObject | undefined => {
  try {
    const serializedState = localStorage.getItem('state');
    return parseState(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state: ReduxState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};
