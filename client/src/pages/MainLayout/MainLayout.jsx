import React, { Component } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import MainHeader from '../../components/MainHeader/MainHeader';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import classes from './MainLayout.module.scss';

export default class MainLayout extends Component {
  static propTypes = exact({
    children: PropTypes.element,
    pathname: PropTypes.string.isRequired,
    user: PropTypes.object,
    account: PropTypes.object,

    init: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  });

  componentDidMount() {
    this.props.init();
  }

  render() {
    const { user, account, pathname, logout, children } = this.props;
    const isHomePage = pathname === '/';
    return (
      <div className={classes.root}>
        <MainHeader
          user={user}
          account={account}
          pathname={pathname}
          logout={logout}
          isHomePage={isHomePage}
        />
        {account && <Sidebar />}
        <div className={`${classes.content} ${isHomePage && classes.home}`}>
          {children}
        </div>
        <Footer />
      </div>
    );
  }
}
