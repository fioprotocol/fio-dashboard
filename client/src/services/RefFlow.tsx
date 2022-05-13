import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RouterProps, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

// import { compose, putParamsToUrl } from '../utils';
import { compose } from '../utils';
import { setCookies } from '../util/cookies';

import {
  FioAddressDoublet,
  FioWalletDoublet,
  RefProfile,
  RefQuery,
  RefQueryParams,
  User,
} from '../types';

import { isAuthenticated, user } from '../redux/profile/selectors';
import {
  loading,
  refLinkError,
  refProfileInfo,
  refProfileQueryParams,
  refStep,
} from '../redux/refProfile/selectors';
import { fioWallets, fioAddresses } from '../redux/fio/selectors';

import { setContainedParams, getInfo } from '../redux/refProfile/actions';
import { refreshFioNames } from '../redux/fio/actions';

// import { REF_ACTIONS_TO_ROUTES } from '../constants/common';
import { ROUTES } from '../constants/routes';
import {
  REFERRAL_PROFILE_COOKIE_EXPIRATION_PEROID,
  USER_REFERRAL_PROFILE_COOKIE_EXPIRATION_PERIOD,
  REFERRAL_PROFILE_COOKIE_NAME,
} from '../constants/cookies';

import { IS_REFERRAL_PROFILE_PATH } from '../constants/regExps';

// example url - /ref/uniqueone?action=SIGNNFT&chain_code=ETH&contract_address=FIO5CniznG2z6yVPc4as69si711R1HJMAAnC3Rxjd4kGri4Kp8D8P&token_id=ETH&url=ifg://dfs.sdfs/sdfs&hash=f83klsjlgsldkfjsdlf&metadata={"creator_url":"https://www.google.com.ua/"}&r=https://www.google.com.ua/

const ACTION_ROUTES = [ROUTES.REF_SIGN_NFT];

type Props = {
  isAuthenticated: boolean;
  user: User;
  loading: boolean;
  refProfileInfo: RefProfile;
  refProfileQueryParams: RefQueryParams;
  refStep: string;
  fioAddresses: FioAddressDoublet[];
  fioWallets: FioWalletDoublet[];
  refreshFioNames: (publicKey: string) => void;
  setContainedParams: (params: RefQuery) => void;
  getInfo: (refProfileCode: string | null) => void;
};

const RefFlow = (
  props: Props & RouterProps,
): React.FunctionComponent | null => {
  const {
    isAuthenticated,
    fioAddresses,
    fioWallets,
    refProfileInfo,
    refProfileQueryParams,
    user,
    history,
    history: {
      location: { pathname },
    },
    refreshFioNames,
    getInfo,
  } = props;

  const fioAddressesAmount = fioAddresses.length;
  const fioWalletsAmount = fioWallets.length;
  const refAction = refProfileQueryParams ? refProfileQueryParams.action : '';
  const isRefLink = IS_REFERRAL_PROFILE_PATH.test(pathname);

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
    if (
      isAuthenticated &&
      refProfileInfo != null &&
      refProfileInfo.code != null &&
      fioAddressesAmount > 0 &&
      pathname !== ROUTES.PURCHASE &&
      ACTION_ROUTES.indexOf(pathname) < 0
    ) {
      // todo: handle redirect on contained flow
      // todo: should we set steps?
      // history.push(
      //   putParamsToUrl(REF_ACTIONS_TO_ROUTES[refAction], {
      //     refProfileCode: refProfileInfo.code,
      //   }),
      // );
    }
  }, [
    refProfileInfo,
    isAuthenticated,
    fioAddressesAmount,
    pathname,
    history,
    refAction,
  ]);

  useEffect(() => {
    // handle cookies for non auth user
    if (!isAuthenticated) {
      // Set refProfileCode to cookies from ref link
      if (refProfileInfo?.code != null) {
        setCookies(REFERRAL_PROFILE_COOKIE_NAME, refProfileInfo.code, {
          expires: REFERRAL_PROFILE_COOKIE_EXPIRATION_PEROID,
        });
      } else {
        // Update refProfileCode cookies and set ref profile. Works for non auth user and not ref link
        if (!isRefLink) {
          const cookieRefProfileCode =
            Cookies.get(REFERRAL_PROFILE_COOKIE_NAME) || null;

          getInfo(cookieRefProfileCode);
        }
      }
    }
  }, [refProfileInfo?.code, isAuthenticated, isRefLink, getInfo]);

  useEffect(() => {
    // load profile when have ref link
    if (isRefLink && !isAuthenticated) {
      const refProfileCode = pathname.split('/')[2];
      getInfo(refProfileCode);
    }
  }, [isRefLink, pathname, isAuthenticated, getInfo]);

  // Set user refProfileCode to cookies
  useEffect(() => {
    if (isAuthenticated) {
      const refProfileCode = user?.refProfile?.code || null;

      getInfo(refProfileCode);
      setCookies(REFERRAL_PROFILE_COOKIE_NAME, refProfileCode, {
        expires: USER_REFERRAL_PROFILE_COOKIE_EXPIRATION_PERIOD,
      });
    }
  }, [isAuthenticated, user?.refProfile?.code, getInfo]);

  return null;
};

// connector
const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    user,
    loading,
    refProfileInfo,
    refProfileQueryParams,
    refLinkError,
    refStep,
    fioAddresses,
    fioWallets,
  }),
  {
    refreshFioNames,
    setContainedParams,
    getInfo,
  },
);

export default withRouter(compose(reduxConnect)(RefFlow));
