import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import AddressWidget from '../../components/AddressWidget';
import DomainsBanner from '../../components/DomainsBanner/DomainsBanner';
import DashboardPage from '../DashboardPage';

import { handleHomePageContent } from '../../util/homePage';

import { RefProfile, ContainedFlowQueryParams } from '../../types';

import classnames from './HomePage.module.scss';

type Props = {
  isAuthenticated: boolean;
  isContainedFlow: boolean;
  refProfileInfo: RefProfile;
  containedFlowQueryParams: ContainedFlowQueryParams;
};

const HomePage: React.FC<Props & RouteComponentProps> = props => {
  const {
    isAuthenticated,
    isContainedFlow,
    refProfileInfo,
    containedFlowQueryParams,
  } = props;

  const addressWidgetContent = handleHomePageContent({
    isContainedFlow,
    containedFlowQueryParams,
    refProfileInfo,
  });

  if (isContainedFlow) return <AddressWidget {...addressWidgetContent} />;

  if (!isAuthenticated) {
    return (
      <div className={classnames.container}>
        <AddressWidget {...addressWidgetContent} />
        <DomainsBanner />
      </div>
    );
  }

  return <DashboardPage />;
};

export default HomePage;
