import React, { Component } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Link } from 'react-router-dom';
import { Button, Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { ROUTES } from '../../constants/routes';
import LoginForm from '../LoginForm';
import classes from './MainHeader.module.scss';

export default class MainHeader extends Component {
  constructor(props) {
    super();
    this.state = {
      showLogin: false,
      loginSuccess: props.loginSuccess
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.loginSuccess !== state.loginSuccess) {
      const updatedState = { loginSuccess: props.loginSuccess }
      if (props.loginSuccess) updatedState.showLogin = false
      return updatedState
    }

    return null
  }

  onHandleLoginClose = () => {
    this.setState({ showLogin: false })
  }

  showLogin = () => this.setState({ showLogin: true });

  static propTypes = exact({
    account: PropTypes.object,
    pathname: PropTypes.string.isRequired,
    user: PropTypes.object,
    isHomePage: PropTypes.bool,
    logout: PropTypes.func.isRequired,
    loginSuccess: PropTypes.bool,
  });

  renderLoggedMenu = () => (
    <Nav className='pr-0 align-items-center'>
      <Nav.Link className={classnames(classes.navItem, 'text-white')}>
        <div className={classnames(classes.notifWrapper, classes.cartanim)}>
          <FontAwesomeIcon icon="shopping-cart" className={classnames(classes.icon)} />
          <div className={classnames(classes.notifActiveWrapper, classes.notifActiveWrapperRight)}>
            <FontAwesomeIcon icon="circle" className={classnames(classes.notifActive, 'text-success')} />
          </div>
        </div>
      </Nav.Link>
      <hr className={classnames(classes.vertical, 'mx-3')} />
      <Nav.Link href='#' className={classnames(classes.navItem, 'text-white')}>
        <div className={classnames(classes.notifWrapper, classes.bellshake)}>
          <FontAwesomeIcon icon="bell" className={classnames(classes.icon, classes.notification, 'text-white')} />
          <div className={classes.notifActiveWrapper}>
            <FontAwesomeIcon icon="circle" className={classnames(classes.notifActive, 'mr-2', 'text-danger')} />
          </div>
        </div>
        <div className="ml-3">Notifications</div>
      </Nav.Link>
      <hr className={classnames(classes.vertical, 'mx-3')} />
      <Nav.Link href='#' className={classnames(classes.navItem, 'text-white')}>
        <div className={classnames(classes.settings)}>
          <FontAwesomeIcon icon="cog" className={classnames(classes.settingsIcon)} />
        </div>
        <div className="ml-3">Settings</div>
      </Nav.Link>
      <Nav.Link href='#' className='pr-0'>
        <Button className={classnames(classes.button, 'ml-4')} size="lg">Sign Out</Button>
      </Nav.Link>
    </Nav>
  );

  renderRegularNav = () => (
    <div className="ml-5 d-flex flex-row w-100 justify-content-between">
      <div className={classes.link}>
        <a
          href='https://fioprotocol.io/'
          target='_blank'
          rel='noopener noreferrer'
          className="text-white"
        >
          <FontAwesomeIcon icon="arrow-left" className={classnames(classes.arrow, 'mr-2', 'text-white')} />
          Go to fioprotocol.io
        </a>
      </div>
      <Navbar className='pr-0'>
        <Navbar.Collapse>
          <Nav className='mr-auto'>
            <Nav.Link className={classnames(classes.navItem, 'text-white')}>
              <div className={classnames(classes.notifWrapper, classes.cartanim)}>
                <FontAwesomeIcon icon="shopping-cart" className={classnames(classes.icon, 'mr-4')} />
                <div className={classnames(classes.notifActiveWrapper, classes.notifActiveWrapperRight)}>
                  <FontAwesomeIcon icon="circle" className={classnames(classes.notifActive, 'text-success', 'mr-2')} />
                </div>
              </div>
            </Nav.Link>
            <Nav.Link as={Link} to={ROUTES.CREATE_ACCOUNT}>
              <Button variant='outline-primary' className={classnames(classes.button, 'text-white', 'mr-3')} size="lg">
                Create account
              </Button>
            </Nav.Link>
            <Nav.Link className='pr-0'>
              <Button
                className={classes.button}
                size="lg"
                onClick={this.showLogin}
              >
                Sign in
              </Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );

  render() {
    const { pathname, account, user } = this.props;
    const { showLogin } = this.state;
    return (
      <div className={`${classes.header}`}>
        <Link to='/' className='mr-5'>
          <div className={classes.logo} />
        </Link>
        {account ? this.renderLoggedMenu() : this.renderRegularNav()}
        <LoginForm show={showLogin} onClose={this.onHandleLoginClose} />
      </div>
    );
  }
}
