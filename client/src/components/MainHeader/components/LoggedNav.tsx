import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { useCheckIfDesktop } from '../../../screenType';

import { ROUTES } from '../../../constants/routes';
import classes from '../MainHeader.module.scss';
import { LoggedActionButtons } from './ActionButtons';
import SideMenu from './SideMenu';
import { CartItem, Notification, RefProfile } from '../../../types';
import SiteLink from './SiteLink';

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

  const renderCart = () => {
    if (hideCart) return null;
    return (
      <>
        <Nav.Link
          className={classnames(classes.navItem, 'text-white')}
          onClick={closeMenu}
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
