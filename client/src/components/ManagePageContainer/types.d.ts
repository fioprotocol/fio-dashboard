import { RouteComponentProps } from 'react-router-dom';
import { FioNameItemProps, FioWalletDoublet, PageNameType } from '../../types';

export type HasMore = { [key: string]: number };
export type FetchDataFn = (
  publicKey: string,
  limit: number,
  offset: number,
) => void;

export interface ContainerProps extends RouteComponentProps {
  children?: React.ReactNode;
  fioNameList: FioNameItemProps[];
  fioWallets: FioWalletDoublet[];
  hasMore: HasMore;
  noProfileLoaded?: boolean;
  loading: boolean;
  pageName: PageNameType;
  fetchDataFn: FetchDataFn;
}

export type BoolStateFunc = Dispatch<SetStateAction<boolean>>;

export type IsExpiredFunc = (expiration: Date) => boolean;
type ModalOpenActionType = (
  data: FioNameItemProps,
) => MouseEventHandler<HTMLDivElement>;

export type DefaultProps = {
  fioNameList: FioNameItemProps[];
  isDesktop: boolean;
  pageName: PageNameType;
  showInfoBadge: boolean;
  toggleShowInfoBadge: BoolStateFunc;
  toggleShowWarnBadge: BoolStateFunc;
  isExpired: IsExpiredFunc;
  onItemModalOpen?: ModalOpenActionType;
  onSettingsOpen?: ModalOpenActionType;
};

export type NotificationsProps = {
  pageName: PageNameType;
  showInfoBadge: boolean;
  showWarnBadge: boolean;
  toggleShowInfoBadge: BoolStateFunc;
  toggleShowWarnBadge: BoolStateFunc;
};

export type ItemComponentProps = {
  fioNameItem: FioNameItemProps;
  isExpired: IsExpiredFunc;
  isDesktop: boolean;
  onSettingsOpen: ModalOpenActionType;
};

export type FIOAddressActions = {
  onClickSignature: (fioNameItem: FioNameItemProps) => void;
};

export type SettingsProps = {
  fioNameItem: FioNameItemProps;
  pageName: PageNameType;
  fioWallets: FioWalletDoublet[];
};

export type ActionButtonProps = {
  pageName: PageNameType;
  isDesktop: boolean;
  onSettingsOpen: ModalOpenActionType;
  fioNameItem: FioNameItemProps;
};
