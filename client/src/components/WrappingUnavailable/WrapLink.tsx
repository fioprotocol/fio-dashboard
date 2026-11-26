import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

import {
  WRAPPING_DISABLED,
  WRAPPING_DISABLED_MESSAGE,
} from '../../constants/wrap';

type Props = {
  to: LinkProps['to'];
  className?: string;
  children: React.ReactElement<{ disabled?: boolean; title?: string }>;
};

// Link to a wrap/unwrap page. While wrapping is disabled it renders the
// button disabled, with no link, and a tooltip explaining why.
export const WrapLink: React.FC<Props> = ({ to, className, children }) => {
  if (!WRAPPING_DISABLED) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <span className={className} title={WRAPPING_DISABLED_MESSAGE}>
      {React.cloneElement(children, {
        disabled: true,
        title: WRAPPING_DISABLED_MESSAGE,
      })}
    </span>
  );
};
