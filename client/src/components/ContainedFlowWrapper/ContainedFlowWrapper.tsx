import React from 'react';

import { useFioAddresses } from '../../util/hooks';

import classes from './ContainedFlowWrapper.module.scss';

// TODO: could be changed to getAllFioHandlesWithPublicAddresses but needs more testing
const FioAddressesLoader: React.FC = () => {
  useFioAddresses();
  return null;
};

type Props = {
  isAuthenticated: boolean;
  isContainedFlow: boolean;
  containedFlowLinkError: string | null;
};

const ContainedFlowWrapper: React.FC<Props> = props => {
  const { children, containedFlowLinkError, isContainedFlow } = props;

  if (containedFlowLinkError)
    return (
      <div className={classes.container}>
        <div className={classes.validationErrorContainer}>
          {containedFlowLinkError}
        </div>
      </div>
    );

  return (
    <>
      {isContainedFlow && <FioAddressesLoader />}
      {children}
    </>
  );
};

export default ContainedFlowWrapper;
