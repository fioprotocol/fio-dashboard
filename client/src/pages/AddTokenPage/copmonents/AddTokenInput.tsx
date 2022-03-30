import React from 'react';
import { Field } from 'react-final-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldArrayRenderProps } from 'react-final-form-arrays';

import ChainCodeField from '../../../components/ChainCodeField/ChainCodeField';

import Input, { INPUT_UI_STYLES } from '../../../components/Input/Input';
import { ErrorBadge, COLOR_TYPE } from '../../../components/Input/ErrorBadge';

import { NFT_CHAIN_CODE_LIST } from '../../../constants/common';

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
        const fieldErrorsArr: {
          message: string;
          touched: boolean;
        }[] = [];

        if (fieldError != null) {
          if (typeof error === 'string') errMessage = fieldError;
          if (typeof error === 'object') {
            Object.keys(fieldError).forEach(key => {
              fieldError[key].touched =
                !!touched && touched[`tokens[${index}].${key}`];
              fieldErrorsArr.push(fieldError[key]);
            });
            const { message = '' } =
              fieldErrorsArr.find(fieldErr => fieldErr.touched) || {};
            message && (errMessage = message);
          }
        }

        const hasError = fieldErrorsArr.some(fieldErr => fieldErr.touched);

        const removeField = () => {
          if (oneItem) return;
          fields.remove(index);
        };

        return (
          <div className={classes.container} key={field}>
            <div className={classes.itemContainer}>
              <div className={classes.fieldContainer}>
                <div className={classes.chainCodeInput}>
                  <ChainCodeField
                    hasAutoWidth={true}
                    isHigh={true}
                    optionsList={NFT_CHAIN_CODE_LIST}
                    fieldName={`${field}.chainCode`}
                    hideError={true}
                    noShadow={true}
                  />
                </div>
                <div className={classes.tokenCodeInput}>
                  <Field
                    name={`${field}.tokenCode`}
                    type="text"
                    component={Input}
                    placeholder="Enter Token Code"
                    hideError={true}
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    upperCased={true}
                  />
                </div>
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
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AddTokenInput;
