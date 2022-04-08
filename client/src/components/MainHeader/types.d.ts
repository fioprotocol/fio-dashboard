import { RouteComponentProps } from 'react-router-dom';

import {
  User,
  CartItem,
  Notification,
  RefProfile,
  FioAddressDoublet,
  PrivateRedirectLocationState,
} from '../../types';

export interface MainHeaderProps extends RouteComponentProps {
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
}
