import { ChangeEvent } from 'react';
import { FormApi } from 'final-form';

export type IosKeyBoardPlugProp = 'highPlug' | 'extraHighPlug' | 'emptyPlug';

export type PinInputProps = {
  error: string;
  name: string;
  value: string;
  withoutMargin?: boolean;
  iosKeyboardPlugType?: IosKeyBoardPlugProp | null;
  form?: FormApi;
  onBlur?: () => void;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onReset?: () => void;
  submit?: () => void;
  input?: {
    value: string;
  };
};

export type PinInputEventProps = {
  nativeEvent?: {
    inputType?: string;
  };
} & ChangeEvent<HTMLInputElement>;
