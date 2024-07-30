import { FC } from 'react';
import classnames from 'classnames';

import FioTokens from '../../../assets/images/fio-tokens.png';

import classes from '../styles/NeedTokensBadge.module.scss';
import config from '../../../config';

const TotalBalanceBadge: FC = () => {
  return (
    <div className={classnames(classes.actionBadgeContainer)}>
      <div className={classes.content}>
        <div className={classes.imageContainer}>
          <img src={FioTokens} alt="fio tokens" />
        </div>
        <p className={classes.title}>Need FIO Tokens?</p>
        <p className={classes.description}>
          Easily get FIO tokens with a credit/debit card or crypto.
        </p>
        <div className={classes.actionButtons}>
          <a href={config.getTokensUrl} className={classes.link}>
            Get FIO Tokens
          </a>
        </div>
      </div>
    </div>
  );
};

export default TotalBalanceBadge;
