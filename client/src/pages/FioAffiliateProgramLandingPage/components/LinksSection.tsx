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
        <>
          {isBig && (
            <p className={classes.subtitle}>
              You have 2 ways to earn by inviting people to the FIO Protocol
            </p>
          )}
          <p className={classnames(classes.subtitle, classes.text)}>
            For every{' '}
            <span className="boldText">initial domain registration</span> or{' '}
            <span className="boldText">
              FIO handle registration on domains you own
            </span>
            , you can{' '}
            <span className="boldText">
              earn <span className="throughText">10%</span> 50%
            </span>{' '}
            of that purchase value through your affiliate links.
          </p>
        </>
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
