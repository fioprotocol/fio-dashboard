import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { useCheckIfDesktop } from '../../../screenType';

import { ROUTES } from '../../../constants/routes';
import classes from '../MainHeader.module.scss';
import { ActionButtons } from './ActionButtons';
import SideMenu from './SideMenu';
import { CartItem } from '../../../types';

type RegularNavProps = {
  cartItems: CartItem[];
  isMenuOpen: boolean;
  toggleMenuOpen: (openState: boolean) => void;
  edgeAuthLoading: boolean;
  profileLoading: boolean;
  showLogin: () => void;
  closeMenu: () => void;
};

const RegularNav = (props: RegularNavProps) => {
  const { cartItems } = props;

  const isDesktop = useCheckIfDesktop();

  return (
    <div className={classes.regularNavContainer}>
      <div className={classes.link}>
        <a
          href="https://fioprotocol.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
        >
          <FontAwesomeIcon
            icon="arrow-left"
            className={classnames(classes.arrow, 'mr-2', 'text-white')}
          />
          Go to fioprotocol.io
        </a>
      </div>
      <Navbar className="pr-0">
        <Nav className="mr-auto align-items-center">
          <Nav.Link
            className={classnames(classes.navItem, 'text-white')}
            as={Link}
            to={
              cartItems.length > 0
                ? ROUTES.CART
                : ROUTES.FIO_ADDRESSES_SELECTION
            }
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
          {isDesktop ? (
            <ActionButtons {...props} />
          ) : (
            <SideMenu {...props}>
              <ActionButtons {...props} />
            </SideMenu>
          )}
        </Nav>
      </Navbar>
    </div>
  );
};

export default RegularNav;
