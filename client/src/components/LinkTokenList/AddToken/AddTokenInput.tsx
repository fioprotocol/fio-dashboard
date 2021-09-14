import React from 'react';
import { Field } from 'react-final-form';
import Input, { INPUT_UI_STYLES } from '../../Input/Input';
import { ErrorBadge, COLOR_TYPE } from '../../Input/ErrorBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './AddTokenInput.module.scss';

// todo: set props to component
// todo: set input errors
const AddTokenInput: React.FC<any> = props => {
  const {
    fields,
    meta: { error },
  } = props;
  return fields.map((field: string, index: number) => {
    const oneItem = fields.length === 1;
    const fieldError = error[index];
    let errMsg = '';
    if (fieldError != null) {
      if (typeof error == 'string') errMsg = fieldError;
      if (typeof error == 'object')
        errMsg = fieldError[Object.keys(fieldError)[0]];
    }
    const removeField = () => {
      if (oneItem) return;
      fields.remove(index);
    };
    return (
      <div className={classes.container} key={field}>
        <div className={classes.fieldContainer}>
          <div className={classes.codeInput}>
            <Field
              name={`${field}.chainCode`}
              type="text"
              component={Input}
              placeholder="Enter Chain Code"
              hideError={true}
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              upperCased={true}
            />
          </div>
          <div className={classes.codeInput}>
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
              showCopyButton={true}
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
            />
          </div>
          {oneItem ? (
            <FontAwesomeIcon
              icon="times-circle"
              className={`${classes.closeIcon} invisible`}
            />
          ) : (
            <FontAwesomeIcon
              icon="times-circle"
              className={classes.closeIcon}
              onClick={removeField}
            />
          )}
        </div>
        {errMsg && (
          <div className={classes.errorContainer}>
            <ErrorBadge
              error={errMsg}
              hasError={true}
              wrap={true}
              color={COLOR_TYPE.WARN}
            />
          </div>
        )}
      </div>
    );
  });
};

export default AddTokenInput;
