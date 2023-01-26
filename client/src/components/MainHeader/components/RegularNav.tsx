import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

import { ActionButtons } from './ActionButtons';
import { SideMenu } from './SideMenu/SideMenu';
import { CartNavItem } from './LoggedNav';
import { NavItemContainer } from './NavItemContainer';

import { ROUTES } from '../../../constants/routes';
import { ANALYTICS_EVENT_ACTIONS } from '../../../constants/common';

import { useCheckIfDesktop } from '../../../screenType';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../../util/analytics';

import { CartItem, RefProfile } from '../../../types';

import classes from '../MainHeader.module.scss';

type RegularNavProps = {
  cartItems: CartItem[];
  hideNavigation?: boolean;
  isMenuOpen: boolean;
  toggleMenuOpen: (openState: boolean) => void;
  edgeAuthLoading: boolean;
  profileLoading: boolean;
  hideCart: boolean;
  onlyAuth: boolean;
  refProfileInfo: RefProfile;
  showLogin: () => void;
  closeMenu: () => void;
};

type DefaultNavItemProps = { isDesktop: boolean } & RegularNavProps;

type NavItemsProps = { onCartClick: () => void } & DefaultNavItemProps;

const ActionButtonsNavItem: React.FC<DefaultNavItemProps> = props => {
  if (props.isDesktop)
    return <ActionButtons {...props} hasVioletColor={true} />;

  return (
    <SideMenu {...props}>
      <ActionButtons {...props} />
    </SideMenu>
  );
};

const NavItems: React.FC<NavItemsProps> = props => {
  const { cartItems, hideCart, hideNavigation, isDesktop, onCartClick } = props;
  return (
    <NavItemContainer hide={hideNavigation}>
      <Nav className="ml-auto align-items-center">
        <CartNavItem
          cartItems={cartItems}
          isDesktop={isDesktop}
          hasMarginRight={true}
          hide={hideCart}
          hideVerticalLine={true}
          to={ROUTES.FIO_ADDRESSES_SELECTION}
          onClick={onCartClick}
        />
        <ActionButtonsNavItem isDesktop={isDesktop} {...props} />
      </Nav>
    </NavItemContainer>
  );
};

export const RegularNav: React.FC<RegularNavProps> = props => {
  const { cartItems, closeMenu } = props;

  const isDesktop = useCheckIfDesktop();

  const onCartClick = () => {
    if (cartItems.length) {
      fireAnalyticsEvent(
        ANALYTICS_EVENT_ACTIONS.BEGIN_CHECKOUT,
        getCartItemsDataForAnalytics(cartItems),
      );
    }
    closeMenu();
  };

  return (
    <div className={classes.regularNavContainer}>
      <Navbar className="pr-0 w-100">
        <NavItems isDesktop={isDesktop} onCartClick={onCartClick} {...props} />
      </Navbar>
    </div>
  );
};
