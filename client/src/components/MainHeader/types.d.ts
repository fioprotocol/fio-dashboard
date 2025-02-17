import {
  CartItem,
  FioAddressDoublet,
  Notification,
  PrivateRedirectLocationState,
  RefProfile,
  User,
} from '../../types';

export type MainHeaderProps = {
  profileRefreshed: boolean;
  isAuthenticated: boolean;
  isNotActiveUser: boolean;
  pathname: string;
  locationState?: PrivateRedirectLocationState;
  user: User;
  edgeContextSet: boolean;
  profileLoading: boolean;
  edgeAuthLoading: boolean;
  logout: () => void;
  showLoginModal: () => void;
  notifications: Notification[];
  cartItems: CartItem[];
  refProfileInfo: RefProfile;
  refProfileLoading: boolean;
  fioAddresses: FioAddressDoublet[];
  isContainedFlow: boolean;
  isAdminAuthenticated: boolean;
  hideNavigation?: boolean;
  isMaintenance?: boolean;
  isNoProfileFlow?: boolean;
};

export type NavigationProps = {
  isMenuOpen: boolean;
  toggleMenuOpen: (isMenuOpen: boolean) => void;
  closeMenu: () => void;
  showLogin: () => void;
  isMaintenance: boolean;
  isMetaMask: boolean;
} & MainHeaderProps;
