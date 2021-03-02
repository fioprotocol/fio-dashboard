import React, { Component } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Layout, Menu, Button } from 'antd';
import { LINK_LABELS } from '../../constants/labels';

export default class Sidebar extends Component {
  static propTypes = exact({
    account: PropTypes.object,
  });


  render() {
    const { pathname, account, user } = this.props;
    return (
      <Menu
        // onClick={this.handleClick}
        // defaultSelectedKeys={['1']}
        // defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <Menu.Item key={ROUTES.DASHBOARD}>
          <Link to={ROUTES.DASHBOARD}>{LINK_LABELS.HOME}</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key={ROUTES.DASHBOARD}>
          <Link to={ROUTES.DASHBOARD}>Addresses</Link>
        </Menu.Item>
        <Menu.Item key={ROUTES.DASHBOARD}>
          <Link to={ROUTES.DASHBOARD}>Domains</Link>
        </Menu.Item>
        <Menu.Item key={ROUTES.DASHBOARD}>
          <Link to={ROUTES.DASHBOARD}>FIO Requests</Link>
        </Menu.Item>
        <Menu.Item key={ROUTES.DASHBOARD}>
          <Link to={ROUTES.DASHBOARD}>Tokens</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key={ROUTES.DASHBOARD}>
          <Link to={ROUTES.DASHBOARD}>Governance</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key={ROUTES.DASHBOARD}>
          <Link to={ROUTES.DASHBOARD}>Protocol Updates</Link>
        </Menu.Item>
      </Menu>
    );
  }
}
