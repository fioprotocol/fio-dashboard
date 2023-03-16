import React from 'react';

import { Fio101Component } from './components/Fio101Component';
import { FioRequestActionComponent } from '../../components/FioRequestActionComponent';

import { ItemWrapper } from './components/ItemWrapper';
import { TotalBalanceComponent } from './components/TotalBalanceComponent';
import { WelcomeComponent } from './components/WelcomeComponent';

import { useContext } from './DashboardPageContext';

import classes from './DashboardPage.module.scss';

const DashboardPage: React.FC = () => {
  const {
    fio101Items,
    firstWelcomeItem,
    secondWelcomeItem,
    isDesktop,
    totalBalance,
    totalBalanceLoading,
  } = useContext();

  return (
    <div className={classes.container}>
      <TotalBalanceComponent
        totalBalance={totalBalance}
        loading={totalBalanceLoading}
      />
      <div className={classes.actionContainer}>
        <WelcomeComponent
          firstWelcomeItem={firstWelcomeItem}
          secondWelcomeItem={secondWelcomeItem}
        />
        <ItemWrapper
          hasFitContentWidth={isDesktop}
          hasFullWidth={!isDesktop}
          isShrinked
        >
          <FioRequestActionComponent />
        </ItemWrapper>
      </div>
      <Fio101Component isDesktop={isDesktop} fio101Items={fio101Items} />
    </div>
  );
};

export default DashboardPage;
