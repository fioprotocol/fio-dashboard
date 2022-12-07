import React, { ReactNode } from 'react';
import classnames from 'classnames';

import AddressDomainForm from '../../components/AddressDomainForm';
import SignInWidget from '../SignInWidget';

import TitleComponent from './components/TitleComponent';
import SubtitleComponent from './components/SubtitleComponent';
import ActionTextComponent from './components/ActionTextComponent';
import PlugComponent from './components/PlugComponent';

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
};

const AddressWidget: React.FC<Props> = props => {
  const {
    logoSrc,
    title,
    subtitle,
    actionText,
    hasMinHeight,
    showSignInWidget,
    hideBottomPlug,
    isAuthenticated,
  } = props;

  return (
    <div
      className={classnames(
        classes.container,
        hasMinHeight && classes.hasMinHeight,
      )}
    >
      <TitleComponent logoSrc={logoSrc} title={title} />
      <SubtitleComponent subtitle={subtitle} />
      <ActionTextComponent actionText={actionText} />
      <div className={classes.form}>
        <AddressDomainForm isHomepage={true} type={ADDRESS} {...props} />
      </div>
      <SignInWidget show={!isAuthenticated && showSignInWidget} />
      <PlugComponent show={!hideBottomPlug} />
    </div>
  );
};

export default AddressWidget;
