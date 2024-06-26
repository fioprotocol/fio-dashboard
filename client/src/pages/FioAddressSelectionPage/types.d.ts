import { CartItem, DomainItemType } from '../../types';

export type UseContextProps = {
  additionalItemsList: SelectedItemProps[];
  addressValue: string | null;
  error: string | null;
  infoMessage: { title: string; message: string };
  loading: boolean;
  suggestedItemsList: SelectedItemProps[];
  usersItemsList: SelectedItemProps[];
  onClick: (selectedItem: CartItem) => void;
  setAddressValue: (address: string) => void;
  setError: (error: string) => void;
};

export type SelectedItemProps = {
  isExpired?: boolean;
  isSelected?: boolean;
} & CartItem;

export type DomainsItemType = {
  rank?: number;
  name: string;
  domainType: DomainItemType;
  swapAddressAndDomainPlaces?: boolean;
  isFirstRegFree?: boolean;
};

export type DomainsArrItemType = DomainsItemType[];
