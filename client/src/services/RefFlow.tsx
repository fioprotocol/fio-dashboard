import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RouterProps, withRouter } from 'react-router-dom';

import { compose, putParamsToUrl } from '../utils';
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

import { setContainedParams } from '../redux/refProfile/actions';
import { refreshFioNames } from '../redux/fio/actions';

import { REF_ACTIONS_TO_ROUTES } from '../constants/common';
import { ROUTES } from '../constants/routes';

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
    history,
    history: {
      location: { pathname },
    },
    refreshFioNames,
  } = props;

  const fioAddressesAmount = fioAddresses.length;
  const fioWalletsAmount = fioWallets.length;
  const refAction = refProfileQueryParams ? refProfileQueryParams.action : '';

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
      // todo: should we set steps?
      history.push(
        putParamsToUrl(REF_ACTIONS_TO_ROUTES[refAction], {
          refProfileCode: refProfileInfo.code,
        }),
      );
    }
  }, [
    refProfileInfo,
    isAuthenticated,
    fioAddressesAmount,
    pathname,
    history,
    refAction,
  ]);

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
  },
);

export default withRouter(compose(reduxConnect)(RefFlow));
