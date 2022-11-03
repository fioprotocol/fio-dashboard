import React from 'react';
import { Field } from 'react-final-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldArrayRenderProps } from 'react-final-form-arrays';
import classnames from 'classnames';

import { ChainAndTokenCodesAutocompleteFields } from '../../../components/ChainAndTokenCodesAutocompleteFields/ChainAndTokenCodesAutocompleteFields';

import Input, { INPUT_UI_STYLES } from '../../../components/Input/Input';
import {
  ErrorBadge,
  COLOR_TYPE,
  ERROR_UI_TYPE,
} from '../../../components/Input/ErrorBadge';

import { FormValues } from '../types';

import classes from '../styles/AddTokenInput.module.scss';

type Props = {
  touched?: { [key: string]: boolean };
};

const AddTokenInput: React.FC<FieldArrayRenderProps<FormValues, HTMLElement> &
  Props> = props => {
  const {
    fields,
    meta: { error },
    touched,
  } = props;

  return (
    <div className={classes.fields}>
      {fields.map((field: string, index: number) => {
        const oneItem = fields.length === 1;
        const fieldError = error != null ? error[index] : '';
        let errMessage = '';
        let errType = ERROR_UI_TYPE.TEXT;
        const fieldErrorsArr: {
          message: string;
          touched: boolean;
          type?: string;
        }[] = [];
        if (fieldError != null) {
          if (typeof error === 'string') errMessage = fieldError;
          if (typeof error === 'object') {
            Object.keys(fieldError).forEach(key => {
              fieldError[key].touched =
                !!touched && touched[`tokens[${index}].${key}`];
              fieldErrorsArr.push(fieldError[key]);
            });
            const { message = '', type } =
              fieldErrorsArr.find(fieldErr => fieldErr.touched) || {};
            message && (errMessage = message);
            type && (errType = type);
          }
        }

        const hasError = fieldErrorsArr.some(fieldErr => fieldErr.touched);

        const removeField = () => {
          if (oneItem) return;
          fields.remove(index);
        };

        return (
          <div
            className={classnames(
              classes.container,
              errType === ERROR_UI_TYPE.BADGE && classes.hasMarginBottom,
            )}
            key={field}
          >
            <div className={classes.itemContainer}>
              <div className={classes.fieldContainer}>
                <ChainAndTokenCodesAutocompleteFields
                  chainCodeFieldName={`${field}.chainCode`}
                  hasAutoWidth={true}
                  hideError={true}
                  isHigh={true}
                  noShadow={true}
                  tokenCodeFieldName={`${field}.tokenCode`}
                />
                <div className={classes.pubAddressInput}>
                  <Field
                    name={`${field}.publicAddress`}
                    type="text"
                    component={Input}
                    placeholder="Enter or Paste Public Address"
                    hideError={true}
                    showPasteButton={true}
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  />
                </div>
              </div>
              {!oneItem && (
                <FontAwesomeIcon
                  icon="times-circle"
                  className={classes.closeIcon}
                  onClick={removeField}
                />
              )}
            </div>
            <div className={classes.errorContainer}>
              <ErrorBadge
                error={errMessage}
                hasError={hasError}
                wrap={true}
                color={COLOR_TYPE.WARN}
                type={errType}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AddTokenInput;
