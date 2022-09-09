import React from 'react';
import classnames from 'classnames';

import classes from './NotFoundPage.module.scss';

const NotFoundPage: React.FC = () => {
  return (
    <div className={classes.container}>
      <h1 className={classes.header}>
        <span className="boldText">404</span>
      </h1>
      <h2 className={classes.subHeader}>
        <span className="boldText">Sorry, </span>
        <span className={classnames(classes.coloredText, 'boldText')}>
          this page isn’t available.
        </span>
      </h2>
      <p className={classes.microHeader}>
        The link you followed may be broken, or the page may have been moved.
      </p>
      <div className={classes.bottom} />
    </div>
  );
};

export default NotFoundPage;
