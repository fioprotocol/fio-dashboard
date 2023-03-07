import React from 'react';

import { Fio101Component } from './components/Fio101Component';
import { FioRequestActionComponent } from '../../components/FioRequestActionComponent';
import { WelcomeComponent } from './components/WelcomeComponent';

import { TotalBalanceComponent } from './components/TotalBalanceComponent';

import { useContext } from './DashboardPageContext';

import classes from './DashboardPage.module.scss';

const DashboardPage: React.FC = () => {
  const { totalBalance, totalBalanceLoading } = useContext();

  return (
    <div className={classes.container}>
      <TotalBalanceComponent
        totalBalance={totalBalance}
        loading={totalBalanceLoading}
      />
      <div className={classes.actionContainer}>
        <WelcomeComponent />
        <FioRequestActionComponent />
      </div>
      <Fio101Component />
    </div>
  );
};

export default DashboardPage;
