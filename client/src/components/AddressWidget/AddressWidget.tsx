import React, { ReactNode } from 'react';
import classnames from 'classnames';

import SignInWidget from '../SignInWidget';

import TitleComponent from './components/TitleComponent';
import SubtitleComponent from './components/SubtitleComponent';
import ActionTextComponent from './components/ActionTextComponent';
import { FormComponent } from './components/FormComponent';

import { AddressWidgetDomain, AddressWidgetNotification } from '../../types';

import classes from './AddressWidget.module.scss';

export type AddressWidgetProps = {
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
  dropdownClassNames?: string;
  controlClassNames?: string;
  placeholderClassNames?: string;
  menuClassNames?: string;
  arrowCloseClassNames?: string;
  arrowOpenClassNames?: string;
  optionItemClassNames?: string;
  optionButtonClassNames?: string;
  inputCustomDomainClassNames?: string;
  regInputCustomDomainClassNames?: string;
  defaultValue?: AddressWidgetDomain;
  links?: {
    getCryptoHandle: ReactNode;
  };
  loading?: boolean;
  logoSrc?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  actionText?: string;
  hasMinHeight?: boolean;
  showSignInWidget?: boolean;
  isAuthenticated?: boolean;
  isReverseColors?: boolean;
  isTransparent?: boolean;
  isValidating?: boolean;
  isDarkWhite?: boolean;
  lowerCased?: boolean;
  options?: Array<AddressWidgetDomain>;
  prefix?: string;
  showCustomDomainInput?: boolean;
  suffixText?: string;
  convert?: (value: string) => string;
  formatOnFocusOut?: boolean;
  notification?: AddressWidgetNotification;
  customHandleSubmit?: (data: {
    address: string;
    domain?: string;
  }) => Promise<void> | void;
  showSubmitButton?: boolean;
  placeHolderText?: string;
  onInputChanged?: (value: string) => string;
  onAddressChanged?: (value: string) => void;
  onDomainChanged?: (value: string) => void;
  buttonText?: string;
  stepNumber?: string;
  stepText?: string;
  hasRoundRadius?: boolean;
  inputClassNames?: string;
  isBlueButton?: boolean;
  toggleShowCustomDomain?: (isCustomDomain: boolean) => void;
  onFocus?: () => void;
};

const AddressWidget: React.FC<AddressWidgetProps> = props => {
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
    loading,
    logoSrc,
    lowerCased,
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
    onAddressChanged,
    onDomainChanged,
    buttonText,
    stepNumber,
    stepText,
    options,
    dropdownClassNames,
    controlClassNames,
    placeholderClassNames,
    menuClassNames,
    arrowCloseClassNames,
    arrowOpenClassNames,
    optionItemClassNames,
    optionButtonClassNames,
    showCustomDomainInput,
    defaultValue,
    hasRoundRadius,
    inputClassNames,
    inputCustomDomainClassNames,
    regInputCustomDomainClassNames,
    isBlueButton,
    prefix,
    toggleShowCustomDomain,
    onFocus,
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
        loading={loading}
        lowerCased={lowerCased}
        suffixText={suffixText}
        convert={convert}
        formatOnFocusOut={formatOnFocusOut}
        notification={notification}
        customHandleSubmit={customHandleSubmit}
        showSubmitButton={showSubmitButton}
        placeHolderText={placeHolderText}
        onInputChanged={onInputChanged}
        onAddressChanged={onAddressChanged}
        onDomainChanged={onDomainChanged}
        buttonText={buttonText}
        isBlueButton={isBlueButton}
        options={options}
        showCustomDomainInput={showCustomDomainInput}
        dropdownClassNames={dropdownClassNames}
        controlClassNames={controlClassNames}
        placeholderClassNames={placeholderClassNames}
        menuClassNames={menuClassNames}
        arrowCloseClassNames={arrowCloseClassNames}
        arrowOpenClassNames={arrowOpenClassNames}
        optionItemClassNames={optionItemClassNames}
        optionButtonClassNames={optionButtonClassNames}
        defaultValue={defaultValue}
        hasRoundRadius={hasRoundRadius}
        inputClassNames={inputClassNames}
        inputCustomDomainClassNames={inputCustomDomainClassNames}
        regInputCustomDomainClassNames={regInputCustomDomainClassNames}
        prefix={prefix}
        toggleShowCustomDomain={toggleShowCustomDomain}
        onFocus={onFocus}
      />

      {children}
      <SignInWidget show={!isAuthenticated && showSignInWidget} />
    </div>
  );
};

export default AddressWidget;
