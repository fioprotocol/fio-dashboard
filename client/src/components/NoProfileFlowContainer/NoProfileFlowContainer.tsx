import React from 'react';

import { RefFioHandleBanner } from '../RefFioHandleBanner';

import { useContext } from './NoProfileFlowContainerContext';

import classes from './NoProfileFlowContainer.module.scss';

type Props = {};

export const NoProfileFlowContainer: React.FC<Props> = props => {
  const { children } = props;
  const { refProfile, publicKey } = useContext();

  const domainName = refProfile?.settings?.domains[0]?.name || 'rulez';

  return (
    <div className={classes.container}>
      {React.cloneElement(children as React.ReactElement, {
        refProfile,
        publicKey,
      })}
      <RefFioHandleBanner domainName={domainName} />
    </div>
  );
};
