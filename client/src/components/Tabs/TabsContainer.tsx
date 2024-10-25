import React from 'react';
import { Tab } from 'react-bootstrap';

type Props = {
  activeKey?: string;
  defaultActiveKey?: string;
};

const TabsContainer: React.FC<Props> = props => {
  const { activeKey, defaultActiveKey, children } = props;
  return (
    <Tab.Container activeKey={activeKey} defaultActiveKey={defaultActiveKey}>
      {React.cloneElement(children as React.ReactElement, { defaultActiveKey })}
    </Tab.Container>
  );
};

export default TabsContainer;
