import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { ActionButtons } from './ActionButtons';
import SideMenu from './SideMenu';

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

const RegularNav: React.FC<RegularNavProps> = props => {
  const { cartItems, hideCart, closeMenu, hideNavigation } = props;

  const isDesktop = useCheckIfDesktop();

  const renderActionButtons = () => {
    if (isDesktop) return <ActionButtons {...props} />;
    return (
      <SideMenu {...props}>
        <ActionButtons {...props} />
      </SideMenu>
    );
  };

  const onCartClick = () => {
    if (cartItems.length) {
      fireAnalyticsEvent(
        ANALYTICS_EVENT_ACTIONS.BEGIN_CHECKOUT,
        getCartItemsDataForAnalytics(cartItems),
      );
    }
    closeMenu();
  };

  const renderNav = () => {
    if (hideNavigation) return null;

    return (
      <Nav className="ml-auto align-items-center">
        {hideCart ? null : (
          <Nav.Link
            className={classnames(classes.navItem, 'text-white')}
            as={Link}
            to={ROUTES.FIO_ADDRESSES_SELECTION}
            onClick={onCartClick}
          >
            <div className={classnames(classes.notifWrapper, classes.cartanim)}>
              <FontAwesomeIcon
                icon="shopping-cart"
                className={classnames(classes.icon, 'mr-4')}
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
                    className={classnames(
                      classes.notifActive,
                      'text-success',
                      'mr-2',
                    )}
                  />
                </div>
              )}
            </div>
          </Nav.Link>
        )}
        {renderActionButtons()}
      </Nav>
    );
  };

  return (
    <div className={classes.regularNavContainer}>
      <Navbar className="pr-0 w-100">{renderNav()}</Navbar>
    </div>
  );
};

export default RegularNav;
