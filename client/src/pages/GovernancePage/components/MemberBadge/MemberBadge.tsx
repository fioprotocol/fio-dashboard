import React from 'react';
import classnames from 'classnames';

import { CANDIDATE_STATUS } from '../../../../constants/governance';

import classes from './MemberBadge.module.scss';

type Props = {
  status: string;
};

export const MemberBadge: React.FC<Props> = props => {
  const { status } = props;
  return (
    <div
      className={classnames(
        classes.container,
        status === CANDIDATE_STATUS.CANDIDATE && classes.candidate,
        status === CANDIDATE_STATUS.INACTIVE && classes.inactive,
      )}
    >
      {status}
    </div>
  );
};
