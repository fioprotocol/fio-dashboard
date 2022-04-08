export const isEmpty = (target: any): boolean => {
  // @ts-ignore // works as expected
  for (const key in target) {
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
