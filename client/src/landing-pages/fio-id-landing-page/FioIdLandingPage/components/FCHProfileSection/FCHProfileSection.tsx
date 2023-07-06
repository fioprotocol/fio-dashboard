import React from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {
  ACTION_BUTTONS_NAMES,
  FioProfileActionBadge,
} from '../../../../../components/FioProfileActionBadge';
import TabsContainer from '../../../../../components/Tabs/TabsContainer';
import Tabs from '../../../../../components/Tabs/Tabs';

import { useContext } from './FCHProfileSectionContext';

import classes from './FCHProfileSection.module.scss';

type Props = {
  fch: string;
  fioBaseUrl: string;
  isDesktop: boolean;
  resetPath: () => void;
};

export const FCHProfileSection: React.FC<Props> = props => {
  const { fch, fioBaseUrl, isDesktop, resetPath } = props;
  const { tabsList } = useContext();

  return (
    <div className={classes.container}>
      <FioProfileActionBadge
        fioBaseUrl={fioBaseUrl}
        actionButtons={[
          ACTION_BUTTONS_NAMES.GET_FIO_HANDLE,
          ACTION_BUTTONS_NAMES.MANAGE_FIO_HANDLE,
        ]}
        hasButtonMenu={!isDesktop}
      />
      <div onClick={resetPath} className={classes.backLinkContainer}>
        <ArrowBackIcon className={classes.arrow} />
        <p className={classes.backLink}>Back to Profile Lookup</p>
      </div>
      <h1 className={classes.title}>My FIO Handle Profile</h1>
      <p className={classes.subtitle}>
        Make payments, view my NFT signatures or connect with me on social
        media. All from my FIO Handle.
      </p>
      <p className={classes.fch}>
        <span className={classes.fchTitle}>My FIO Handle: </span>
        <span className={classes.fchValue}>{fch}</span>
      </p>
      <TabsContainer defaultActiveKey={tabsList[0].eventKey}>
        <Tabs
          list={tabsList}
          containerClass={classes.tabContainer}
          tabItemContainerClass={classes.tabItemContainer}
          tabContentContainerClass={classes.tabContentContainer}
          tabItemClass={classes.tabItem}
          tabProps={props}
        />
      </TabsContainer>
    </div>
  );
};
