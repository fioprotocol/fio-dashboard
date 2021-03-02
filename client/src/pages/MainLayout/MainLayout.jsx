import React, { Component } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Layout, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import MainHeader from '../../components/MainHeader/MainHeader';
import Sidebar from '../../components/Sidebar/Sidebar';
import { ROUTES } from '../../constants/routes';
import { LINK_LABELS } from '../../constants/labels';
import classes from './MainLayout.module.scss';

const { Content, Sider, Footer } = Layout;

export default class MainLayout extends Component {
  static propTypes = exact({
    children: PropTypes.element,
    pathname: PropTypes.string.isRequired,
    user: PropTypes.object,
    account: PropTypes.object,

    init: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  });

  componentWillMount() {
    this.props.init();
  }

  render() {
    const { user, account, pathname, logout, children } = this.props;
    const isHomePage = pathname === '/';
    return (
      <Layout className={classes.root}>
        <MainHeader
          user={user}
          account={account}
          pathname={pathname}
          logout={logout}
          isHomePage={isHomePage}
        />
        <Layout>
          <Sider className={classes.sider}><Sidebar/></Sider>
          <Content className={`${classes.content} ${isHomePage && classes.home}`}>
            {children}
          </Content>
        </Layout>
        <Footer theme="dark" className={classes.footer}>
          <ul>
            <li>
              <Link to={ROUTES.DASHBOARD}>{LINK_LABELS.DASHBOARD}</Link>
            </li>
          </ul>
        </Footer>
      </Layout>
    );
  }
}
