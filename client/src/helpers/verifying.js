export const isEmpty = target => {
  /* eslint-disable */
  for (const key in target) {
    /* eslint-enable */
    return false;
  }

  return true;
};

export const omit = (propsToOmit, target) => {
  return Object.keys(target).reduce((acc, key) => {
    if (!propsToOmit.includes(key)) {
      acc[key] = target[key];
    }
    return acc;
  }, {});
};
