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

interface AvailableDomainsProps {
  form: FormApi<any>;
}

const AvailableDomains: React.FC<AvailableDomainsProps> = ({ form }) => {
  const addNewEntry = () => {
    form.mutators.push('availableDomains', {
      name: '',
      isPremium: false,
      isDashboardDomain: false,
      rank: 0,
    });
  };

  const removeEntry = (index: number, fields: any) => {
    const { id } = fields.value[index];
    if (id) {
      form.mutators.push('availableDomainsToDelete', id);
    }
    fields.remove(index);
  };

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <h3>Available Domains</h3>
        <Button onClick={addNewEntry}>Add</Button>
      </div>
      <FieldArray name="availableDomains">
        {props => (
          <DragDropContext onDragEnd={makeOnDragEndFunction(props.fields)}>
            <Droppable droppableId="availableDomains">
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
                            name={`${name}.name`}
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

export default AvailableDomains;
