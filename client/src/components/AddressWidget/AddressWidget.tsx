import React, { ReactNode } from 'react';
import classnames from 'classnames';

import SignInWidget from '../SignInWidget';

import TitleComponent from './components/TitleComponent';
import SubtitleComponent from './components/SubtitleComponent';
import ActionTextComponent from './components/ActionTextComponent';
import { FormComponent } from './components/FormComponent';

import { AnyType, TwitterNotification } from '../../types';

import classes from './AddressWidget.module.scss';

type Props = {
  links?: {
    getCryptoHandle: ReactNode;
  };
  logoSrc?: string;
  title?: ReactNode;
  subtitle?: string;
  actionText?: string;
  hasMinHeight?: boolean;
  showSignInWidget?: boolean;
  isAuthenticated?: boolean;
  isReverseColors?: boolean;
  isDarkWhite?: boolean;
  formAction?: boolean;
  suffix?: boolean;
  suffixText?: string;
  convert?: (value: string) => string;
  formatOnFocusOut?: boolean;
  notification?: TwitterNotification;
  customHandleSubmit?: AnyType;
};

const AddressWidget: React.FC<Props> = props => {
  const {
    actionText,
    hasMinHeight,
    isAuthenticated,
    isReverseColors,
    isDarkWhite,
    links,
    logoSrc,
    title,
    showSignInWidget,
    subtitle,
    formAction,
    suffix,
    suffixText,
    convert,
    formatOnFocusOut,
    notification,
    customHandleSubmit,
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
      <FormComponent
        isReverseColors={isReverseColors}
        links={links}
        isDarkWhite={isDarkWhite}
        formAction={formAction}
        suffix={suffix}
        suffixText={suffixText}
        convert={convert}
        formatOnFocusOut={formatOnFocusOut}
        notification={notification}
        customHandleSubmit={customHandleSubmit}
      />
      <SignInWidget show={!isAuthenticated && showSignInWidget} />
    </div>
  );
};

export default AddressWidget;
