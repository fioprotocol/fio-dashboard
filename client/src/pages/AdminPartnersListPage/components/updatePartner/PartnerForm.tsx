import React from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { PartnerFormComponent } from './PartnerFormComponent';

import { validate } from './validation';

import { RefProfile } from '../../../../types';

type Props = {
  onSubmit: (values: RefProfile) => Promise<void>;
  loading: boolean;
  initialValues?: Partial<RefProfile>;
};

export const PartnerForm: React.FC<Props> = props => {
  const { onSubmit, loading, initialValues } = props;

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      component={PartnerFormComponent}
      loading={loading}
      validate={validate}
      mutators={{
        ...arrayMutators,
      }}
    />
  );
};
