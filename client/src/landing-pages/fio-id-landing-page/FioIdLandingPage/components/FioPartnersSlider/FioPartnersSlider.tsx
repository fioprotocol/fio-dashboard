import React, { useEffect, useState } from 'react';

import Slider from 'react-slick';
import classnames from 'classnames';

import aaxSrc from '../../../../../assets/images/ecosystem-simple-logo-icons/aax.svg';
import airnftsSrc from '../../../../../assets/images/ecosystem-simple-logo-icons/airnfts.svg';
import bitcoinComSrc from '../../../../../assets/images/ecosystem-simple-logo-icons/bitcoin.svg';
import changellySrc from '../../../../../assets/images/ecosystem-simple-logo-icons/changelly.svg';
import coinomiSrc from '../../../../../assets/images/ecosystem-simple-logo-icons/coinomi.svg';
import dopamineSrc from '../../../../../assets/images/ecosystem-simple-logo-icons/dopamine.svg';
import edgeSrc from '../../../../../assets/images/ecosystem-simple-logo-icons/edge.svg';
import guardaSrc from '../../../../../assets/images/ecosystem-simple-logo-icons/guarda.svg';
import liquidSrc from '../../../../../assets/images/ecosystem-simple-logo-icons/liquid.svg';
import operaSrc from '../../../../../assets/images/ecosystem-simple-logo-icons/opera.svg';
import trustwalletSrc from '../../../../../assets/images/ecosystem-simple-logo-icons/trustwallet.svg';
import whitebitSrc from '../../../../../assets/images/ecosystem-simple-logo-icons/whitebit.svg';

import classes from './FioPartnersSlider.module.scss';

const PartnersArray = [
  { src: aaxSrc, alt: 'AAX' },
  { src: airnftsSrc, alt: 'AirNFTs' },
  { src: bitcoinComSrc, alt: 'bitcoin.com' },
  { src: changellySrc, alt: 'Changelly' },
  { src: coinomiSrc, alt: 'Coinomi' },
  { src: dopamineSrc, alt: 'Dopamine' },
  { src: edgeSrc, alt: 'Edge' },
  { src: guardaSrc, alt: 'Guarda Wallet' },
  { src: liquidSrc, alt: 'Liquid' },
  { src: operaSrc, alt: 'Opera' },
  { src: trustwalletSrc, alt: 'Trust Wallet' },
  { src: whitebitSrc, alt: 'WhiteBIT' },
];

export const FioPartnersSlider: React.FC = () => {
  const [activeItem, setActiveItem] = useState(0);

  // This is a hack to set active class for last dot if we have decimal item number from react slick. It mean that we have last element.
  // For other reason it doesn't work.
  useEffect(() => {
    if (activeItem && !Number.isInteger(activeItem)) {
      const slickSliderElement = document.querySelector('.slick-slider');
      const ulElement = slickSliderElement.querySelector('ul');
      const lastLiElement = ulElement.lastElementChild;

      lastLiElement.classList.add('slick-active');
    } else {
      const slickSliderElement = document.querySelector('.slick-slider');
      const ulElement = slickSliderElement.querySelector('ul');
      const lastLiElement = ulElement.lastElementChild;

      lastLiElement.classList.remove('slick-active');
    }
  }, [activeItem]);

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>
        Trusted by <span className={classes.coloredTitle}>1Mil+</span> users,{' '}
        <span className={classes.coloredTitle}>100+</span> wallets & exchanges
        and more coming soon.
      </h1>
      <Slider
        dots
        className={classnames(
          classes.slider,
          activeItem > 0 && classes.nonFirstElement,
        )}
        infinite={false}
        arrows={false}
        slidesToShow={4.5}
        responsive={[
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 4,
            },
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 5,
            },
          },
          {
            breakpoint: 1240,
            settings: {
              slidesToShow: 2.5,
            },
          },
          {
            breakpoint: 1440,
            settings: {
              slidesToShow: 3.5,
            },
          },
        ]}
        appendDots={dots => <ul className={classes.sliderDots}>{dots}</ul>}
        dotsClass={classes.sliderDots}
        customPaging={() => <div className={classes.dot}></div>}
        beforeChange={(oldIndex, newIndex) => {
          setActiveItem(newIndex);
        }}
      >
        {PartnersArray.map(partner => (
          <div className={classes.imageContainer} key={partner.alt}>
            <img
              src={partner.src}
              alt={partner.alt}
              className={classes.image}
            />
          </div>
        ))}
        <a
          href="https://www.fioprotocol.io/ecosystem"
          target="_blank"
          rel="noopener noreferrer"
          className={classes.actionButton}
        >
          Show More
        </a>
      </Slider>
    </div>
  );
};
