import React, { ReactNode } from 'react';

import { AnyObject } from '../../types';

export type TabItemProps = {
  eventKey: string;
  title: ReactNode;
  renderTab: (props: AnyObject) => React.ReactNode;
};
