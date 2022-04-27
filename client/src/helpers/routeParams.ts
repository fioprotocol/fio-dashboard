import { History } from 'history';

import { AnyType } from '../types';

export const convertParamsToObject = (
  url: string,
): { [paramKey: string]: AnyType } => {
  if (url.length === 0) return {};
  const arr = url.slice(1).split(/&|=/);
  const params: { [name: string]: string } = {};

  for (let i = 0; i < arr.length; i += 2) {
    const key = arr[i];
    params[key] = arr[i + 1];
  }
  return params;
};

export const addLocationQuery = (history: History): void => {
  history.location = Object.assign(history.location, {
    query: convertParamsToObject(history.location.search),
  });
};
