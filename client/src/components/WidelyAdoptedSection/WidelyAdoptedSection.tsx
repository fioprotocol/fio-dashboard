import React from 'react';

import classes from './WidelyAdoptedSection.module.scss';

import aaxSrc from '../../assets/images/ecosystem/aax.svg';
import airnftsSrc from '../../assets/images/ecosystem/airnfts.svg';
import bitcoinComSrc from '../../assets/images/ecosystem/bitcoin.com.svg';
import changellySrc from '../../assets/images/ecosystem/changelly.svg';
import coinomiSrc from '../../assets/images/ecosystem/coinomi.svg';
import dopamineSrc from '../../assets/images/ecosystem/dopamine.svg';
import edgeSrc from '../../assets/images/ecosystem/edge.svg';
import guardaSrc from '../../assets/images/ecosystem/guarda.svg';
import liquidSrc from '../../assets/images/ecosystem/liquid.svg';
import operaSrc from '../../assets/images/ecosystem/opera.svg';
import trustwalletSrc from '../../assets/images/ecosystem/trustwallet.svg';
import whitebitSrc from '../../assets/images/ecosystem/whitebit.svg';
import SubmitButton from '../common/SubmitButton/SubmitButton';

export const WidelyAdoptedSection: React.FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes.title}>Widely Adopted!</div>

      <div className={classes.descriptionContainer}>
        <div className={classes.description}>
          <span className="boldText">900,000 +</span> - Handles registered
        </div>
        <div className={classes.description}>
          <span className="boldText">100 +</span> - Wallets & exchanges use it
        </div>
      </div>

      <div className={classes.iconsGrid}>
        <img src={aaxSrc} alt="AAX" loading="lazy" />
        <img src={airnftsSrc} alt="AirNFTs" loading="lazy" />
        <img src={bitcoinComSrc} alt="bitcoin.com" loading="lazy" />
        <img src={changellySrc} alt="Changelly" loading="lazy" />
        <img src={coinomiSrc} alt="Coinomi" loading="lazy" />
        <img src={dopamineSrc} alt="Dopamine" loading="lazy" />
        <img src={edgeSrc} alt="Edge" loading="lazy" />
        <img src={guardaSrc} alt="Guarda Wallet" loading="lazy" />
        <img src={liquidSrc} alt="Liquid" loading="lazy" />
        <img src={operaSrc} alt="Opera" loading="lazy" />
        <img src={trustwalletSrc} alt="Trust Wallet" loading="lazy" />
        <img src={whitebitSrc} alt="WhiteBIT" loading="lazy" />
      </div>

      <div className={classes.buttonWrapper}>
        <a href="https://fio.net/discover/ecosystem">
          <SubmitButton
            text="SHOW MORE"
            hasLowHeight
            hasSmallText
            withoutMargin
          />
        </a>
      </div>
    </div>
  );
};
