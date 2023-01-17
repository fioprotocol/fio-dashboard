import React, { useCallback } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FormApi } from 'final-form';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import InputAdapter from './InputAdapter';
import { makeOnDragEndFunction } from '../dndUtils';
import { AdminDefaultsRequest } from '../../../api/responses';
import classes from '../styles/AdminDefaultsPage.module.scss';

interface DashboardDomainsProps {
  form: FormApi<AdminDefaultsRequest>;
}

const FIELD_ARRAY_KEY = 'dashboardDomains';

const DashboardDomains: React.FC<DashboardDomainsProps> = ({ form }) => {
  const addNewEntry = useCallback(() => {
    form.mutators.push(FIELD_ARRAY_KEY, {
      name: '',
      isPremium: false,
      isDashboardDomain: true,
      rank: 0,
    });
  }, [form]);

  const removeEntry = useCallback(
    (index: number, fields: any) => {
      const { id } = fields.value[index];
      if (id) {
        form.mutators.push('dashboardDomainsToDelete', id);
      }
      fields.remove(index);
    },
    [form],
  );

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <h3>Dashboard Domains</h3>
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
