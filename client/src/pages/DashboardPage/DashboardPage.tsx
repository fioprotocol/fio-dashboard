import React from 'react';

import { Fio101Component } from '../../components/Fio101Component';
import { FioRequestActionComponent } from '../../components/FioRequestActionComponent';

import { ItemWrapper } from './components/ItemWrapper';
import { TotalBalanceComponent } from './components/TotalBalanceComponent';
import { WelcomeComponent } from '../../components/WelcomeComponent';
import { BigDealComponent } from '../../components/BigDealComponent';
import FioLoader from '../../components/common/FioLoader/FioLoader';

import { useContext } from './DashboardPageContext';

import classes from './DashboardPage.module.scss';

const DashboardPage: React.FC = () => {
  const {
    fio101ComponentProps,
    isDesktop,
    isLoading,
    hasAddresses,
    totalBalance,
    welcomeComponentProps,
  } = useContext();

  return (
    <div className={classes.container}>
      <TotalBalanceComponent totalBalance={totalBalance} loading={isLoading} />
      <div className={classes.actionContainer}>
        <WelcomeComponent {...welcomeComponentProps} />
        <ItemWrapper
          hasFitContentWidth={isDesktop}
          hasFullWidth={!isDesktop}
          isShrinked
        >
          {isLoading ? (
            <FioLoader wrapCenter />
          ) : hasAddresses ? (
            <FioRequestActionComponent />
          ) : (
            <BigDealComponent />
          )}
        </ItemWrapper>
      </div>
      <Fio101Component {...fio101ComponentProps} />
    </div>
  );
};

export default DashboardPage;
