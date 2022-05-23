import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import AddressWidget from '../../components/AddressWidget';
import DomainsBanner from '../../components/DomainsBanner/DomainsBanner';
import DashboardPage from '../DashboardPage';

import classnames from './HomePage.module.scss';

type Props = {
  isAuthenticated: boolean;
  isRefFlow: boolean;
  homePageLink: string;
};

const HomePage: React.FC<Props & RouteComponentProps> = props => {
  // const { isAuthenticated, isRefFlow, homePageLink } = props;
  const { isAuthenticated } = props;

  // todo: handle redirect on contained flow
  // if (isRefFlow) return <Redirect to={homePageLink} />;

  if (!isAuthenticated)
    return (
      <div className={classnames.container}>
        <AddressWidget />
        <DomainsBanner />
      </div>
    );

  return <DashboardPage />;
};

export default HomePage;
