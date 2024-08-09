import React from 'react';
import { Field, Form, useForm } from 'react-final-form';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';

import SubmitButton from '../../../common/SubmitButton/SubmitButton';
import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../Input/TextInput';
import NotificationBadge from '../../../NotificationBadge';
import Dropdown from '../../../Input/Dropdown';

import { QUERY_PARAMS_NAMES } from '../../../../constants/queryParams';
import { ROUTES } from '../../../../constants/routes';

import { AddressWidgetNotification } from '../../../../types';

import classes from './FormComponent.module.scss';

type Props = {
  buttonText?: string;
  classNameForm?: string;
  disabled?: boolean;
  disabledInput?: boolean;
  disabledInputGray?: boolean;
  options?: Array<{ id: string; name: string }>;
  links?: {
    getCryptoHandle: React.ReactNode;
  };
  isReverseColors?: boolean;
  isTransparent?: boolean;
  isValidating?: boolean;
  prefix?: string;
  suffixText?: string;
  lowerCased?: boolean;
  convert?: (value: string) => string;
  formatOnFocusOut?: boolean;
  loading?: boolean;
  notification?: AddressWidgetNotification;
  customHandleSubmit?: (data: {
    address: string;
    domain?: string;
  }) => Promise<void> | void;
  showCustomDomainInput?: boolean;
  showSubmitButton?: boolean;
  placeHolderText?: string;
  dropdownClassNames?: string;
  controlClassNames?: string;
  placeholderClassNames?: string;
  menuClassNames?: string;
  arrowCloseClassNames?: string;
  arrowOpenClassNames?: string;
  optionItemClassNames?: string;
  optionButtonClassNames?: string;
  defaultValue?: { id: string; name: string };
  hasRoundRadius?: boolean;
  inputClassNames?: string;
  inputCustomDomainClassNames?: string;
  regInputCustomDomainClassNames?: string;
  isBlueButton?: boolean;
  onInputChanged?: (value: string) => string;
  onAddressChanged?: (value: string) => void;
  onDomainChanged?: (value: string) => void;
  toggleShowCustomDomain?: (isCustomDomain: boolean) => void;
};

type ActionButtonProps = {
  buttonText?: string;
  isBlueButton?: boolean;
  disabled?: boolean;
  isTransparent?: boolean;
  isWhiteBordered?: boolean;
  links?: {
    getCryptoHandle: React.ReactNode;
  };
  loading?: boolean;
};

const CUSTOM_DROPDOWN_VALUE = {
  id: 'addCustomDomain',
  name: '+ Add custom domain',
};

const ActionButton: React.FC<ActionButtonProps> = props => {
  const {
    buttonText = 'GET IT',
    isBlueButton,
    disabled,
    isTransparent,
    isWhiteBordered,
    links,
    loading,
  } = props;
  const form = useForm();

  if (links && links.getCryptoHandle) {
    const registeredField = form.getRegisteredFields();
    const fieldValue: string = registeredField[0]
      ? form.getFieldState(registeredField[0]).value
      : '';

    const link =
      links.getCryptoHandle.toString() + `?${registeredField[0]}=${fieldValue}`;

    return (
      <a
        className={`${classes.button} d-flex justify-content-center`}
        href={link}
        target="_blank"
        rel="noreferrer"
      >
        <SubmitButton
          disabled={disabled}
          isButtonType={true}
          hasLowHeight={true}
          text={buttonText}
          hasSmallText={true}
          isWhiteBordered={isWhiteBordered}
          isTransparent={isTransparent}
          loading={loading}
          isBlue={isBlueButton}
        />
      </a>
    );
  }

  return (
    <div className={classes.button}>
      <SubmitButton
        disabled={disabled}
        withoutMargin={true}
        hasLowHeight={true}
        text={buttonText}
        hasSmallText={true}
        isWhiteBordered={isWhiteBordered}
        isTransparent={isTransparent}
        loading={loading}
        isBlue={isBlueButton}
      />
    </div>
  );
};

