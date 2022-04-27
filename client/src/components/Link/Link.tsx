import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { AnyObject } from '../../types';

type Props = {
  isDisabled: boolean;
  classname?: string;
  to: string;
  onClick?: (params?: AnyObject) => void;
};

const Link: React.FC<Props> = props => {
  const { children, isDisabled, classname = '', ...rest } = props;
  return (
    <span className={classname}>
      {isDisabled ? children : <RouterLink {...rest}>{children}</RouterLink>}
    </span>
  );
};

export default Link;
