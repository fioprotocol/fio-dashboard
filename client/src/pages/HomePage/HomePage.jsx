import React, { Component } from 'react';
import AddressWidget from '../../components/AddressWidget';
import DomainsBanner from '../../components/DomainsBanner/DomainsBanner';

import { ROUTES } from '../../constants/routes';
import classnames from './HomePage.module.scss';

export default class HomePage extends Component {
  componentDidMount() {
    const { isAuthenticated, history } = this.props;
    if (!isAuthenticated) return;
    history.push(ROUTES.DASHBOARD);
  }

  render() {
    return (
      <div className={classnames.container}>
        <AddressWidget />
        <DomainsBanner />
      </div>
    );
  }
}
