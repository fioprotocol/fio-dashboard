import React from 'react';
import { useForm, FieldRenderProps } from 'react-final-form';

import Pin from './Pin';

import { PinInputProps } from './types';

const PinInput: React.FC<PinInputProps &
  FieldRenderProps<PinInputProps>> = props => {
  const { meta, input, name, onReset } = props;

  const { error, data } = meta;

  const pinError = error || data?.error || null;

  const form = useForm();

  const resetError = () => {
    form &&
      form.mutators.setDataMutator(name, {
        error: false,
      });
    onReset && onReset();
  };

  return (
    <Pin
      {...input}
      {...props}
      error={pinError}
      resetError={resetError}
      submit={form.submit}
    />
  );
};

export default PinInput;
