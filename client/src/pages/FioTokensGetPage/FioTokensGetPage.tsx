import React from 'react';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import { ChangeNowLink } from './components/ChangeNowLink';
import { PartnerLink } from './components/PartnerLink';

import { BADGE_TYPES } from '../../components/Badge/Badge';

import { ContainerProps, Partner } from './types';

import moneroLogoSrc from '../../assets/images/monero-logo.svg';
import binanceLogoSrc from '../../assets/images/binance-logo.svg';
import whiteBitLogoSrc from '../../assets/images/wb-logo.svg';
import gateLogoSrc from '../../assets/images/gate-logo.svg';
import changellyLogoSrc from '../../assets/images/changelly-logo.svg';
import bitMartLogoSrc from '../../assets/images/bit-mart-logo.svg';
import xtLogoSrc from '../../assets/images/xt-logo.svg';
import ascendEXLogoSrc from '../../assets/images/ascendex-logo.svg';
import edgeLogoSrc from '../../assets/images/edge-logo.svg';
import infinityWalletLogoSrc from '../../assets/images/infinity-wallet-logo.svg';
import simbaLogoSrc from '../../assets/images/simba-logo.svg';
import simpleSwapLogoSrc from '../../assets/images/simple-swap-logo.svg';

import classes from './FioTokensGetPage.module.scss';

const exchangesPartners: Partner[] = [
  {
    name: 'Binance',
    link: 'https://www.binance.com/en/trade/FIO_USDT',
    image: binanceLogoSrc,
  },
  {
    name: 'WhiteBIT',
    link: 'https://whitebit.com/',
    image: whiteBitLogoSrc,
  },
  {
    name: 'Gate.io',
    link: 'https://www.gate.io/trade/FIO_USDT',
    image: gateLogoSrc,
  },
  {
    name: 'Changelly',
    link: 'https://changelly.com/',
    image: changellyLogoSrc,
  },
  {
    name: 'BitMart',
    link: 'https://www.bitmart.com/trade/en?symbol=FIO_USDT&layout=basic',
    image: bitMartLogoSrc,
  },
  {
    name: 'XT.com',
    link: 'https://www.xt.com/',
    image: xtLogoSrc,
  },
  {
    name: 'AscendEX',
    link: 'https://ascendex.com/en/global-digital-asset-platform',
    image: ascendEXLogoSrc,
  },
  {
    name: 'Edge',
    link: 'https://dl.edge.app/fio',
    image: edgeLogoSrc,
  },
  {
    name: 'Infinity Wallet',
    link: 'https://infinitywallet.io/',
    image: infinityWalletLogoSrc,
  },
  {
    name: 'Simba',
    link: 'https://www.cryptosimba.com/',
    image: simbaLogoSrc,
  },
  {
    name: 'SimpleSwap',
    link: 'https://simpleswap.io',
    image: simpleSwapLogoSrc,
  },
  {
    name: 'Monero',
    link: 'https://monero.com/',
    image: moneroLogoSrc,
  },
];

const FioTokensGetPage: React.FC<ContainerProps> = props => {
  const { history } = props;

  const onBack = () => {
    history.goBack();
  };

  return (
    <PseudoModalContainer
      title="Where to Get FIO Tokens"
      onBack={onBack}
      middleWidth={true}
    >
      <p className={classes.text}>
        Easily get FIO tokens with a Credit/Debit Card or Crypto with ChangeNOW.
      </p>
      <div className={classes.linksList}>
        <ChangeNowLink />
      </div>
      <p className={classes.text}>
        You can also get FIO through on of our many partners below.
      </p>
      <InfoBadge
        className={classes.registrationBadge}
        type={BADGE_TYPES.INFO}
        show
        title="Registration"
        message="Some FIO partners may require registration."
      />

      <p className={classes.subtitle}>Exchanges and Token Swapping</p>
      <div className={classes.linksList}>
        {exchangesPartners.map(partner => (
          <PartnerLink key={partner.name} partner={partner} />
        ))}
      </div>
    </PseudoModalContainer>
  );
};

export default FioTokensGetPage;
