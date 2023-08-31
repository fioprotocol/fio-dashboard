import React, { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import classnames from 'classnames';

import classes from './styles/Tabs.module.scss';

import { TabItemProps } from './types';
import { AnyObject } from '../../types';

type Props = {
  list: TabItemProps[];
  containerClass?: string;
  tabItemContainerClass?: string;
  tabItemClass?: string;
  tabContentContainerClass?: string;
  tabContentClass?: string;
  showTabBorder?: boolean;
  tabProps?: AnyObject;
  defaultActiveKey?: string;
  tabItemPrimaryClass?: string;
  tabBorderPrimary?: boolean;
  tabAction?: (tabKey: string) => void;
};

const Tabs: React.FC<Props> = props => {
  const {
    list,
    containerClass,
    tabItemContainerClass,
    tabItemClass,
    tabContentContainerClass,
    tabContentClass,
    showTabBorder,
    tabProps,
    defaultActiveKey,
    tabItemPrimaryClass,
    tabBorderPrimary,
    tabAction,
  } = props;

  const [activeEventKey, setActiveEventKey] = useState(defaultActiveKey);

  return (
    <>
      <Nav className={containerClass || classes.container}>
        {list.map(tab => (
          <Nav.Item key={tab.eventKey + 'tab'}>
            <div className={tabItemContainerClass || classes.tabItemContainer}>
              <Nav.Link
                onSelect={() => {
                  setActiveEventKey(tab.eventKey);
                  tabAction && tabAction(tab.eventKey);
                }}
                eventKey={tab.eventKey}
                className={classnames(
                  tabItemClass || classes.tabItem,
                  classes.active,
                  tabItemPrimaryClass,
                )}
              >
                {tab.title}
              </Nav.Link>
              {showTabBorder && (
                <div
                  className={classnames(
                    classes.tabBorder,
                    tabBorderPrimary && classes.tabBorderPrimary,
                  )}
                />
              )}
            </div>
          </Nav.Item>
        ))}
      </Nav>
      <Tab.Content
        className={classnames(
          classes.tabContentContainer,
          tabContentContainerClass,
        )}
      >
        {list.map(tab => (
          <Tab.Pane
            key={tab.eventKey + 'content'}
            eventKey={tab.eventKey}
            className={tabContentClass || classes.tabContent}
          >
            {tab.renderTab({
              ...tabProps,
              isActive: tab.eventKey === activeEventKey,
            })}
          </Tab.Pane>
        ))}
      </Tab.Content>
    </>
  );
};

export default Tabs;
