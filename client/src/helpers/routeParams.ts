import { History } from 'history';

export const convertParamsToObject = (
  url: string,
): { [paramKey: string]: any } => {
  if (url.length === 0) return {};
  const arr = url.slice(1).split(/&|=/);
  const params: { [name: string]: string } = {};

  for (let i = 0; i < arr.length; i += 2) {
    const key = arr[i];
    const value = arr[i + 1];
    params[key] = value;
  }
  return params;
};

export const addLocationQuery = (history: History) => {
  history.location = Object.assign(history.location, {
    query: convertParamsToObject(history.location.search),
  });
};
