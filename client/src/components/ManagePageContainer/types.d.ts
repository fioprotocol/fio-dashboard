import React, { MouseEventHandler } from 'react';

import { FioNameItemProps, FioNameType } from '../../types';
import { SelectedDomainWatchlistItem } from '../../pages/FioDomainManagePage/FioDomainManagePageContext';

export type HasMore = { [key: string]: number };
type GetWalletAddresses = (
  publicKey: string,
  limit: number,
  offset: number,
) => void;

export type WarningContentItem = {
  title: string;
  message: string;
  show: boolean;
  onClose?: () => void;
};

export interface ContainerProps {
  children?: React.ReactNode;
  emptyStateContent: {
    title: string;
    message: string;
  };
  listNameTitle?: React.ReactElement;
  pageName: FioNameType;
  title: React.ReactElement;
  topBadgeContent?: {
    message: string;
    title: string;
    type: string;
  };
  showTopBadge?: boolean;
  warningContent?: WarningContentItem[];
  handleAddBundles?: (name: string) => void;
  handleRenewDomain?: (name: string) => void;
  onTopBadgeClose?: () => void;
}

type ModalOpenActionType = (
  data: FioNameItemProps | SelectedDomainWatchlistItem,
) => MouseEventHandler<HTMLDivElement> | void;
