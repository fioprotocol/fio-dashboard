import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import { LinksSection } from './LinksSection';

import { ROUTES } from '../../../constants/routes';

import c1 from '../../../assets/images/affiliate/c_1.png';
import c2 from '../../../assets/images/affiliate/c_2.png';
import c3 from '../../../assets/images/affiliate/c_3.png';

import { CommonComponentProps } from '../types';

import classes from '../styles/HowItWorksSection.module.scss';

const generalInstructionContent = [
  {
    title: 'Connect',
    text:
      'Share your FIO Domain and FIO Handle affiliate links across friends, families, and favorite networks.',
  },
  {
    title: 'Earn',
    text:
      'Get creative: you’ll earn on each purchase thought your referral links.',
  },
];

const carouselItems = [c1, c2, c3];

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
      <Slider
        className={classes.slider}
        dots
        infinite
        arrows={false}
        autoplay
        autoplaySpeed={5000}
        appendDots={dots => <ul className={classes.sliderDots}>{dots}</ul>}
        dotsClass={classes.sliderDots}
        customPaging={() => <div className={classes.dot}></div>}
      >
        {carouselItems.map(item => (
          <div>
            <div
              key={item}
              className={classes.img}
              style={{ backgroundImage: `url(${item})` }}
            />
          </div>
        ))}
      </Slider>
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
                and activate your FIO Domain and FIO Handle affiliate links.
                Already have a FIO Handle? Even simpler, just{' '}
                {/* eslint-disable-next-line no-script-url,jsx-a11y/anchor-is-valid */}
                <a href="javascript:void(0);" onClick={showAffiliateModal}>
                  activate your links
                </a>
              </div>
            ) : (
              <div className={classes.instructionRowInfoText}>
                <Link to={ROUTES.CREATE_ACCOUNT}>Create an account</Link>, get
                yourself a FIO Handle and activate your FIO Domain and FIO
                Handle affiliate links. Already have an account? Even simpler,{' '}
                {/* eslint-disable-next-line no-script-url,jsx-a11y/anchor-is-valid */}
                <a href="javascript:void(0);" onClick={showLogin}>
                  sign in
                </a>{' '}
                & activate your links.
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
