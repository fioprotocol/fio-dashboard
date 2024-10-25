import { FC, PropsWithChildren } from 'react';

import Title from './Title';
import classes from '../styles/GovernancePageContainer.module.scss';
import { VoteBadge } from './VoteBadge';
import { GovernanceSelector } from './GovernanceSelector';

export const GovernancePageContainer: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <div className={classes.container}>
      <div className={classes.layout}>
        <Title
          title="Governance"
          subtitle="Make your voice heard! Vote on the FIO Foundation Board of Directors and FIO Chain Block Producers."
        />
        <GovernanceSelector />
        {children}
      </div>
      <div className={classes.actionBadges}>
        <VoteBadge />
      </div>
    </div>
  );
};