export const FormComponent: React.FC<Props> = props => {
  const {
    buttonText,
    classNameForm,
    disabled,
    disabledInput,
    disabledInputGray,
    options,
    isReverseColors,
    isTransparent,
    isValidating,
    links,
    loading,
    lowerCased = true,
    prefix,
    suffixText,
    convert,
    formatOnFocusOut,
    notification,
    customHandleSubmit,
    showCustomDomainInput,
    showSubmitButton = true,
    placeHolderText = 'Enter a Username',
    dropdownClassNames,
    controlClassNames,
    placeholderClassNames,
    menuClassNames,
    arrowCloseClassNames,
    arrowOpenClassNames,
    optionItemClassNames,
    optionButtonClassNames,
    defaultValue,
    hasRoundRadius,
    inputClassNames,
    inputCustomDomainClassNames,
    regInputCustomDomainClassNames,
    isBlueButton,
    onInputChanged,
    onAddressChanged,
    onDomainChanged,
    toggleShowCustomDomain,
  } = props;

  const history = useHistory();

  const onSubmit = ({
    address,
    domain,
  }: {
    address: string;
    domain?: string;
  }) => {
    if (links && links.getCryptoHandle) return;

    const params: {
      pathname: string;
      search?: string;
    } = { pathname: ROUTES.FIO_ADDRESSES_SELECTION };

    if (address) {
      params.search = `${QUERY_PARAMS_NAMES.ADDRESS}=${address}${
        domain ? `@${domain}` : ''
      }`;
    }

    history.push(params);
  };

  return (
    <Form onSubmit={customHandleSubmit ? customHandleSubmit : onSubmit}>
      {({ handleSubmit }) => (
        <div className={classes.formContainer}>
          {notification && notification.hasNotification && (
            <NotificationBadge
              type={notification.type}
              show={notification.hasNotification}
              message={notification.message}
              title={notification.title}
              hasNewDesign={true}
              marginBottomXs
              marginTopZero
            />
          )}

          <form
            onSubmit={handleSubmit}
            className={classnames(classes.form, classNameForm)}
          >
            <div className={classes.field}>
              <Field
                name="address"
                type="text"
                placeholder={placeHolderText}
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                component={TextInput}
                hideError="true"
                lowerCased={lowerCased}
                suffix={!options && suffixText}
                formatOnBlur={formatOnFocusOut}
                format={convert}
                parse={onInputChanged}
                additionalOnchangeAction={onAddressChanged}
                disabled={disabledInput}
                disabledInputGray={disabledInputGray}
                loading={loading}
                hasRoundRadius={hasRoundRadius}
                inputClassNames={inputClassNames}
              />
            </div>
            {options ? (
              showCustomDomainInput ? (
                <div className={classes.field}>
                  <Field
                    name="domain"
                    type="text"
                    placeholder="Custom domain"
                    colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                    uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                    component={TextInput}
                    lowerCased={lowerCased}
                    formatOnBlur={formatOnFocusOut}
                    format={convert}
                    onClose={() => {
                      toggleShowCustomDomain?.(false);
                    }}
                    parse={onInputChanged}
                    additionalOnchangeAction={onDomainChanged}
                    hideError="true"
                    prefix={prefix}
                    disabled={disabledInput}
                    disabledInputGray={disabledInputGray}
                    loading={isValidating}
                    hasRoundRadius={hasRoundRadius}
                    inputClassNames={inputCustomDomainClassNames}
                    regInputClassNames={regInputCustomDomainClassNames}
                  />
                </div>
              ) : (
                <Field
                  name="domain"
                  component={Dropdown}
                  options={options}
                  customValue={CUSTOM_DROPDOWN_VALUE}
                  toggleToCustom={() => {
                    toggleShowCustomDomain?.(true);
                  }}
                  placeholder="Select Domain"
                  hideError
                  disabled={disabledInput}
                  additionalOnchangeAction={onDomainChanged}
                  actionOnChange={onInputChanged}
                  dropdownClassNames={dropdownClassNames}
                  controlClassNames={controlClassNames}
                  placeholderClassNames={placeholderClassNames}
                  menuClassNames={menuClassNames}
                  arrowCloseClassNames={arrowCloseClassNames}
                  arrowOpenClassNames={arrowOpenClassNames}
                  optionItemClassNames={optionItemClassNames}
                  optionButtonClassNames={optionButtonClassNames}
                  defaultOptionValue={defaultValue}
                />
              )
            ) : null}
            {showSubmitButton && (
              <ActionButton
                disabled={disabled}
                isWhiteBordered={isReverseColors}
                links={links}
                buttonText={buttonText}
                isTransparent={isTransparent}
                loading={loading}
                isBlueButton={isBlueButton}
              />
            )}
          </form>
        </div>
      )}
    </Form>
  );
};
