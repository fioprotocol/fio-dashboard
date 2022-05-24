import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router';

import { compose } from '../utils';
import { useContainedFlowActionCondition } from '../hooks/containedFlow';

import { CONTAINED_FLOW_ACTIONS_TO_ROUTES } from '../constants/containedFlow';

import { setContainedParams } from '../redux/containedFlow/actions';
import { containedFlowQueryParams } from '../redux/containedFlow/selectors';

import {
  ContainedFlowQueryParams,
  ContainedFlowQuery,
  AnyType,
} from '../types';

// example url - ?action=SIGNNFT&chain_code=ETH&contract_address=FIO5CniznG2z6yVPc4as69si711R1HJMAAnC3Rxjd4kGri4Kp8D8P&token_id=ETH&url=ifg://dfs.sdfs/sdfs&hash=f83klsjlgsldkfjsdlf&metadata={"creator_url":"https://www.google.com.ua/"}&r=https://www.google.com.ua/

type Props = {
  containedFlowQueryParams: ContainedFlowQueryParams;
  setContainedParams: (params: ContainedFlowQuery) => void;
};

const ContainedFlow: React.FC<Props> | null = props => {
  const { setContainedParams, containedFlowQueryParams } = props;

  const history = useHistory();

  // todo: fix query type
  const {
    location: { query },
  }: { locatoin: { query: ContainedFlowQuery } } & AnyType = history;

  const containedFlowAction = containedFlowQueryParams
    ? containedFlowQueryParams.action
    : '';

  const actionCondition = useContainedFlowActionCondition(containedFlowAction);

  useEffect(() => {
    if (!containedFlowQueryParams && query?.action) {
      setContainedParams(query);
    }
  }, [containedFlowQueryParams, query, setContainedParams]);

  useEffect(() => {
    if (actionCondition)
      history.push(CONTAINED_FLOW_ACTIONS_TO_ROUTES[containedFlowAction]);
  }, [actionCondition, history, containedFlowAction]);

  return null;
};

// connector
const reduxConnect = connect(
  createStructuredSelector({
    containedFlowQueryParams,
  }),
  {
    setContainedParams,
  },
);

export default compose(reduxConnect)(ContainedFlow);
