import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { LoggedActionButtons } from './ActionButtons';
import SideMenu from './SideMenu';
import SiteLink from './SiteLink';

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
  hideNotifications: boolean;
  showSiteLink: boolean;
  onlyAuth: boolean;
  hideSettings?: boolean;
  refProfileInfo: RefProfile;
  notifications: Notification[];
  logout: () => void;
  showLogin: () => void;
  closeMenu: () => void;
};

const LoggedNav: React.FC<LoggedNavProps> = props => {
  const {
    cartItems,
    isMenuOpen,
    toggleMenuOpen,
    closeMenu,
    notifications,
    hideCart,
    hideNotifications,
    showSiteLink,
  } = props;

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

  const renderOrdersList = () => {
    const onOrderClick = () => {
      fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.ORDERS);
    };

    return (
      <>
        <Nav.Link
          className={classnames(classes.navItem, 'text-white')}
          onClick={onOrderClick}
          as={Link}
          to={ROUTES.ORDERS}
        >
          <div className={classnames(classes.notifWrapper, classes.cartanim)}>
            <FontAwesomeIcon
              icon="list-alt"
              className={classnames(classes.icon)}
            />
          </div>
        </Nav.Link>
        {isDesktop ? (
          <hr className={classnames(classes.vertical, 'mx-3')} />
        ) : (
          <div className="mx-3" />
        )}
      </>
    );
  };

  const renderCart = () => {
    if (hideCart) return null;
    return (
      <>
        <Nav.Link
          className={classnames(classes.navItem, 'text-white')}
          onClick={onCartClick}
          as={Link}
          to={
            cartItems.length > 0 ? ROUTES.CART : ROUTES.FIO_ADDRESSES_SELECTION
          }
        >
          <div className={classnames(classes.notifWrapper, classes.cartanim)}>
            <FontAwesomeIcon
              icon="shopping-cart"
              className={classnames(classes.icon)}
            />
            {cartItems.length > 0 && (
              <div
                className={classnames(
                  classes.notifActiveWrapper,
                  classes.notifActiveWrapperRight,
                )}
              >
                <FontAwesomeIcon
                  icon="circle"
                  className={classnames(classes.notifActive, 'text-success')}
                />
              </div>
            )}
          </div>
        </Nav.Link>
        {isDesktop ? (
          <hr className={classnames(classes.vertical, 'mx-3')} />
        ) : (
          <div className="mx-3" />
        )}
      </>
    );
  };

  // @ts-ignore
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  const renderNotifications = () => {
    return hideNotifications ? null : (
      <>
        <hr className={classnames(classes.vertical, 'mx-3')} />
        <Nav.Link
          href="#"
          className={classnames(classes.navItem, 'text-white')}
          onClick={closeMenu}
        >
          <div className={classnames(classes.notifWrapper, classes.bellshake)}>
            <FontAwesomeIcon
              icon="bell"
              className={classnames(
                classes.icon,
                classes.notification,
                'text-white',
              )}
            />
            {!!notifications.length && (
              <div className={classes.notifActiveWrapper}>
                <FontAwesomeIcon
                  icon="circle"
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
      </>
    );
  };

  return (
    <div className={classes.loggedNavContainer}>
      {showSiteLink ? <SiteLink {...props} /> : <div />}
      <Nav className="pr-0 align-items-center">
        {renderOrdersList()}
        {renderCart()}
        {/* Notifications commented due to BD-2631 task */}
        {/* {renderNotifications()} */}
        {isDesktop ? (
          <LoggedActionButtons {...props} />
        ) : (
          <SideMenu isMenuOpen={isMenuOpen} toggleMenuOpen={toggleMenuOpen}>
            <LoggedActionButtons {...props} />
          </SideMenu>
        )}
      </Nav>
    </div>
  );
};

export default LoggedNav;
