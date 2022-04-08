import React from 'react';
import { useForm, FieldRenderProps } from 'react-final-form';

import Pin from './Pin';

import { PinInputProps } from './types';

const PinInput: React.FC<PinInputProps &
  FieldRenderProps<PinInputProps>> = props => {
  const { meta, input } = props;

  const { error, data } = meta;

  const pinError = error || data?.error || null;

  const form = useForm();

  return (
    <Pin
      {...input}
      {...props}
      error={pinError}
      form={form}
      submit={form.submit}
    />
  );
};

export default PinInput;
