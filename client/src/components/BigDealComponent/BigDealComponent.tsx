import React from 'react';

import CheckIconSrc from '../../assets/images/check.svg';

import classes from './BigDealComponent.module.scss';

export const BigDealComponent: React.FC = () => {
  return (
    <div className={classes.container}>
      <h5 className={classes.title}>What’s the BIG DEAL?</h5>
      <p className={classes.subtitle}>
        Here are just a few points on why FIO Handles are special.
      </p>
      {SPECIAL_POINTS.map(point => (
        <p className={classes.point} key={point}>
          <img alt="check" src={CheckIconSrc} />
          <span>{point}</span>
        </p>
      ))}
    </div>
  );
};

const SPECIAL_POINTS = [
  'Map to any public address on any blockchain',
  'They never expire',
  'Come bundled with 100 gas-free transactions',
  'Owned and controlled by you',
];
