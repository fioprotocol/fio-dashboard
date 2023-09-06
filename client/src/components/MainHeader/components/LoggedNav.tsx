import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import CircleIcon from '@mui/icons-material/Circle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import NotificationsIcon from '@mui/icons-material/Notifications';
import classnames from 'classnames';

import { LoggedActionButtons } from './ActionButtons';
import { SideMenu } from './SideMenu/SideMenu';
import { SiteLink } from './SiteLink/SiteLink';
import { NavItemContainer } from './NavItemContainer';

import { ROUTES } from '../../../constants/routes';
import { ANALYTICS_EVENT_ACTIONS } from '../../../constants/common';

import { useCheckIfDesktop } from '../../../screenType';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../../util/analytics';

import { CartItem, Notification, RefProfile } from '../../../types';

import classes from '../MainHeader.module.scss';

type LoggedNavProps = {
  cartItems: CartItem[];
  isMenuOpen: boolean;
  toggleMenuOpen: (openState: boolean) => void;
  edgeAuthLoading: boolean;
  profileLoading: boolean;
  hideCart: boolean;
  hideCartIcon?: boolean;
  hideOrder?: boolean;
  hideNotifications: boolean;
  showSiteLink: boolean;
  onlyAuth: boolean;
  hideSettings?: boolean;
  refProfileInfo: RefProfile;
  notifications: Notification[];
  isMaintenance: boolean;
  logout: () => void;
  showLogin: () => void;
  closeMenu: () => void;
};

type DefaultNavItemProps = {
  hide?: boolean;
  isDesktop?: boolean;
};

type CartNavItemProps = {
  cartItems: CartItem[];
  hasMarginRight?: boolean;
  hideVerticalLine?: boolean;
  hideCartIcon?: boolean;
  to: string;
  onClick: () => void;
} & DefaultNavItemProps;

type NotificationsNavItemProps = {
  notifications: Notification[];
  onClick: () => void;
} & DefaultNavItemProps;

const OrdersListNavItem: React.FC<DefaultNavItemProps> = props => (
  <NavItemContainer hide={props.hide}>
    <Nav.Link className={classes.navItem} as={Link} to={ROUTES.ORDERS}>
      <div className={classnames(classes.notifWrapper, classes.cartanim)}>
        <ListAltIcon className={classes.icon} />
      </div>
    </Nav.Link>
    {!props.isDesktop && <div className="mx-3" />}
  </NavItemContainer>
);

export const CartNavItem: React.FC<CartNavItemProps> = props => {
  const {
    cartItems,
    hasMarginRight,
    hide,
    hideCartIcon,
    hideVerticalLine,
    isDesktop,
    to,
    onClick,
  } = props;

  return (
    <NavItemContainer hide={hide}>
      <Nav.Link className={classes.navItem} onClick={onClick} as={Link} to={to}>
        <div className={classnames(classes.notifWrapper, classes.cartanim)}>
          <ShoppingCartIcon
            className={classnames(classes.icon, hasMarginRight && 'mr-4')}
          />
          {cartItems.length > 0 && !hideCartIcon && (
            <div
              className={classnames(
                classes.notifActiveWrapper,
                classes.notifActiveWrapperRight,
              )}
            >
              <CircleIcon
                className={classnames(classes.notifActive, 'text-success')}
              />
            </div>
          )}
        </div>
      </Nav.Link>
      {hideVerticalLine ? null : isDesktop ? (
        <hr className={classnames(classes.vertical, 'mx-3')} />
      ) : (
        <div className="mx-3" />
      )}
    </NavItemContainer>
  );
};

const ActiveButtons: React.FC<LoggedNavProps & DefaultNavItemProps> = props => {
  const { isDesktop, isMenuOpen, toggleMenuOpen } = props;

  if (isDesktop) return <LoggedActionButtons {...props} />;

  return (
    <SideMenu isMenuOpen={isMenuOpen} toggleMenuOpen={toggleMenuOpen}>
      <LoggedActionButtons {...props} />
    </SideMenu>
  );
};

const NotificationsNavItem: React.FC<NotificationsNavItemProps> = props => {
  const { hide, isDesktop, notifications, onClick } = props;

  return (
    <NavItemContainer hide={hide}>
      <hr className={classnames(classes.vertical, 'mx-3')} />
      <Nav.Link href="#" className={classes.navItem} onClick={onClick}>
        <div className={classnames(classes.notifWrapper, classes.bellshake)}>
          <NotificationsIcon
            className={classnames(classes.icon, classes.notification)}
          />
          {!!notifications.length && (
            <div className={classes.notifActiveWrapper}>
              <CircleIcon
                className={classnames(
                  classes.notifActive,
                  'mr-2',
                  'text-danger',
                )}
              />
            </div>
          )}
        </div>
        {isDesktop && <div className="ml-3">Notifications</div>}
      </Nav.Link>{' '}
      {isDesktop ? (
        <hr className={classnames(classes.vertical, 'mx-3')} />
      ) : (
        <div className="mx-3" />
      )}
    </NavItemContainer>
  );
};

export const LoggedNav: React.FC<LoggedNavProps> = props => {
  const {
    cartItems,
    hideCart,
    hideCartIcon,
    hideOrder,
    notifications,
    showSiteLink,
    closeMenu,
    isMaintenance,
  } = props;

  const isDesktop = useCheckIfDesktop();

  const onCartClick = useCallback(() => {
    if (cartItems.length) {
      fireAnalyticsEvent(
        ANALYTICS_EVENT_ACTIONS.BEGIN_CHECKOUT,
        getCartItemsDataForAnalytics(cartItems),
      );
    }
    closeMenu();
  }, [cartItems, closeMenu]);

  return (
    <div className={classes.loggedNavContainer}>
      {showSiteLink ? <SiteLink {...props} /> : <div />}
      <Nav className="pr-0 align-items-center">
        {!isMaintenance && (
          <>
            <OrdersListNavItem hide={hideOrder} isDesktop={isDesktop} />
            <CartNavItem
              cartItems={cartItems}
              hide={hideCart}
              hideCartIcon={hideCartIcon}
              isDesktop={isDesktop}
              to={
                cartItems.length > 0
                  ? ROUTES.CART
                  : ROUTES.FIO_ADDRESSES_SELECTION
              }
              onClick={onCartClick}
            />
            <ActiveButtons isDesktop={isDesktop} {...props} />
            {/* Notifications commented due to BD-2631 task */}
            <NotificationsNavItem
              hide={true}
              isDesktop={isDesktop}
              notifications={notifications}
              onClick={closeMenu}
            />
          </>
        )}
      </Nav>
    </div>
  );
};
