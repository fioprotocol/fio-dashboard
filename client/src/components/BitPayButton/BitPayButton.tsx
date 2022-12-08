import React from 'react';

import SubmitButton from '../common/SubmitButton/SubmitButton';

import bitPayLogoSrc from '../../assets/images/bitpay-logo-white.png';

import classes from './BitPayButton.module.scss';

type Props = {
  onClick: () => void;
  hasLowHeight?: boolean;
  bitPayButtonSize?: keyof typeof BITPAY_LOGO_WIDTH;
  loading: boolean;
};

type ButtonTextProps = {
  width: string;
};

export const BITPAY_LOGO_WIDTH = {
  default: '86px',
  hasLowHeight: '65px',
} as const;

export const BitPayButtonText: React.FC<ButtonTextProps> = props => {
  const { width } = props;
  return (
    <div className="d-flex justify-content-center align-items-center">
      <span className={classes.regularText}>Pay with</span>
      <div>
        <img
          src={bitPayLogoSrc}
          alt="Pay With BitPay"
          className=""
          width={width}
        />
      </div>
    </div>
  );
};

export const BitPayButton: React.FC<Props> = props => {
  const buttonTextDimensions =
    BITPAY_LOGO_WIDTH[props.bitPayButtonSize] || BITPAY_LOGO_WIDTH.default;

  return (
    <SubmitButton
      {...props}
      text={<BitPayButtonText width={buttonTextDimensions} />}
      isCobalt
    />
  );
};
