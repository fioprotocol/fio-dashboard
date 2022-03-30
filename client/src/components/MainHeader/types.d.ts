import { RouteComponentProps } from 'react-router-dom';

import {
  User,
  CartItem,
  Notification,
  RefProfile,
  FioAddressDoublet,
} from '../../types';

export interface MainHeaderProps extends RouteComponentProps {
  isAuthenticated: boolean;
  isNotActiveUser: boolean;
  pathname: string;
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
