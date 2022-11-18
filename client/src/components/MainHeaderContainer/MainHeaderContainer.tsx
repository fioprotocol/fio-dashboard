import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import SiteLink from '../MainHeader/components/SiteLink';

import { ROUTES } from '../../constants/routes';

import { RefProfile } from '../../types';

import classes from './MainHeaderContainer.module.scss';

type Props = {
  hideSiteLink?: boolean;
  isAdmin?: boolean;
  isMenuOpen?: boolean;
  refProfileInfo?: RefProfile;
  closeMenu?: () => void;
};

export const MainHeaderContainer: React.FC<Props> = props => {
  const {
    children,
    hideSiteLink,
    isAdmin,
    isMenuOpen,
    refProfileInfo,
    closeMenu,
  } = props;

  return (
    <div className={classnames(classes.header, isMenuOpen && classes.isOpen)}>
      {!isAdmin ? (
        <Link to={ROUTES.HOME}>
          <div className={classes.logo} onClick={closeMenu} />
        </Link>
      ) : (
        <div>
          <div
            className={classes.logo}
            onClick={() => {
              closeMenu && closeMenu();
              window.open(ROUTES.HOME, '_blank');
            }}
          />
        </div>
      )}
      <SiteLink refProfileInfo={refProfileInfo} hideSiteLink={hideSiteLink} />
      {children}
    </div>
  );
};
