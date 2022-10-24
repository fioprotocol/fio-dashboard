import React from 'react';

import { useContext, ContextProps } from './OrderDetailsContainerContext';

type Props = {
  children: (contextProps: ContextProps) => React.ReactElement;
};

export const OrderDetailsContainer: React.FC<Props> = props => {
  const contextProps = useContext();

  return <>{props.children(contextProps)}</>;
};
