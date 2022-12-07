import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RouterProps, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router';

import apis from '../api';

import { compose } from '../utils';
import { setCookies } from '../util/cookies';

import { isAuthenticated, user } from '../redux/profile/selectors';
import { refProfileInfo } from '../redux/refProfile/selectors';
import { fioWallets } from '../redux/fio/selectors';

import { getInfo } from '../redux/refProfile/actions';
import { refreshFioNames } from '../redux/fio/actions';

import {
  REFERRAL_PROFILE_COOKIE_EXPIRATION_PEROID,
  USER_REFERRAL_PROFILE_COOKIE_EXPIRATION_PERIOD,
  REFERRAL_PROFILE_COOKIE_NAME,
} from '../constants/cookies';

import { IS_REFERRAL_PROFILE_PATH } from '../constants/regExps';

import { FioWalletDoublet, RefProfile, User } from '../types';
import { REF_PROFILE_TYPE } from '../constants/common';
import { ROUTES } from '../constants/routes';

type Props = {
  isAuthenticated: boolean;
  user: User;
  refProfileInfo: RefProfile;
  fioWallets: FioWalletDoublet[];
  refreshFioNames: (publicKey: string) => void;
  getInfo: (refProfileCode: string | null) => void;
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
  } = props;
  const history = useHistory();

  const fioWalletsAmount = fioWallets.length;

  const isRefLink = IS_REFERRAL_PROFILE_PATH.test(pathname) || query.ref;

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
      const cookieRefProfileCode =
        Cookies.get(REFERRAL_PROFILE_COOKIE_NAME) || '';
      if (refProfileInfo?.code != null) {
        setCookies(REFERRAL_PROFILE_COOKIE_NAME, refProfileInfo.code, {
          expires: REFERRAL_PROFILE_COOKIE_EXPIRATION_PEROID,
        });
        if (
          refProfileInfo?.type === REF_PROFILE_TYPE.AFFILIATE &&
          (!cookieRefProfileCode ||
            refProfileInfo.code !== cookieRefProfileCode)
        ) {
          history.push(ROUTES.FIO_DOMAIN);
        }
      } else {
        // Update refProfileCode cookies and set ref profile. Works for non auth user and not ref link
        if (!isRefLink) {
          getInfo(cookieRefProfileCode);
        }
      }
    }
  }, [
    refProfileInfo?.code,
    refProfileInfo?.type,
    isAuthenticated,
    isRefLink,
    getInfo,
    history,
  ]);

  useEffect(() => {
    // load profile when have ref link
    if (isRefLink) {
      const refProfileCode = pathname.split('/')[2] || query.ref;
      getInfo(refProfileCode);
    }
  }, [isRefLink, pathname, query.ref, getInfo]);

  // Set user refProfileCode to cookies
  useEffect(() => {
    if (isAuthenticated && !isRefLink && !refProfileInfo?.code) {
      const refProfileCode = user?.refProfile?.code || '';

      getInfo(refProfileCode);
      setCookies(REFERRAL_PROFILE_COOKIE_NAME, refProfileCode, {
        expires: USER_REFERRAL_PROFILE_COOKIE_EXPIRATION_PERIOD,
      });
    }
  }, [
    isAuthenticated,
    isRefLink,
    refProfileInfo?.code,
    user?.refProfile?.code,
    getInfo,
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
  },
);

export default withRouter(compose(reduxConnect)(Ref));
