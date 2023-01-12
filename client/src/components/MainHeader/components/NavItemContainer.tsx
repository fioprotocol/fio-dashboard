import React from 'react';

type Props = {
  hide?: boolean;
};

export const NavItemContainer: React.FC<Props> = props => {
  const { hide, children } = props;

  if (hide) return null;

  return <>{children}</>;
};
