import React, { Component } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';
import { LINK_LABELS } from '../../constants/labels';
import classes from './Navigation.module.scss';

const navItems = [
  'FIO_ADDRESSES',
  'FIO_DOMAINS',
  'FIO_REQUESTS',
  'FIO_WALLET',
  'GOVERNANCE',
  'PROTOCOL_UPDATES',
];
class Navigation extends Component {
  static propTypes = exact({
    account: PropTypes.object,
    isOnSide: PropTypes.bool,
    closeMenu: PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    staticContext: PropTypes.any,
  });

  renderItems = () => {
    const { isOnSide, location } = this.props;
    return navItems.map((item, i) => (
      <Nav.Item
        className={classnames(classes.sideItem, isOnSide && classes.isOnSide)}
        key={LINK_LABELS[item]}
      >
        <Nav.Link
          as={Link}
          to={ROUTES[item]}
          className={classes.sideLink}
          data-content={LINK_LABELS[item]}
          eventKey={i}
          onClick={this.props.closeMenu}
          active={location && location.pathname === ROUTES[item]}
        >
          {LINK_LABELS[item]}
        </Nav.Link>
      </Nav.Item>
    ));
  };

  render() {
    const { isOnSide } = this.props;
    return (
      <Nav
        className={classnames(
          classes.sideWrapper,
          isOnSide && classes.isOnSide,
        )}
        defaultActiveKey={1}
      >
        {this.renderItems()}
      </Nav>
    );
  }
}

export default withRouter(Navigation);
