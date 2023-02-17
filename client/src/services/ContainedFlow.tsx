import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router';

import { compose } from '../utils';

import {
  CONTAINED_FLOW_ACTIONS,
  CONTAINED_FLOW_STEPS,
} from '../constants/containedFlow';

import { setContainedParams, setStep } from '../redux/containedFlow/actions';
import {
  containedFlowQueryParams,
  isContainedFlow,
  containedFlowStep,
} from '../redux/containedFlow/selectors';
import { fioAddresses, fioAddressesLoading } from '../redux/fio/selectors';
import { isAuthenticated } from '../redux/profile/selectors';

import {
  ContainedFlowQueryParams,
  ContainedFlowQuery,
  AnyType,
  FioAddressDoublet,
} from '../types';

// example url - ?action=SIGNNFT&chain_code=ETH&contract_address=FIO5CniznG2z6yVPc4as69si711R1HJMAAnC3Rxjd4kGri4Kp8D8P&token_id=ETH&url=ifg://dfs.sdfs/sdfs&hash=f83klsjlgsldkfjsdlf&metadata={"creator_url":"https://www.google.com.ua/"}&r=https://www.google.com.ua/

type Props = {
  containedFlowQueryParams: ContainedFlowQueryParams;
  fioAddresses: FioAddressDoublet[];
  isAuthenticated: boolean;
  isContainedFlow: boolean;
  containedFlowStep: string;
  fioAddressesLoading: boolean;
  setContainedParams: (params: ContainedFlowQuery) => void;
  setStep: (
    step: string,
    data?: {
      containedFlowAction?: string;
    },
  ) => void;
};

const ContainedFlow: React.FC<Props> | null = props => {
  const {
    containedFlowQueryParams,
    fioAddresses,
    isAuthenticated,
    isContainedFlow,
    containedFlowStep,
    fioAddressesLoading,
    setContainedParams,
    setStep,
  } = props;

  const history = useHistory();
  // todo: fix query type, works well if we use withRouter wrapper
  const {
    location: { query },
  }: { location: { query: ContainedFlowQuery } } & AnyType = history;

  const containedFlowAction = containedFlowQueryParams
    ? containedFlowQueryParams.action?.toUpperCase()
    : '';

  useEffect(() => {
    if (!containedFlowQueryParams && query?.action) {
      setContainedParams(query);
    }
  }, [containedFlowQueryParams, query, setContainedParams]);

  useEffect(() => {
    if (isContainedFlow && isAuthenticated) {
      if (containedFlowAction !== CONTAINED_FLOW_ACTIONS.REG) {
        if (fioAddressesLoading) return;
        if (
          containedFlowStep !== CONTAINED_FLOW_STEPS.REGISTRATION &&
          !fioAddresses.length
        ) {
          return setStep(CONTAINED_FLOW_STEPS.REGISTRATION);
        }
        if (
          fioAddresses.length &&
          containedFlowStep !== CONTAINED_FLOW_STEPS.REGISTRATION
        ) {
          return setStep(CONTAINED_FLOW_STEPS.ACTION, {
            containedFlowAction,
          });
        }
        return;
      }
      if (containedFlowStep !== CONTAINED_FLOW_STEPS.ACTION) {
        return setStep(CONTAINED_FLOW_STEPS.ACTION, { containedFlowAction });
      }
    }
  }, [
    isContainedFlow,
    isAuthenticated,
    fioAddresses.length,
    containedFlowAction,
    containedFlowStep,
    fioAddressesLoading,
    setStep,
  ]);

  return null;
};

// connector
const reduxConnect = connect(
  createStructuredSelector({
    containedFlowQueryParams,
    fioAddresses,
    isAuthenticated,
    isContainedFlow,
    containedFlowStep,
    fioAddressesLoading,
  }),
  {
    setContainedParams,
    setStep,
  },
);

export default compose(reduxConnect)(ContainedFlow);
