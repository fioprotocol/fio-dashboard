import React from 'react';
import classnames from 'classnames';

import { LinksSection } from './LinksSection';

import { CommonComponentProps } from '../types';

import classes from '../styles/FAQSection.module.scss';

export const IntroSection: React.FC<CommonComponentProps> = props => {
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
      <LinksSection
        isAuthenticated={isAuthenticated}
        isAffiliateEnabled={isAffiliateEnabled}
        title="Unlimited Earning Potential!"
        showSubtitle
        isBig
        showLogin={showLogin}
        showAffiliateModal={showAffiliateModal}
      />
    </section>
  );
};
