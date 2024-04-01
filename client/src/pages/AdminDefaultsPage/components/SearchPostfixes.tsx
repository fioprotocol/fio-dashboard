import React, { useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { FormApi } from 'final-form';
import { Field } from 'react-final-form';
import { FieldArray, FieldArrayRenderProps } from 'react-final-form-arrays';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import TextInput, {
  INPUT_UI_STYLES,
} from '../../../components/Input/TextInput';

import { makeOnDragEndFunction } from '../dndUtils';
import { useRearrangeRanks } from '../useRearrangeRanks';

import { AdminDefaultsRequest, SearchTerm } from '../../../api/responses';

import classes from '../styles/AdminDefaultsPage.module.scss';

interface SearchPostfixesProps {
  form: FormApi<AdminDefaultsRequest>;
}

type FieldsType = FieldArrayRenderProps<SearchTerm, HTMLElement>['fields'];

const FIELD_ARRAY_KEY = 'searchPostfixes';

const SearchPostfixes: React.FC<SearchPostfixesProps> = ({ form }) => {
  useRearrangeRanks(FIELD_ARRAY_KEY, form);

  const addNewEntry = useCallback(() => {
    const numberOfItems = form.getFieldState(FIELD_ARRAY_KEY).value.length + 1;
    form.mutators.push(FIELD_ARRAY_KEY, {
      term: '',
      isPrefix: false,
      rank: numberOfItems,
    });
  }, [form]);

  const removeEntry = useCallback(
    (index: number, fields: FieldsType) => {
      const { id } = fields.value[index];
      if (id) {
        form.mutators.push('searchPostfixesToDelete', id);
      }
      fields.remove(index);
    },
    [form],
  );

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <h3>Search postfix</h3>
        <Button onClick={addNewEntry}>Add</Button>
      </div>
      <FieldArray name={FIELD_ARRAY_KEY}>
        {props => (
          <DragDropContext onDragEnd={makeOnDragEndFunction(props.fields)}>
            <Droppable droppableId={FIELD_ARRAY_KEY}>
              {provided => (
                <div ref={provided.innerRef}>
                  {props.fields.map((name, index) => (
                    <Draggable index={index} key={name} draggableId={name}>
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={classes.listItem}
                        >
                          <span className="d-block mr-3 font-weight-bold">
                            {index + 1}
                          </span>
                          <Button size="sm" variant="light" className="mr-2">
                            <FontAwesomeIcon icon="sort" />
                          </Button>
                          <div className={classes.sectionInputWrapper}>
                            <Field
                              name={`${name}.term`}
                              component={TextInput}
                              withoutBottomMargin
                              uiType={INPUT_UI_STYLES.BLACK_WHITE}
                            />
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            onClick={() => removeEntry(index, props.fields)}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </FieldArray>
    </div>
  );
};

export default SearchPostfixes;
