import React, { Component } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

import { ROUTES } from '../../constants/routes';
import { LINK_LABELS } from '../../constants/labels';
import classes from './Sidebar.module.scss';

const navItems = [
  'FIO_ADDRESSES',
  'FIO_DOMAINS',
  'FIO_REQUESTS',
  'FIO_WALLET',
  'GOVERNANCE',
  'PROTOCOL_UPDATES',
];
export default class Sidebar extends Component {
  static propTypes = exact({
    account: PropTypes.object,
  });

  renderItems = () => {
    return navItems.map((item, i) => (
      <Nav.Item className={classes.sideItem} key={LINK_LABELS[item]}>
        <Nav.Link
          as={Link}
          to={ROUTES[item]}
          className={classes.sideLink}
          data-content={LINK_LABELS[item]}
          eventKey={i}
        >
          {LINK_LABELS[item]}
        </Nav.Link>
      </Nav.Item>
    ));
  };

  render() {
    return <Nav className={classes.sideWrapper}>{this.renderItems()}</Nav>;
  }
}
