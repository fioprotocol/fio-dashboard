import React from 'react';
import { Button } from 'react-bootstrap';
import { FormApi } from 'final-form';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import InputAdapter from './InputAdapter';

import classes from '../styles/AdminDefaultsPage.module.scss';
import { makeOnDragEndFunction } from '../dndUtils';

interface UsernamesOnCustomDomainsProps {
  form: FormApi<any>;
}

const UsernamesOnCustomDomains: React.FC<UsernamesOnCustomDomainsProps> = ({
  form,
}) => {
  const addNewEntry = () => {
    form.mutators.push('usernamesOnCustomDomains', {
      username: '',
      rank: 0,
    });
  };

  const removeEntry = (index: number, fields: any) => {
    const { id } = fields.value[index];
    if (id) {
      form.mutators.push('usernamesOnCustomDomainsToDelete', id);
    }
    fields.remove(index);
  };

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <h3>Usernames on Custom Domains</h3>
        <Button onClick={addNewEntry}>Add</Button>
      </div>
      <FieldArray name="usernamesOnCustomDomains">
        {props => (
          <DragDropContext onDragEnd={makeOnDragEndFunction(props.fields)}>
            <Droppable droppableId="usernamesOnCustomDomains">
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
                            name={`${name}.username`}
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

export default UsernamesOnCustomDomains;
