import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';

import AddressWidget from '../../components/AddressWidget';
import DomainsBanner from '../../components/DomainsBanner/DomainsBanner';

import { ROUTES } from '../../constants/routes';

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
  const history = useHistory();

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

  useEffect(() => {
    if (isAuthenticated) {
      history.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, history]);

  if (isContainedFlow) return <AddressWidget {...addressWidgetContent} />;

  return (
    <div className={classnames.container}>
      <AddressWidget {...addressWidgetContent} />
      <DomainsBanner />
    </div>
  );
};

export default HomePage;
