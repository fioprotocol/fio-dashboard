import classnames from 'classnames';

import classes from './CartSmallContainer.module.scss';

const CartSmallContainer = props => {
  const { children, isAquaColor, isHintColor, hasBigMargin } = props;
  return (
    <div
      className={classnames(
        classes.container,
        isAquaColor && classes.aqua,
        isHintColor && classes.hint,
        hasBigMargin && classes.hasBigMargin,
      )}
    >
      {children}
    </div>
  );
};

export default CartSmallContainer;
