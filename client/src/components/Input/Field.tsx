import React, { useState } from 'react';

import Input, { FieldProps as OtherProps } from '../Input/InputRedux';

export type FieldValue = string | boolean | number;
type FieldProps = OtherProps & {
  value: FieldValue;
  onChange: (value: FieldValue, name?: string) => void;
  name: string;
  placeholder: string;
  error?: string;
};

export const Field = (props: FieldProps) => {
  const { value, onChange, error, name, placeholder, ...rest } = props;
  const [active, setActive] = useState<boolean>(false);
  const [touched, setTouched] = useState<boolean>(false);

  const onFocus = () => {
    setTouched(true);
    setActive(true);
  };

  const onBlur = () => {
    setActive(false);
  };

  const handlerChange = (value: FieldValue) => {
    onChange(value, name);
    if (!touched) setTouched(true);
  };

  return (
    <Input
      input={{
        value,
        onChange: handlerChange,
        placeholder,
        name,
        onFocus,
        onBlur,
      }}
      meta={{ error, touched, active }}
      {...rest}
    />
  );
};
