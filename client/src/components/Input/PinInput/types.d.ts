import { ChangeEvent } from 'react';
import { FormApi } from 'final-form';

import { CommonObjectProps } from '../../../types';

type DefaultPinProps = {
  error: string;
  name: string;
  value: string;
  withoutMargin?: boolean;
  submit?: () => Promise<CommonObjectProps>;
  onChange: (value: string) => void;
};

export type PinInputProps = {
  form?: FormApi;
  onReset?: () => void;
  input?: {
    value: string;
  };
} & DefaultPinProps;

export type PinProps = {
  resetError?: () => void;
} & DefaultPinProps;

export type PinInputEventProps = {
  nativeEvent?: {
    inputType?: string;
  };
} & ChangeEvent<HTMLInputElement>;
