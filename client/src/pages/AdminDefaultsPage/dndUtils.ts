import { DropResult } from 'react-beautiful-dnd';
import { FieldArrayRenderProps } from 'react-final-form-arrays';

import { Rankable } from '../../api/responses';

type FieldsType = FieldArrayRenderProps<Rankable, HTMLElement>['fields'];

export const makeOnDragEndFunction = (fields: FieldsType) => (
  result: DropResult,
) => {
  if (!result.destination) {
    return;
  }
  const source = fields.value[result.source.index];
  const dest = fields.value[result.destination.index];

  fields.update(result.source.index, {
    ...source,
    rank: result.destination.index + 1,
  });

  fields.update(result.destination.index, {
    ...dest,
    rank: result.source.index + 1,
  });

  fields.swap(result.source.index, result.destination.index);
};
