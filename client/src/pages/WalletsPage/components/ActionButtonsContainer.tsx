import React from 'react';

import classes from '../styles/ActionButtonsContainer.module.scss';

type Props = {
  children: React.ReactNode;
};

const ActionButtonsContainer: React.FC<Props> = props => {
  return <div className={classes.actionsContainer}>{props.children}</div>;
};

export default ActionButtonsContainer;
