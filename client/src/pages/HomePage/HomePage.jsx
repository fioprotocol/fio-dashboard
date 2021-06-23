import React, { Component } from 'react';

import AddressWidget from '../../components/AddressWidget';
import DomainsBanner from '../../components/DomainsBanner/DomainsBanner';
import DashboardPage from '../DashboardPage';

import classnames from './HomePage.module.scss';

export default class HomePage extends Component {
  render() {
    const { isAuthenticated } = this.props;

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
