import { RouteComponentProps } from 'react-router-dom';
import { PAGE_NAME } from './constants';
import { FioWalletDoublet } from '../../types';

export type DataProps = {
  name?: string;
  expiration?: Date;
  remaining?: number;
  is_public?: number;
  walletPublicKey?: string;
};

export type PageName = 'address' | 'domain';
export type HasMore = { [key: string]: number };
export type FetchDataFn = (
  publicKey: string,
  limit: number,
  offset: number,
) => void;

export interface ContainerProps extends RouteComponentProps {
  children?: React.ReactNode;
  data: DataProps[];
  fioWallets: FioWalletDoublet[];
  hasMore: HasMore;
  noProfileLoaded?: boolean;
  loading: boolean;
  pageName: PageName;
  fetchDataFn: FetchDataFn;
}

export type BoolStateFunc = Dispatch<SetStateAction<boolean>>;

export type IsExpiredFunc = (expiration: Date) => boolean;
type ModalOpenActionType = (
  data: DataProps,
) => MouseEventHandler<HTMLDivElement>;

export type DeafultProps = {
  data: DataProps[];
  isDesktop: boolean;
  pageName: PageName;
  showInfoBadge: boolean;
  toggleShowInfoBadge: BoolStateFunc;
  toggleShowWarnBadge: BoolStateFunc;
  isExpired: IsExpiredFunc;
  onItemModalOpen?: ModalOpenActionType;
  onSettingsOpen?: ModalOpenActionType;
};

export type NotificationsProps = {
  pageName: PageName;
  showInfoBadge: boolean;
  showWarnBadge: boolean;
  toggleShowInfoBadge: BoolStateFunc;
  toggleShowWarnBadge: BoolStateFunc;
};

export type ItemComponentProps = {
  data: DataProps;
  isExpired: IsExpiredFunc;
  isDesktop: boolean;
  onSettingsOpen: ModalOpenActionType;
};

export type SettingsProps = {
  data: DataProps;
  pageName: PageName;
  fioWallets: FioWalletDoublet[];
};

export type ActionButtonProps = {
  pageName: PAGE_NAME;
  isDesktop: boolean;
  onSettingsOpen: ModalOpenActionType;
  data: DataProps;
};
