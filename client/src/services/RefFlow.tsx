import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RouterProps, withRouter } from 'react-router-dom';

import { compose, putParamsToUrl } from '../utils';
import { FioAddressDoublet, RefProfile, RefQuery, User } from '../types';

import { isAuthenticated, user } from '../redux/profile/selectors';
import {
  loading,
  refLinkError,
  refProfileInfo,
  refProfileQueryParams,
  refStep,
} from '../redux/refProfile/selectors';
import { fioAddresses, addressesFetched } from '../redux/fio/selectors';

import { setContainedParams } from '../redux/refProfile/actions';
import { toggleFreeAddressAwaiter } from '../redux/modal/actions';

import { REF_ACTIONS_TO_ROUTES } from '../constants/common';
import { ROUTES } from '../constants/routes';

// example url - /ref/uniqueone?action=SIGNNFT&chain_code=ETH&contract_address=FIO5CniznG2z6yVPc4as69si711R1HJMAAnC3Rxjd4kGri4Kp8D8P&token_id=ETH&url=ifg://dfs.sdfs/sdfs&hash=f83klsjlgsldkfjsdlf&metadata={"creator_url":"https://www.google.com.ua/"}&r=https://www.google.com.ua/

const ACTION_ROUTES = [ROUTES.REF_SIGN_NFT];

type Props = {
  isAuthenticated: boolean;
  user: User;
  loading: boolean;
  refProfileInfo: RefProfile;
  refProfileQueryParams: RefQuery;
  refStep: string;
  fioAddresses: FioAddressDoublet[];
  addressesFetched: { [publicKey: string]: boolean };
  setContainedParams: (params: any) => void;
  toggleFreeAddressAwaiter: (show: boolean) => void;
};

const RefFlow = (props: Props & RouterProps): React.FunctionComponent => {
  const {
    isAuthenticated,
    fioAddresses,
    refProfileInfo,
    refProfileQueryParams,
    history,
    user,
    history: {
      location: { pathname },
    },
    addressesFetched,
    toggleFreeAddressAwaiter,
  } = props;

  const fioAddressesAmount = fioAddresses.length;
  const freeAddresses =
    isAuthenticated && user.freeAddresses != null ? user.freeAddresses : [];

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
        putParamsToUrl(REF_ACTIONS_TO_ROUTES[refProfileQueryParams.action], {
          refProfileCode: refProfileInfo.code,
        }),
      );
    }
  }, [refProfileInfo, isAuthenticated, fioAddressesAmount, pathname]);

  useEffect(() => {
    let allAddressesFetched = false;
    for (const checked of Object.values(addressesFetched)) {
      if (!checked) {
        allAddressesFetched = false;
        break;
      }
      allAddressesFetched = true;
    }
    if (
      isAuthenticated &&
      refProfileInfo != null &&
      refProfileInfo.code != null &&
      fioAddressesAmount === 0 &&
      pathname !== ROUTES.PURCHASE &&
      freeAddresses.length > 0 &&
      allAddressesFetched
    ) {
      toggleFreeAddressAwaiter(true);
    }
  }, [
    refProfileInfo,
    isAuthenticated,
    fioAddressesAmount,
    pathname,
    freeAddresses,
    addressesFetched,
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
    addressesFetched,
  }),
  {
    setContainedParams,
    toggleFreeAddressAwaiter,
  },
);

export default withRouter(compose(reduxConnect)(RefFlow));
