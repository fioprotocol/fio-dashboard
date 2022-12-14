import { PrivateRedirectLocationState } from '../../types';

export type MainHeaderProps = {
  isAuthenticated: boolean;
  pathname: string;
  locationState?: PrivateRedirectLocationState;
  profileLoading: boolean;
  logout: () => void;
};

export type NavigationProps = {
  isMenuOpen: boolean;
  toggleMenuOpen: (isMenuOpen: boolean) => void;
  closeMenu: () => void;
} & MainHeaderProps;
