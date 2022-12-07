import React from 'react';
import classnames from 'classnames';

import { LinksSection } from './LinksSection';

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
      "Get creative: you'll earn on each purchase thought your referral link.",
  },
];

const authenticatedInstructionContent = [
  {
    title: 'Activate',
    text: `<span class="doubleColor">Create an account</span>, get yourself a FIO Crypto Handle and activate affiliate link. Already have an account? Even simpler, <span class="doubleColor">sign in</span> & activate your link.`,
  },
  ...generalInstructionContent,
];

const unAuthenticatedInstructionContent = [
  {
    title: 'Activate',
    text: `<span class="doubleColor">Get yourself a FIO Crypto Handle</span> and activate affiliate link. Already have a FIO Crypto Handle? Even simpler, just <span class="doubleColor">activate your link</span>.`,
  },
  ...generalInstructionContent,
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
      <h1 className={classnames(classes.title, 'boldText')}>How It Works</h1>
      <div className={classes.instruction}>
        {(isAuthenticated
          ? authenticatedInstructionContent
          : unAuthenticatedInstructionContent
        ).map(({ title, text }, index) => (
          <div key={title} className={classes.instructionRow}>
            <div className={classes.instructionRowNumber}>0{index + 1}</div>
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
