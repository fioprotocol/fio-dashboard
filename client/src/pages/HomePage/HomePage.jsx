import React, { Component } from 'react';
import AddressWidget from '../../components/AddressWidget';
import DomainsBanner from '../../components/DomainsBanner/DomainsBanner';
import classnames from './HomePage.module.scss';

export default class HomePage extends Component {
  render() {
    return (
      <div className={classnames.container}>
        <AddressWidget />
        <DomainsBanner />
      </div>
    );
  }
}
