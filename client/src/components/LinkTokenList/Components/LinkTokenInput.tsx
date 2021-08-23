import React from 'react';
import InputRedux, { INPUT_UI_STYLES } from '../../Input/InputRedux';
import { ErrorBadge, COLOR_TYPE } from '../../Input/ErrorBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field } from 'redux-form';

import classes from './LinkTokenInput.module.scss';

// todo: set props to component
// todo: set input errors
const LinkTokenInput = (props: any) => {
  const {
    fields,
    meta: { error },
  } = props;
  return fields.map((field: string, index: string) => {
    const removeField = () => fields.remove(index);
    return (
      <div className={classes.container} key={field}>
        <div className={classes.fieldContainer}>
          <div className={classes.codeInput}>
            <Field
              name={`${field}.chainCode`}
              type="text"
              component={InputRedux}
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
              component={InputRedux}
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
              component={InputRedux}
              placeholder="Enter or Paste Public Address"
              hideError={true}
              showCopyButton={true}
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
            />
          </div>
          <FontAwesomeIcon
            icon="times-circle"
            className={classes.closeIcon}
            onClick={removeField}
          />
        </div>
        {error && (
          <div className={classes.errorContainer}>
            <ErrorBadge
              error={error}
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

export default LinkTokenInput;
