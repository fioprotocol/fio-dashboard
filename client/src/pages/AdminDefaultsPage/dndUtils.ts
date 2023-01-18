export const makeOnDragEndFunction = (fields: any) => (result: any) => {
  if (!result.destination) {
    return;
  }
  const length = fields.value.length;
  const source = fields.value[result.source.index];
  const dest = fields.value[result.destination.index];

  fields.update(result.source.index, {
    ...source,
    rank: length - result.destination.index,
  });

  fields.update(result.destination.index, {
    ...dest,
    rank: length - result.source.index,
  });

  fields.swap(result.source.index, result.destination.index);
};
