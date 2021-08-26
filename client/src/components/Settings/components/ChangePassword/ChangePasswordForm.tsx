import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { compose } from '../../../../utils';

import InputRedux, { INPUT_UI_STYLES } from '../../../Input/InputRedux';
import { COLOR_TYPE } from '../../../Input/ErrorBadge';
import validate from './validation';

const formConnect = reduxForm({
  form: 'changePassword',
  getFormState: state => state.reduxForm,
  validate,
});

type Props = {
  loading: boolean;
};

const ChangePasswordForm = (props: Props & InjectedFormProps) => {
  const { handleSubmit, loading, valid } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field
        type="password"
        name="currentPassword"
        component={InputRedux}
        showClearInput={true}
        placeholder="Enter Current Password"
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorUIColor={COLOR_TYPE.WARN}
      />
      <Field
        type="password"
        name="newPassword"
        component={InputRedux}
        showClearInput={true}
        placeholder="Enter New Password"
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorUIColor={COLOR_TYPE.WARN}
      />
      <Field
        type="password"
        name="confirmNewPassword"
        component={InputRedux}
        showClearInput={true}
        placeholder="Re-enter New Password"
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorUIColor={COLOR_TYPE.WARN}
      />
      <Button type="submit" disabled={loading || !valid}>
        {loading ? (
          <>
            <span>Saving</span> <FontAwesomeIcon icon="spinner" spin />
          </>
        ) : (
          'Save'
        )}
      </Button>
    </form>
  );
};

export default compose(formConnect)(ChangePasswordForm);
