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
  fields.move(result.source.index, result.destination.index);
};
