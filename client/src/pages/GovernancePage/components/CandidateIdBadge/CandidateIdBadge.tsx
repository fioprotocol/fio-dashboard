import React from 'react';
import classnames from 'classnames';

import classes from './CandidateIdBadge.module.scss';

type Props = {
  id: string;
  className?: string;
};

export const CandidateIdBadge: React.FC<Props> = props => {
  return (
    <div className={classnames(classes.container, props.className)}>
      Candidate: {props.id}
    </div>
  );
};
