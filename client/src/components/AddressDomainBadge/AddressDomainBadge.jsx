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
    link: ROUTES.FIO_DOMAINS_SELECTION,
    button: 'Purchase Domain',
    title: 'Want to register a FIO Crypto Handle with a custom domain?',
    text: '',
  },
  [ADDRESS_DOMAIN_BADGE_TYPE.DOMAIN]: {
    link: ROUTES.FIO_ADDRESSES_SELECTION,
    button: 'Register a FIO Crypto Handle',
    title: 'Need a FIO Crypto Handle?',
    text:
      'Get a FIO Crypto Handle on a public domain or add a FIO Crypto Handle to your custom domain.',
  },
};

const AddressDomainBadge = props => {
  const { type } = props;

  return (
    <Badge type={BADGE_TYPES.REGULAR} show>
      <div className={classes.container}>
        <div className={classes.textContainer}>
          <h5 className={classes.title}>{content[type].title}</h5>
          <p>{content[type].text}</p>
        </div>
        <Link to={content[type].link} className={classes.link}>
          <Button className={classes.button}>{content[type].button}</Button>
        </Link>
      </div>
    </Badge>
  );
};

export default AddressDomainBadge;
