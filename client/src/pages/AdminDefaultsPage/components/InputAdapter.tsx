import React from 'react';
import { Form } from 'react-bootstrap';
import { FieldRenderProps } from 'react-final-form';

interface InputAdapterProps {
  input: FieldRenderProps<any, HTMLElement, any>;
  meta: any;
  invalid: (meta: any) => boolean;
  valid: (c?: any) => boolean;
  [key: string]: any;
}

const InputAdapter: React.FC<InputAdapterProps> = ({
  input,
  meta,
  invalid = meta => meta.touched && meta.invalid,
  valid = () => false,
  ...rest
}) => (
  <Form.Control
    {...input}
    {...rest}
    isInvalid={invalid(meta)}
    isValid={valid(meta)}
  />
);

export default InputAdapter;
