import React from 'react';

import { AnyObject } from '../../types';

export type TabItemProps = {
  eventKey: string;
  title: string;
  renderTab: (props: AnyObject) => React.ReactNode;
};
