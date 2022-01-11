import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

type Props = {
  isDisabled: boolean;
  classname?: string;
  to: string;
};

const Link: React.FC<Props> = props => {
  const { children, isDisabled, classname = null, ...rest } = props;
  return (
    <span className={classname}>
      {isDisabled ? children : <RouterLink {...rest}>{children}</RouterLink>}
    </span>
  );
};

export default Link;
