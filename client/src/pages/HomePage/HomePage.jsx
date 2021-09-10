import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import AddressWidget from '../../components/AddressWidget';
import DomainsBanner from '../../components/DomainsBanner/DomainsBanner';
import DashboardPage from '../DashboardPage';

import classnames from './HomePage.module.scss';

export default class HomePage extends Component {
  render() {
    const { isAuthenticated, isRefFlow, homePageLink } = this.props;

    if (isRefFlow) {
      return <Redirect to={homePageLink} />;
    }

    if (!isAuthenticated) {
      return (
        <div className={classnames.container}>
          <AddressWidget />
          <DomainsBanner />
        </div>
      );
    }

    return <DashboardPage />;
  }
}
