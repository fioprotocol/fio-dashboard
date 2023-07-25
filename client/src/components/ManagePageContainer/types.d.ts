import React, { MouseEventHandler } from 'react';

import { FioNameItemProps, FioNameType } from '../../types';

export type HasMore = { [key: string]: number };
type GetWalletAddresses = (
  publicKey: string,
  limit: number,
  offset: number,
) => void;

export interface ContainerProps {
  children?: React.ReactNode;
  emptyStateContent: {
    title: string;
    message: string;
  };
  listNameTitle?: React.ReactElement;
  pageName: FioNameType;
  title: React.ReactElement;
  warningContent?: {
    title: string;
    message: string;
  };
  handleAddBundles?: (name: string) => void;
  handleRenewDomain?: (name: string) => void;
}

type ModalOpenActionType = (
  data: FioNameItemProps,
) => MouseEventHandler<HTMLDivElement> | void;
