import { CartItem, DomainItemType } from '../../types';

export type UseContextProps = {
  additionalItemsList: SelectedItemProps[];
  addressValue: string | null;
  error: string | null;
  loading: boolean;
  suggestedItemsList: SelectedItemProps[];
  usersItemsList: SelectedItemProps[];
  hideSuggestedActionButton: boolean;
  onClick: (selectedItem: CartItem) => void;
  setAddressValue: (address: string) => void;
  setError: (error: string) => void;
};

export type SelectedItemProps = {
  isSelected?: boolean;
} & CartItem;

export type DomainsArrItemType = {
  rank?: number;
  name: string;
  domainType: DomainItemType;
  allowFree?: boolean;
  swapAddressAndDomainPlaces?: boolean;
}[];
