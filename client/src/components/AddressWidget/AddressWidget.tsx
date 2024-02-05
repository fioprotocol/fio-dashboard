import React, { ReactNode } from 'react';
import classnames from 'classnames';

import SignInWidget from '../SignInWidget';

import TitleComponent from './components/TitleComponent';
import SubtitleComponent from './components/SubtitleComponent';
import ActionTextComponent from './components/ActionTextComponent';
import { FormComponent } from './components/FormComponent';

import { TwitterNotification } from '../../types';

import classes from './AddressWidget.module.scss';

type Props = {
  disabled?: boolean;
  disabledInput?: boolean;
  disabledInputGray?: boolean;
  classNameActionText?: string;
  classNameContainer?: string;
  classNameForm?: string;
  classNameLogo?: string;
  classNameLogoContainer?: string;
  classNameSubtitleTitle?: string;
  classNameTitle?: string;
  links?: {
    getCryptoHandle: ReactNode;
  };
  logoSrc?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  actionText?: string;
  hasMinHeight?: boolean;
  showSignInWidget?: boolean;
  isAuthenticated?: boolean;
  isReverseColors?: boolean;
  isTransparent?: boolean;
  isDarkWhite?: boolean;
  suffixText?: string;
  convert?: (value: string) => string;
  formatOnFocusOut?: boolean;
  notification?: TwitterNotification;
  customHandleSubmit?: ({ address }: { address: string }) => Promise<void>;
  showSubmitButton?: boolean;
  placeHolderText?: string;
  onInputChanged?: (value: string) => string;
  buttonText?: string;
  stepNumber?: string;
  stepText?: string;
};

const AddressWidget: React.FC<Props> = props => {
  const {
    actionText,
    children,
    classNameActionText,
    classNameContainer,
    classNameForm,
    classNameLogo,
    classNameLogoContainer,
    classNameSubtitleTitle,
    classNameTitle,
    disabled,
    disabledInput,
    disabledInputGray,
    hasMinHeight,
    isAuthenticated,
    isReverseColors,
    isTransparent,
    isDarkWhite,
    links,
    logoSrc,
    title,
    showSignInWidget,
    subtitle,
    suffixText,
    convert,
    formatOnFocusOut,
    notification,
    customHandleSubmit,
    showSubmitButton = true,
    placeHolderText,
    onInputChanged,
    buttonText,
    stepNumber,
    stepText,
  } = props;

  return (
    <div
      className={classnames(
        classes.container,
        hasMinHeight && classes.hasMinHeight,
        isReverseColors && classes.isReverseColors,
        isDarkWhite && classes.isDarkWhite,
        classNameContainer,
      )}
    >
      <TitleComponent
        logoSrc={logoSrc}
        title={title}
        classNameLogo={classNameLogo}
        classNameLogoContainer={classNameLogoContainer}
        classNameTitle={classNameTitle}
      />
      <SubtitleComponent
        subtitle={subtitle}
        className={classNameSubtitleTitle}
      />
      <ActionTextComponent
        actionText={actionText}
        className={classNameActionText}
      />
      {stepNumber && stepText && (
        <p className={classes.step}>
          <b className="boldText">{stepNumber}:</b> {stepText}
        </p>
      )}

      <FormComponent
        classNameForm={classNameForm}
        disabled={disabled}
        disabledInput={disabledInput}
        disabledInputGray={disabledInputGray}
        isReverseColors={isReverseColors}
        isTransparent={isTransparent}
        links={links}
        suffixText={suffixText}
        convert={convert}
        formatOnFocusOut={formatOnFocusOut}
        notification={notification}
        customHandleSubmit={customHandleSubmit}
        showSubmitButton={showSubmitButton}
        placeHolderText={placeHolderText}
        onInputChanged={onInputChanged}
        buttonText={buttonText}
      />

      {children}
      <SignInWidget show={!isAuthenticated && showSignInWidget} />
    </div>
  );
};

export default AddressWidget;
