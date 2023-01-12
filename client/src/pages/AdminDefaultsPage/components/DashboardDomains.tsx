import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { FormApi } from 'final-form';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import InputAdapter from './InputAdapter';
import { makeOnDragEndFunction } from '../dndUtils';
import classes from '../styles/AdminDefaultsPage.module.scss';

interface DashboardDomainsProps {
  form: FormApi<any>;
}

const DashboardDomains: React.FC<DashboardDomainsProps> = ({ form }) => {
  const addNewEntry = () => {
    form.mutators.push('dashboardDomains', {
      name: '',
      isPremium: false,
      isDashboardDomain: true,
      rank: 0,
    });
  };

  const removeEntry = (index: number, fields: any) => {
    const { id } = fields.value[index];
    if (id) {
      form.mutators.push('dashboardDomainsToDelete', id);
    }
    fields.remove(index);
  };

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <h3>Dashboard Domains</h3>
        <Button onClick={addNewEntry}>Add</Button>
      </div>
      <FieldArray name="dashboardDomains">
        {props => (
          <DragDropContext onDragEnd={makeOnDragEndFunction(props.fields)}>
            <Droppable droppableId="dashboardDomains">
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
                          <Field name={`${name}.isPremium`}>
                            {({ input }) => (
                              <Form.Check
                                id={`${name}.isPremium`}
                                type="switch"
                                className="mr-3"
                                label="Premium"
                                name={input.name}
                                value={input.value}
                                checked={input.value}
                                onChange={input.onChange}
                              />
                            )}
                          </Field>
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

export default DashboardDomains;
