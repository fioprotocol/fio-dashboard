import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Badge, { BADGE_TYPES } from '../Badge/Badge';
import { ROUTES } from '../../constants/routes';
import classes from './AddressDomainBadge.module.scss';

export const ADDRESS_DOMAIN_BADGE_TYPE = {
  ADDRESS: 'address',
  DOMAIN: 'domain',
};

const content = {
  [ADDRESS_DOMAIN_BADGE_TYPE.ADDRESS]: {
    link: ROUTES.FIO_DOMAINS,
    button: 'Purchase Domain',
    title: 'Want to register an address with a custom domain?',
    text: '',
  },
  [ADDRESS_DOMAIN_BADGE_TYPE.DOMAIN]: {
    link: ROUTES.FIO_ADDRESSES,
    button: 'Register an Address',
    title: 'Need an Address?',
    text:
      'Get an address on a public domain or add an address to your custom domain.',
  },
};

const AddressDomainBadge = props => {
  const { type } = props;

  return (
    <Badge type={BADGE_TYPES.REGULAR} show>
      <div className={classes.container}>
        <h5 className={classes.title}>{content[type].title}</h5>
        <p>{content[type].text}</p>
        <Link to={content[type].link} className={classes.link}>
          <Button className={classes.button}>{content[type].button}</Button>
        </Link>
      </div>
    </Badge>
  );
};

export default AddressDomainBadge;
