import { CartItem } from '../../types';

export type UseContextProps = {
  additionalItemsList: SelectedItemProps[];
  addressValue: string | null;
  cartItemList: SelectedItemProps[];
  error: string | null;
  loading: boolean;
  suggestedItemsList: SelectedItemProps[];
  usersItemsList: SelectedItemProps[];
  onClick: () => void;
  setAddressValue: (address: string) => void;
  setError: (error: string) => void;
};

export type SelectedItemProps = {
  isSelected: boolean;
} & CartItem;
