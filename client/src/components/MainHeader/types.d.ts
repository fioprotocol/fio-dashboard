import {
  User,
  CartItem,
  Notification,
  RefProfile,
  FioCryptoHandleDoublet,
} from '../../types';
import { RouteComponentProps } from 'react-router-dom';

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
  fioCryptoHandles: FioCryptoHandleDoublet[];
}
