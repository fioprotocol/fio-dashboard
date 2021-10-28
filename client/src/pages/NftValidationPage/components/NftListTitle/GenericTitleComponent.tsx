import React from 'react';
import classes from './GenericTitleComponent.module.scss';

type Props = {
  title: string;
  value: string;
};

const GenericTitleComponent: React.FC<Props> = props => {
  const { title, value } = props;
  return (
    <div className={classes.container}>
      <h5 className={classes.title}>{title}:</h5>
      <p className={classes.value}>{value}</p>
    </div>
  );
};

export default GenericTitleComponent;
