import React from 'react';
import { useHistory, useLocation } from 'react-router';

import classnames from 'classnames';

import TabsContainer from '../../../components/Tabs/TabsContainer';
import Tabs from '../../../components/Tabs/Tabs';

import classes from '../styles/GovernanceSelector.module.scss';
import tabsClasses from '../../../components/Tabs/styles/Tabs.module.scss';
import { ROUTES } from '../../../constants/routes';
import CustomDropdown from '../../../components/CustomDropdown';

const LINKS = [
  {
    eventKey: ROUTES.GOVERNANCE_OVERVIEW,
    title: 'Overview',
    renderTab: () => <></>,
  },
  {
    eventKey: ROUTES.GOVERNANCE_FIO_FOUNDATION_BOARD_OF_DIRECTORS,
    title: 'FIO Foundation Board of Directors',
    renderTab: () => <></>,
  },
  {
    eventKey: ROUTES.GOVERNANCE_BLOCK_PRODUCERS,
    title: 'Block Producers',
    renderTab: () => <></>,
  },
  {
    eventKey: ROUTES.GOVERNANCE_PROXIES,
    title: 'Proxies',
    renderTab: () => <></>,
  },
  {
    eventKey: ROUTES.GOVERNANCE_VOTING_HELP,
    title: 'Voting Help',
    renderTab: () => <></>,
  },
];

export const GovernanceSelector: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const activeKey = location.pathname || LINKS[0].eventKey;

  return (
    <>
      <TabsContainer activeKey={activeKey}>
        <Tabs
          list={LINKS}
          containerClass={classnames(
            tabsClasses.container,
            classes.tabsContainer,
          )}
          tabItemClass={classnames(tabsClasses.tabItem, classes.tabItem)}
          tabItemContainerClass={tabsClasses.tabItem}
          tabAction={key => history.push(key)}
          tabBorderPrimary
        />
      </TabsContainer>
      <CustomDropdown
        dropdownClassNames={classes.dropdownContainer}
        value={activeKey}
        options={LINKS.map(({ eventKey, title }) => ({
          id: eventKey,
          name: title,
        }))}
        onChange={key => history.push(key)}
        isIndigo
        isSimple
        isSmall
        placeholder="Voting Overview"
      />
    </>
  );
};
