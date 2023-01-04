import React from 'react';
import { Tab } from 'react-bootstrap';

type Props = {
  defaultActiveKey?: string;
};

const TabsContainer: React.FC<Props> = props => {
  const { defaultActiveKey, children } = props;
  return (
    <Tab.Container defaultActiveKey={defaultActiveKey}>
      {React.cloneElement(children as React.ReactElement, { defaultActiveKey })}
    </Tab.Container>
  );
};

export default TabsContainer;
