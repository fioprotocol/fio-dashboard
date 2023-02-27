import React from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { PartnerFormComponent } from './PartnerFormComponent';

import { validate } from './validation';

import { RefProfile, FioAccountProfile } from '../../../../types';

type Props = {
  onSubmit: (values: RefProfile) => Promise<void>;
  fioAccountsProfilesList: FioAccountProfile[];
  loading: boolean;
  initialValues?: Partial<RefProfile>;
};

export const PartnerForm: React.FC<Props> = props => {
  const { onSubmit, fioAccountsProfilesList, loading, initialValues } = props;

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={validate}
      mutators={{
        ...arrayMutators,
      }}
    >
      {props => (
        <PartnerFormComponent
          loading={loading}
          fioAccountsProfilesList={fioAccountsProfilesList}
          {...props}
        />
      )}
    </Form>
  );
};
