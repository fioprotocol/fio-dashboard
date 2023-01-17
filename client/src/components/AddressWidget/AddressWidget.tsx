import React, { ReactNode } from 'react';
import classnames from 'classnames';

import AddressDomainForm from '../../components/AddressDomainForm';
import SignInWidget from '../SignInWidget';

import TitleComponent from './components/TitleComponent';
import SubtitleComponent from './components/SubtitleComponent';
import ActionTextComponent from './components/ActionTextComponent';

import { ADDRESS } from '../../constants/common';

import classes from './AddressWidget.module.scss';

type Props = {
  links?: {
    getCryptoHandle: string | ReactNode;
  };
  logoSrc?: string;
  title?: string | ReactNode;
  subtitle?: string;
  actionText?: string;
  hasMinHeight?: boolean;
  showSignInWidget?: boolean;
  hideBottomPlug?: boolean;
  isAuthenticated?: boolean;
  hasFreeAddress?: boolean;
  isReverseColors?: boolean;
  isDarkWhite?: boolean;
};

const AddressWidget: React.FC<Props> = props => {
  const {
    logoSrc,
    title,
    subtitle,
    actionText,
    hasMinHeight,
    showSignInWidget,
    isAuthenticated,
    isReverseColors,
    isDarkWhite,
  } = props;

  return (
    <div
      className={classnames(
        classes.container,
        hasMinHeight && classes.hasMinHeight,
        isReverseColors && classes.isReverseColors,
        isDarkWhite && classes.isDarkWhite,
      )}
    >
      <TitleComponent logoSrc={logoSrc} title={title} />
      <SubtitleComponent subtitle={subtitle} />
      <ActionTextComponent actionText={actionText} />
      <div className={classes.form}>
        <AddressDomainForm
          isHomepage={true}
          type={ADDRESS}
          isReverseColors={isReverseColors}
          isDarkWhite={isDarkWhite}
          {...props}
        />
      </div>
      <SignInWidget show={!isAuthenticated && showSignInWidget} />
    </div>
  );
};

export default AddressWidget;
