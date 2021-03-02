import React, { Component } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Layout, Menu, Button } from 'antd';
import { LINK_LABELS } from '../../constants/labels';
import classnames from './MainHeader.module.scss';

const { Header } = Layout;

export default class MainHeader extends Component {
  static propTypes = exact({
    pathname: PropTypes.string.isRequired,
    user: PropTypes.object,
    isHomePage: PropTypes.bool,
    logout: PropTypes.func.isRequired,
  });

  renderLoggedMenu = role => [
    <Menu.Item key={ROUTES.DASHBOARD}>
      <Link to={ROUTES.DASHBOARD}>{LINK_LABELS.NOTIFICATIONS}</Link>
    </Menu.Item>,
    <Menu.Item key={ROUTES.DASHBOARD}>
      <Link to={ROUTES.DASHBOARD}>{LINK_LABELS.SETTINGS}</Link>
    </Menu.Item>,
    role === 'ADMIN' && (
      <Menu.Item key={ROUTES.ADMIN}>
        <Link to={ROUTES.ADMIN}>Admin Panel</Link>
      </Menu.Item>
    ),
    <Menu.Item key="logout">
      <Button
        icon="logout"
        type="danger"
        htmlType="button"
        onClick={this.props.logout}
      >
        logout
      </Button>
    </Menu.Item>,
  ];

  render() {
    const { pathname, account, user } = this.props;
    return (
      <Header className={`${classnames.header}`}>
        <div className={classnames.logo} />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[pathname]}
          className={classnames.menu}
        >
          {account ? this.renderLoggedMenu(user && user.role) :
            <Menu.Item key={ROUTES.DASHBOARD}>
              <Link to={ROUTES.DASHBOARD}>{LINK_LABELS.DASHBOARD}</Link>
            </Menu.Item>}
        </Menu>
      </Header>
    );
  }
}
