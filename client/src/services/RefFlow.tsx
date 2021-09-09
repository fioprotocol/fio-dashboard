import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RouterProps, withRouter } from 'react-router-dom';

import { compose } from '../utils';
import { isAuthenticated } from '../redux/profile/selectors';
import { FioAddressDoublet, RefProfile, RefQuery } from '../types';
import {
  loading,
  refLinkError,
  refProfileInfo,
  refProfileQueryParams,
  refStep,
} from '../redux/refProfile/selectors';
import { fioAddresses } from '../redux/fio/selectors';
import { setContainedParams } from '../redux/refProfile/actions';
import { REF_ACTIONS_TO_ROUTES } from '../constants/common';

// example url - /ref/uniqueone?action=SIGNNFT&chain_code=ETH&contract_address=FIO5CniznG2z6yVPc4as69si711R1HJMAAnC3Rxjd4kGri4Kp8D8P&token_id=ETH&url=ifg://dfs.sdfs/sdfs&hash=f83klsjlgsldkfjsdlf&metadata={"creator_url":"https://www.google.com.ua/"}&r=https://www.google.com.ua/

type Props = {
  isAuthenticated: boolean;
  loading: boolean;
  refProfileInfo: RefProfile;
  refProfileQueryParams: RefQuery;
  refStep: string;
  fioAddresses: FioAddressDoublet[];
  setContainedParams: (params: any) => void;
};

const RefFlow = (props: Props & RouterProps): React.FunctionComponent => {
  const {
    isAuthenticated,
    fioAddresses,
    refProfileInfo,
    refProfileQueryParams,
    history,
  } = props;

  useEffect(() => {
    if (
      isAuthenticated &&
      refProfileInfo != null &&
      refProfileInfo.code != null &&
      fioAddresses.length
    ) {
      // todo: should we set steps?
      history.push(REF_ACTIONS_TO_ROUTES[refProfileQueryParams.action]);
    }
  }, [refProfileInfo, isAuthenticated, fioAddresses]);

  return null;
};

// connector
const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    loading,
    refProfileInfo,
    refProfileQueryParams,
    refLinkError,
    refStep,
    fioAddresses,
  }),
  {
    setContainedParams,
  },
);

export default withRouter(compose(reduxConnect)(RefFlow));
