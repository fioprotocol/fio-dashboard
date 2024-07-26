import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RouterProps, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router';

import apis from '../api';

import { compose } from '../utils';
import { setExpirationTime } from '../util/cookies';
import { log } from '../util/general';

import { isAuthenticated, user } from '../redux/profile/selectors';
import { refProfileInfo } from '../redux/refProfile/selectors';
import { fioWallets } from '../redux/fio/selectors';

import { getInfo, clear } from '../redux/refProfile/actions';
import { refreshFioNames } from '../redux/fio/actions';

import {
  REFERRAL_PROFILE_COOKIE_EXPIRATION_PEROID,
  USER_REFERRAL_PROFILE_COOKIE_EXPIRATION_PERIOD,
  REFERRAL_PROFILE_COOKIE_NAME,
} from '../constants/cookies';
import { ROUTES } from '../constants/routes';
import { REF_PROFILE_TYPE } from '../constants/common';

import { IS_REFERRAL_PROFILE_PATH } from '../constants/regExps';

import { FioWalletDoublet, RefProfile, User } from '../types';
import { RefCookiesParams } from '../types/general';

type Props = {
  isAuthenticated: boolean;
  user: User;
  refProfileInfo: RefProfile;
  fioWallets: FioWalletDoublet[];
  refreshFioNames: (publicKey: string) => void;
  getInfo: (refProfileCode: string | null) => void;
  clear: () => void;
};

type Location = {
  location: { query: { ref?: string }; pathname: string };
};

const Ref = (
  props: Props & RouterProps & Location,
): React.FunctionComponent | null => {
  const {
    isAuthenticated,
    fioWallets,
    refProfileInfo,
    user,
    location: { pathname, query },
    refreshFioNames,
    getInfo,
    clear,
  } = props;
  const history = useHistory();

  const fioWalletsAmount = fioWallets.length;

  const isRefLink = IS_REFERRAL_PROFILE_PATH.test(pathname) || query?.ref;
  const isNoProfileFlow = refProfileInfo?.settings?.hasNoProfileFlow;

  const cookieRefProfileCode = Cookies.get(REFERRAL_PROFILE_COOKIE_NAME) || '';

  const redirectToDomainLandingPage = useCallback(
    (refType: string) => {
      if (refType === REF_PROFILE_TYPE.AFFILIATE && isRefLink) {
        history.push(ROUTES.FIO_DOMAIN);
      }
    },
    [history, isRefLink],
  );

  const setServerCookies = useCallback(async (params: RefCookiesParams) => {
    try {
      await apis.general.setServerCookies(params);
    } catch (error) {
      log.error(error);
    }
  }, []);

  useEffect(() => {
    if (
      isAuthenticated &&
      refProfileInfo != null &&
      refProfileInfo.code != null
    ) {
      for (const fioWallet of fioWallets) {
        refreshFioNames(fioWallet.publicKey);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, refProfileInfo, fioWalletsAmount, refreshFioNames]);

  useEffect(() => {
    // handle cookies for non auth user
    if (!isAuthenticated) {
      // Set refProfileCode to cookies from ref link
      if (refProfileInfo?.code != null) {
        setServerCookies({
          cookieName: REFERRAL_PROFILE_COOKIE_NAME,
          cookieValue: refProfileInfo.code,
          options: {
            expires: isNoProfileFlow
              ? null
              : setExpirationTime(REFERRAL_PROFILE_COOKIE_EXPIRATION_PEROID),
          },
        });
        redirectToDomainLandingPage(refProfileInfo?.type);
      } else {
        // Update refProfileCode cookies and set ref profile. Works for non auth user and not ref link
        if (!isRefLink) {
          getInfo(cookieRefProfileCode);
        }
      }
    } else {
      redirectToDomainLandingPage(refProfileInfo?.type);
    }
  }, [
    cookieRefProfileCode,
    refProfileInfo?.code,
    refProfileInfo?.type,
    isAuthenticated,
    isNoProfileFlow,
    isRefLink,
    getInfo,
    redirectToDomainLandingPage,
    setServerCookies,
  ]);

  useEffect(() => {
    // load profile when have ref link
    if (isRefLink) {
      const pathnameSegments = pathname.split('/');
      const refProfileCode =
        query?.ref || pathnameSegments[pathnameSegments.length - 1];

      if (!refProfileInfo) {
        getInfo(refProfileCode);
      }
    }
  }, [isRefLink, pathname, query?.ref, refProfileInfo, getInfo]);

  // Set user refProfileCode to cookies
  useEffect(() => {
    if (
      isAuthenticated &&
      !isRefLink &&
      !!user?.refProfile?.code &&
      cookieRefProfileCode !== user?.refProfile?.code
    ) {
      const refProfileCode = user?.refProfile?.code || '';
      getInfo(refProfileCode);
      setServerCookies({
        cookieName: REFERRAL_PROFILE_COOKIE_NAME,
        cookieValue: refProfileCode,
        options: {
          expires: setExpirationTime(
            USER_REFERRAL_PROFILE_COOKIE_EXPIRATION_PERIOD,
          ),
        },
      });
    } else if (
      isAuthenticated &&
      !isRefLink &&
      !!refProfileInfo?.code &&
      !user?.refProfile?.code
    ) {
      setServerCookies({
        cookieName: REFERRAL_PROFILE_COOKIE_NAME,
        cookieValue: null,
      });
      clear();
    }
  }, [
    isAuthenticated,
    isRefLink,
    refProfileInfo?.code,
    user?.refProfile?.code,
    getInfo,
    clear,
    cookieRefProfileCode,
    setServerCookies,
  ]);

  useEffect(() => {
    const tpid = refProfileInfo?.tpid || process.env.REACT_APP_DEFAULT_TPID;
    apis.fio.setTpid(
      refProfileInfo?.type === REF_PROFILE_TYPE.REF
        ? tpid
        : process.env.REACT_APP_DEFAULT_TPID,
      tpid,
    );
  }, [refProfileInfo?.type, refProfileInfo?.tpid]);

  return null;
};

// connector
const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    user,
    refProfileInfo,
    fioWallets,
  }),
  {
    refreshFioNames,
    getInfo,
    clear,
  },
);

export default withRouter(compose(reduxConnect)(Ref));
