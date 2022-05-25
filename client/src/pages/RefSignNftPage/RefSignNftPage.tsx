import React from 'react';
import { Redirect } from 'react-router-dom';

import SignNft from '../../components/SignNft';
import FioLoader from '../../components/common/FioLoader/FioLoader';

import { useFioAddresses } from '../../util/hooks';

import { ROUTES } from '../../constants/routes';
import { CONTAINED_FLOW_ACTIONS } from '../../constants/containedFlow';

import { ContainedFlowQueryParams } from '../../types';

import classes from './RefSignNftPage.module.scss';

type Props = {
  isAuthenticated: boolean;
  containedFlowQueryParams: ContainedFlowQueryParams;
};

export const RefSignNftPage: React.FC<Props> = props => {
  const { containedFlowQueryParams, isAuthenticated } = props;

  const [fioAddresses] = useFioAddresses();

  if (!isAuthenticated || !fioAddresses.length) {
    return <FioLoader wrap={true} />;
  }

  if (containedFlowQueryParams == null) {
    return <Redirect to={ROUTES.HOME} />;
  }

  switch (containedFlowQueryParams.action) {
    case CONTAINED_FLOW_ACTIONS.SIGNNFT: {
      return (
        <SignNft
          initialValues={{
            creatorUrl: containedFlowQueryParams.metadata.creatorUrl,
            ...containedFlowQueryParams,
          }}
          fioAddressName={fioAddresses[0].name}
        />
      );
    }
    default:
      return (
        <div className={classes.container}>
          <div className={classes.validationErrorContainer}>
            Wrong action page. Close the page and open link again.
          </div>
        </div>
      );
  }
};
