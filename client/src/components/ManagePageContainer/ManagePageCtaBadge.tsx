import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { CTA_BADGE } from './constants';
import config from '../../config';

import classes from './ManagePageContainer.module.scss';

type Props = {
  children?: React.ReactNode;
  name: keyof typeof CTA_BADGE;
};

export const ManagePageCtaBadge: React.FC<Props> = props => {
  const { name } = props;
  const { button, externalLink, link, title, text, color, ctaText } = CTA_BADGE[
    name
  ];
  return (
    <div className={classes.badgeContainer} style={{ background: color }}>
      <h5 className={classes.title}>{title}</h5>
      <p className={classes.text}>{text}</p>
      {ctaText && (
        <p className={classnames(classes.text, classes.ctaText)}>{ctaText}</p>
      )}
      {link && (
        <Link to={link} className={classes.link}>
          <Button className={classes.button}>{button}</Button>
        </Link>
      )}
      {externalLink && (
        <a
          href={config.getTokensUrl}
          title={config.getTokensUrl}
          target="_blank"
          rel="noreferrer"
          className={classes.link}
        >
          <Button className={classes.button}>{button}</Button>
        </a>
      )}
    </div>
  );
};
