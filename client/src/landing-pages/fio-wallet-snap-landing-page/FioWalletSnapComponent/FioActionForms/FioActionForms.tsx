import React from 'react';

import { AddPublicAddressForm } from './AddPublicAddressForm';

import { ACTIONS } from '../../../../constants/fio';

type Props = {
  action: string;
  onSubmit: (values: any) => void;
};

export const FioActionForms: React.FC<Props> = props => {
  const { action, onSubmit } = props;

  if (action === ACTIONS.addPublicAddress)
    return <AddPublicAddressForm onSubmit={onSubmit} />;

  return null;
};
