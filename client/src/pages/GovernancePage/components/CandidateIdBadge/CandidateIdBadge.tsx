import React from 'react';

import classes from './CandidateIdBadge.module.scss';

type Props = {
  id: string;
};

export const CandidateIdBadge: React.FC<Props> = props => {
  return <div className={classes.container}>Candidate: {props.id}</div>;
};
