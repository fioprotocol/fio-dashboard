export type GenericErrorDataTypes = {
  message?: string;
  title?: string;
  buttonText?: string;
};

export type PinDataType = {
  [key: string]: any;
};

export type PinConfirmDataTypes = {
  action?: string;
  data?: PinDataType;
};
