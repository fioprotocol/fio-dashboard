export const isEmpty = (target: any): boolean => {
  /* eslint-disable */
  // @ts-ignore
  for (const key in target) {
    /* eslint-enable */
    return false;
  }

  return true;
};

export const omit = (propsToOmit: string[], target: any): any => {
  return Object.keys(target).reduce((acc: any, key: string) => {
    if (!propsToOmit.includes(key)) {
      acc[key] = target[key];
    }
    return acc;
  }, {});
};
