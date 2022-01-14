import { ChangeEvent } from 'react';
import { FormApi } from 'final-form';

export type IosKeyBoardPlugProp = 'highPlug' | 'extraHighPlug';

export type PinInputProps = {
  error: string;
  value: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  name: string;
  loading: boolean;
  submit?: () => void;
  withoutMargin?: boolean;
  form?: FormApi;
  iosKeyboardPlugType?: IosKeyBoardPlugProp;
  onReset?: () => void;
};

export type PinInputEventProps = {
  nativeEvent?: {
    inputType?: string;
  };
} & ChangeEvent<HTMLInputElement>;
