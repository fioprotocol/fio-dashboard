import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { CTA_BADGE } from './constants';
import { FioNameType } from '../../types';

import classes from './ManagePageContainer.module.scss';

type Props = {
  children?: React.ReactNode;
  name: FioNameType;
};

const ManagePageCtaBadge: React.FC<Props> = props => {
  const { name } = props;
  const { button, link, title, text, color } = CTA_BADGE[name];
  return (
    <div className={classes.badgeContainer} style={{ background: color }}>
      <h5 className={classes.title}>{title}</h5>
      <p className={classes.text}>{text}</p>
      <Link to={link} className={classes.link}>
        <Button className={classes.button}>{button}</Button>
      </Link>
    </div>
  );
};

export default ManagePageCtaBadge;
