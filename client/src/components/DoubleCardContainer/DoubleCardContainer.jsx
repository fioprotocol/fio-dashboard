import React from 'react';
import LayoutContainer from '../LayoutContainer/LayoutContainer';

import classes from './DoubleCardContainer.module.scss';

const DoubleCardContainer = props => {
  const { title, bigCart, smallCart } = props;
  return (
    <LayoutContainer title={title}>
      <div className={classes.container}>
        <div className={classes.cardContainer}>{bigCart}</div>
        <hr className={classes.vertical} />
        {smallCart}
      </div>
    </LayoutContainer>
  );
};

export default DoubleCardContainer;
