import {
  User,
  CartItem,
  Notification,
  RefProfile,
  FioAddressDoublet,
  PrivateRedirectLocationState,
} from '../../types';

export type MainHeaderProps = {
  profileRefreshed: boolean;
  isAuthenticated: boolean;
  isNotActiveUser: boolean;
  pathname: string;
  locationState?: PrivateRedirectLocationState;
  homePageLink: string;
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
};
