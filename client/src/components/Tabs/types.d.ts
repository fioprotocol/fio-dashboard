import React from 'react';

export type TabItemProps = {
  eventKey: string;
  title: string;
  renderTab: (props: any) => React.ReactNode;
};
