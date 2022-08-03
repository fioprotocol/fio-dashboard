import React from 'react';

import { useFioAddresses } from '../../util/hooks';

import FioLoader from '../common/FioLoader/FioLoader';

import classes from './ContainedFlowWrapper.module.scss';

type Props = {
  isAuthenticated: boolean;
  isContainedFlow: boolean;
  containedFlowLinkError: string | null;
};

const ContainedFlowWrapper: React.FC<Props> = props => {
  const {
    isAuthenticated,
    children,
    isContainedFlow,
    containedFlowLinkError,
  } = props;
  const [, loading] = useFioAddresses();

  if (containedFlowLinkError)
    return (
      <div className={classes.container}>
        <div className={classes.validationErrorContainer}>
          {containedFlowLinkError}
        </div>
      </div>
    );

  if (isAuthenticated && isContainedFlow && loading)
    return (
      <div className="d-flex justify-content-center align-items-center">
        <FioLoader />
      </div>
    );

  return <>{children}</>;
};

export default ContainedFlowWrapper;
