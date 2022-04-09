import { AnyObject } from '../types';

export const isEmpty = (target: object): boolean => {
  // @ts-ignore // works as expected
  for (const key in target) {
    return false;
  }

  return true;
};

export const omit = (propsToOmit: string[], target: AnyObject): AnyObject => {
  return Object.keys(target).reduce((acc: AnyObject, key: string) => {
    if (!propsToOmit.includes(key)) {
      acc[key] = target[key];
    }
    return acc;
  }, {});
};
