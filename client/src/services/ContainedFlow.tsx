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
} from '../redux/containedFlow/selectors';
import { fioAddresses } from '../redux/fio/selectors';
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
    setContainedParams,
    setStep,
  } = props;

  const history = useHistory();

  // todo: fix query type, works well if we use withRouter wrapper
  const {
    location: { query },
  }: { location: { query: ContainedFlowQuery } } & AnyType = history;

  const containedFlowAction = containedFlowQueryParams
    ? containedFlowQueryParams.action
    : '';

  useEffect(() => {
    if (!containedFlowQueryParams && query?.action) {
      setContainedParams(query);
    }
  }, [containedFlowQueryParams, query, setContainedParams]);

  useEffect(() => {
    if (isContainedFlow && isAuthenticated) {
      if (containedFlowAction !== CONTAINED_FLOW_ACTIONS.REG) {
        if (fioAddresses.length) {
          return setStep(CONTAINED_FLOW_STEPS.ACTION, { containedFlowAction });
        } else {
          return setStep(CONTAINED_FLOW_STEPS.REGISTRATION);
        }
      }

      return setStep(CONTAINED_FLOW_STEPS.ACTION, { containedFlowAction });
    }
  }, [
    fioAddresses.length,
    isAuthenticated,
    isContainedFlow,
    containedFlowAction,
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
  }),
  {
    setContainedParams,
    setStep,
  },
);

export default compose(reduxConnect)(ContainedFlow);
