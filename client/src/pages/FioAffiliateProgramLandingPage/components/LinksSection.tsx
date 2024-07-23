import React from 'react';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../../constants/routes';

import { CommonComponentProps } from '../types';

import classes from '../styles/LinksSection.module.scss';

type Props = {
  isBig?: boolean;
  faqInfoPosition?: string;
  title?: string;
  showSubtitle?: boolean;
};

export const LinksSection: React.FC<CommonComponentProps & Props> = props => {
  const {
    isAuthenticated,
    isAffiliateEnabled,
    isBig,
    faqInfoPosition = 'below',
    title,
    showSubtitle,
    showLogin,
    showAffiliateModal,
  } = props;

  return (
    <div className={classnames(classes.container, isBig && classes.isBig)}>
      {title && <h1 className={classes.title}>{title}</h1>}
      {showSubtitle && (
        <p className={classes.subtitle}>
          Invite friends to FIO Protocol.{' '}
          <span className="boldText">For every domain registration</span> made
          through your link, you{' '}
          <span className="boldText">
            earn <span className="throughText">10%</span> 50%
          </span>{' '}
          of that purchase value.
        </p>
      )}
      <p className={classes.info}>
        Please see the FAQs {faqInfoPosition} for more information regarding
        earning and payout.
      </p>
      <div className={classes.buttonContainer}>
        {isAuthenticated && !isAffiliateEnabled && (
          <Button className={classes.button} onClick={showAffiliateModal}>
            Activate
          </Button>
        )}
        {isAuthenticated && isAffiliateEnabled && (
          <Link to={ROUTES.FIO_AFFILIATE_PROGRAM_ENABLED}>
            <Button className={classes.button}>View Affiliate Link</Button>
          </Link>
        )}
        {!isAuthenticated && (
          <Link to={ROUTES.CREATE_ACCOUNT}>
            <Button className={classnames(classes.button, 'mr-4')}>
              Create Account & Activate
            </Button>
          </Link>
        )}
        {!isAuthenticated && (
          <Button
            variant="outline-primary"
            className={classnames(classes.button, classes.outlineButton)}
            onClick={showLogin}
          >
            Sign In & Activate
          </Button>
        )}
      </div>
    </div>
  );
};
