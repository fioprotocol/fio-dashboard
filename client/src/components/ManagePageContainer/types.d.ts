import { RouteComponentProps } from 'react-router-dom';

export type DataProps = {
  name?: string;
  expiration?: Date;
  remaining?: number;
  is_public?: number;
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
  fioWallets: any;
  hasMore: HasMore;
  isAuthenticated?: boolean;
  loading: boolean;
  pageName: PageName;
  fetchDataFn: FetchDataFn;
}

export type BoolStateFunc = Dispatch<SetStateAction<boolean>>;

export type IsExpiredFunc = (expiration: Date) => boolean;

export type DeafultProps = {
  data: DataProps[];
  isDesktop: boolean;
  pageName: PageName;
  showInfoBadge: boolean;
  toggleShowInfoBadge: BoolStateFunc;
  toggleShowWarnBadge: BoolStateFunc;
  isExpired: IsExpiredFunc;
  onClickItem?: (data: DataProps) => MouseEventHandler<HTMLDivElement>;
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
};
