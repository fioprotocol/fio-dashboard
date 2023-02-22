import React from 'react';

import { useFioAddresses } from '../../util/hooks';

import classes from './ContainedFlowWrapper.module.scss';

type Props = {
  isAuthenticated: boolean;
  isContainedFlow: boolean;
  containedFlowLinkError: string | null;
};

const ContainedFlowWrapper: React.FC<Props> = props => {
  const { children, containedFlowLinkError } = props;
  useFioAddresses();

  if (containedFlowLinkError)
    return (
      <div className={classes.container}>
        <div className={classes.validationErrorContainer}>
          {containedFlowLinkError}
        </div>
      </div>
    );

  return <>{children}</>;
};

export default ContainedFlowWrapper;
