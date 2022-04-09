import React from 'react';
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
  tabContentClass?: string;
  showTabBorder?: boolean;
  tabProps?: AnyObject;
};

const Tabs: React.FC<Props> = props => {
  const {
    list,
    containerClass,
    tabItemContainerClass,
    tabItemClass,
    tabContentClass,
    showTabBorder,
    tabProps,
  } = props;
  return (
    <>
      <Nav className={containerClass || classes.container}>
        {list.map(tab => (
          <Nav.Item key={tab.eventKey + 'tab'}>
            <div className={tabItemContainerClass || classes.tabItemContainer}>
              <Nav.Link
                eventKey={tab.eventKey}
                className={classnames(
                  tabItemClass || classes.tabItem,
                  classes.active,
                )}
              >
                {tab.title}
              </Nav.Link>
              {showTabBorder && <div className={classes.tabBorder} />}
            </div>
          </Nav.Item>
        ))}
      </Nav>
      <Tab.Content className={classes.tabContentContainer}>
        {list.map(tab => (
          <Tab.Pane
            key={tab.eventKey + 'content'}
            eventKey={tab.eventKey}
            className={tabContentClass || classes.tabContent}
          >
            {tab.renderTab(tabProps)}
          </Tab.Pane>
        ))}
      </Tab.Content>
    </>
  );
};

export default Tabs;
