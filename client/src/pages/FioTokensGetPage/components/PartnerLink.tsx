import React from 'react';

import { Partner } from '../types';

import classes from '../FioTokensGetPage.module.scss';

type Props = {
  partner: Partner;
};

export const PartnerLink: React.FC<Props> = props => {
  const {
    partner: { name, link, image },
  } = props;

  return (
    <a href={link} target="_blank" rel="noreferrer" className={classes.link}>
      <img src={image} alt={name} />
    </a>
  );
};
