import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { SiteLink } from '../MainHeader/components/SiteLink/SiteLink';

import { ROUTES } from '../../constants/routes';
import { REF_PROFILE_SLUG_NAME } from '../../constants/ref';

import { RefProfile } from '../../types';

import fioLogoSrc from '../../assets/images/fio-logo.svg';

import classes from './MainHeaderContainer.module.scss';

type Props = {
  hideSiteLink?: boolean;
  isAdmin?: boolean;
  isMenuOpen?: boolean;
  noBoxShadow?: boolean;
  refProfileInfo?: RefProfile;
  queryParams?: string;
  closeMenu?: () => void;
};

export const MainHeaderContainer: React.FC<Props> = props => {
  const {
    children,
    hideSiteLink,
    isAdmin,
    isMenuOpen,
    noBoxShadow,
    refProfileInfo,
    queryParams,
    closeMenu,
  } = props;
  const isNoProfileFlow = refProfileInfo?.settings?.hasNoProfileFlow;

  const logoSrc =
    refProfileInfo?.settings?.isBranded || isNoProfileFlow
      ? refProfileInfo.settings.img
        ? refProfileInfo.settings.img
        : fioLogoSrc
      : fioLogoSrc;

  return (
    <div
      className={classnames(
        classes.header,
        isMenuOpen && classes.isOpen,
        noBoxShadow && classes.noBoxShadow,
      )}
    >
      {!isAdmin ? (
        <Link
          to={{
            pathname: isNoProfileFlow
              ? `${ROUTES.NO_PROFILE_REGISTER_FIO_HANDLE.replace(
                  REF_PROFILE_SLUG_NAME,
                  refProfileInfo?.code,
                )}`
              : ROUTES.HOME,
            search: queryParams || null,
          }}
        >
          <div className={classes.logoContainer} onClick={closeMenu}>
            <img src={logoSrc} alt="Branded Logo" />
          </div>
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
