import React from 'react';
import { Button } from 'react-bootstrap';
import { FormApi } from 'final-form';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import InputAdapter from './InputAdapter';
import { makeOnDragEndFunction } from '../dndUtils';
import classes from '../styles/AdminDefaultsPage.module.scss';

interface SearchPrefixesProps {
  form: FormApi<any>;
}

const SearchPrefixes: React.FC<SearchPrefixesProps> = ({ form }) => {
  const addNewEntry = () => {
    form.mutators.push('searchPrefixes', {
      term: '',
      isPrefix: true,
      rank: 0,
    });
  };

  const removeEntry = (index: number, fields: any) => {
    const { id } = fields.value[index];
    if (id) {
      form.mutators.push('searchPrefixesToDelete', id);
    }
    fields.remove(index);
  };

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <h3>Search prefix</h3>
        <Button onClick={addNewEntry}>Add</Button>
      </div>
      <FieldArray name="searchPrefixes">
        {props => (
          <DragDropContext onDragEnd={makeOnDragEndFunction(props.fields)}>
            <Droppable droppableId="searchPostfixes">
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
                          <Button size="sm" variant="light" className="mr-2">
                            <FontAwesomeIcon icon="sort" />
                          </Button>
                          <Field
                            name={`${name}.term`}
                            component={InputAdapter as any}
                          />
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

export default SearchPrefixes;
