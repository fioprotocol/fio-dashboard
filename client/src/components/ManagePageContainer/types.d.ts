import { RouteComponentProps } from 'react-router-dom';
import { PAGE_NAME } from './constants';
import {
  AddressDomainItemProps,
  FioWalletDoublet,
  PageNameType,
} from '../../types';

export type HasMore = { [key: string]: number };
export type FetchDataFn = (
  publicKey: string,
  limit: number,
  offset: number,
) => void;

export interface ContainerProps extends RouteComponentProps {
  children?: React.ReactNode;
  data: AddressDomainItemProps[];
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
  data: AddressDomainItemProps,
) => MouseEventHandler<HTMLDivElement>;

export type DeafultProps = {
  data: AddressDomainItemProps[];
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
  data: AddressDomainItemProps;
  isExpired: IsExpiredFunc;
  isDesktop: boolean;
  onSettingsOpen: ModalOpenActionType;
};

export type SettingsProps = {
  data: AddressDomainItemProps;
  pageName: PageNameType;
  fioWallets: FioWalletDoublet[];
};

export type ActionButtonProps = {
  pageName: PAGE_NAME;
  isDesktop: boolean;
  onSettingsOpen: ModalOpenActionType;
  data: AddressDomainItemProps;
};
