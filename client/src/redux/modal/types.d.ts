import { AnyType } from '../../types';

export type GenericErrorDataTypes = {
  message?: string;
  title?: string;
  buttonText?: string;
};

export type PinDataType = {
  [key: string]: AnyType;
};

export type PinConfirmDataTypes = {
  action?: string;
  data?: PinDataType;
};
