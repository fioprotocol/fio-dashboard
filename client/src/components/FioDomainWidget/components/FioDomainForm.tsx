import React from 'react';
import { Field, Form } from 'react-final-form';

import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';

import TextInput, { INPUT_COLOR_SCHEMA } from '../../Input/TextInput';

import { DOMAIN } from '../../../constants/common';

import { FormValues } from '../types';

import classes from '../FioDomainWidget.module.scss';

type Props = {
  onSubmit: (values: FormValues) => void;
};

export const FioDomainForm: React.FC<Props> = props => {
  const { onSubmit } = props;
  return (
    <Form onSubmit={onSubmit}>
      {formProps => (
        <form onSubmit={formProps.handleSubmit} className={classes.form}>
          <Field
            component={TextInput}
            name={DOMAIN}
            placeholder="Find domain"
            lowerCased
            hideError="true"
            colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
            type="text"
          />
          <div className={classes.actionButton}>
            <SubmitButton
              text="GET IT"
              hasLowHeight
              hasSmallText
              isWhiteBordered
            />
          </div>
        </form>
      )}
    </Form>
  );
};
