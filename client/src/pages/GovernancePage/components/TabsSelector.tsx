import React from 'react';

import classnames from 'classnames';

import TabsContainer from '../../../components/Tabs/TabsContainer';
import Tabs from '../../../components/Tabs/Tabs';

import classes from '../styles/TabsSelector.module.scss';
import tabsClasses from '../../../components/Tabs/styles/Tabs.module.scss';
import { TabItemProps } from '../../../components/Tabs/types';

export type TabsSelectorProps = {
  className?: string;
  defaultActiveKey?: string;
  activeKey?: string;
  list: TabItemProps[];
  tabAction?: (key: string) => void;
};

export const TabsSelector: React.FC<TabsSelectorProps> = ({
  className,
  defaultActiveKey,
  activeKey,
  list,
  tabAction,
}) => {
  return (
    <>
      <TabsContainer defaultActiveKey={defaultActiveKey} activeKey={activeKey}>
        <Tabs
          list={list}
          containerClass={classnames(
            tabsClasses.container,
            classes.tabsContainer,
            className,
          )}
          tabItemClass={classnames(tabsClasses.tabItem, classes.tabItem)}
          tabItemContainerClass={tabsClasses.tabItem}
          tabAction={tabAction}
          tabBorderPrimary
        />
      </TabsContainer>
    </>
  );
};
