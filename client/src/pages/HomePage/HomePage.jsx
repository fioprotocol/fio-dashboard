import React, { Component } from 'react';
import AddressWidget from '../../components/AddressWidget';
import classnames from './HomePage.module.scss';

export default class HomePage extends Component {
  render() {
    return (
      <div className={classnames.container}>
        <AddressWidget />
      </div>
    );
  }
}
