import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { LinksSection } from './LinksSection';

import { ROUTES } from '../../../constants/routes';

import { CommonComponentProps } from '../types';

import classes from '../styles/HowItWorksSection.module.scss';

const generalInstructionContent = [
  {
    title: 'Connect',
    text:
      'You know the drill. Share your link across friends, families and favorite networks.',
  },
  {
    title: 'Earn',
    text:
      "Get creative: you'll earn FIO Tokens on every domain purchased via the referral link.",
  },
];

export const HowItWorksSection: React.FC<CommonComponentProps> = props => {
  const {
    isAuthenticated,
    isAffiliateEnabled,
    showLogin,
    showAffiliateModal,
  } = props;

  return (
    <section
      className={classnames(classes.containerLayout, classes.sectionLayout)}
    >
      <h1 className={classes.title}>How It Works</h1>
      <div className={classes.instruction}>
        <div className={classes.instructionRow}>
          <div className={classes.instructionRowNumber}>01</div>
          <div className={classes.instructionRowInfo}>
            <div className={classes.instructionRowInfoTitle}>Activate</div>
            {isAuthenticated ? (
              <div className={classes.instructionRowInfoText}>
                <Link to={ROUTES.FIO_ADDRESSES_SELECTION}>
                  Get yourself a FIO Handle
                </Link>{' '}
                and activate affiliate link. Already have a FIO Handle? Even
                simpler, just{' '}
                {/* eslint-disable-next-line no-script-url,jsx-a11y/anchor-is-valid */}
                <a href="javascript:void(0);" onClick={showAffiliateModal}>
                  activate your link
                </a>
              </div>
            ) : (
              <div className={classes.instructionRowInfoText}>
                <Link to={ROUTES.CREATE_ACCOUNT}>Create an account</Link>, get
                yourself a FIO Handle and activate affiliate link. Already have
                an account? Even simpler,{' '}
                {/* eslint-disable-next-line no-script-url,jsx-a11y/anchor-is-valid */}
                <a href="javascript:void(0);" onClick={showLogin}>
                  sign in
                </a>{' '}
                & activate your link.
              </div>
            )}
          </div>
        </div>
        {generalInstructionContent.map(({ title, text }, index) => (
          <div key={title} className={classes.instructionRow}>
            <div className={classes.instructionRowNumber}>0{index + 2}</div>
            <div className={classes.instructionRowInfo}>
              <div className={classes.instructionRowInfoTitle}>{title}</div>
              <div
                className={classes.instructionRowInfoText}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          </div>
        ))}
      </div>
      <LinksSection
        isAuthenticated={isAuthenticated}
        isAffiliateEnabled={isAffiliateEnabled}
        showSubtitle={false}
        showLogin={showLogin}
        showAffiliateModal={showAffiliateModal}
      />
    </section>
  );
};
