import React from 'react';

import { FCHBanner } from '../FCHBanner';

import classes from './RefFioHandleBanner.module.scss';

type Props = {
  domainName?: string;
  fioHandleName?: string;
  text?: string;
};

export const RefFioHandleBanner: React.FC<Props> = props => {
  const {
    domainName = 'rulez',
    fioHandleName = 'bob',
    text = 'Now people can send you cryptocurrency to',
  } = props;

  return (
    <FCHBanner
      containerClass={classes.fchBannerConainerClass}
      customFioHandleBanner={
        <div className={classes.customFioHandleBanner}>
          {fioHandleName}
          <span className={classes.boldText}>@{domainName}</span>
        </div>
      }
      fch={`${fioHandleName}@${domainName}`}
      mainTextClass={classes.mainTextClass}
      publicKeyWrapperClass={classes.publicKeyWrapperClass}
      publicKeyClass={classes.publicKeyClass}
      subtextClass={classes.subtextClass}
      text={text}
    />
  );
};
