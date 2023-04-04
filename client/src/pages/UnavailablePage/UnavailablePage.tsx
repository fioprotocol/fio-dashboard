import React from 'react';
import classnames from 'classnames';

import classes from './UnavailablePage.module.scss';

const UnavailablePage: React.FC = () => {
  return (
    <div className={classes.container}>
      <h1 className={classes.header}>
        <span className="boldText">UNAVAILABLE</span>
      </h1>
      <h2 className={classes.subHeader}>
        <span className={classnames(classes.coloredText, 'boldText')}>
          The website is currently down for maintenance
        </span>
      </h2>
      <div className={classes.bottom} />
    </div>
  );
};

export default UnavailablePage;
