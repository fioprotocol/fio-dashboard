import React from 'react';
import SecurityItem from '../SecurityItem/SecurityItem';

import { Field, InjectedFormProps } from 'redux-form';
import { Button } from 'react-bootstrap';
import InputRedux, { INPUT_UI_STYLES } from '../../../Input/InputRedux';
import { COLOR_TYPE } from '../../../Input/ErrorBadge';
import ModalUIComponent from '../ModalUIComponent';

const ITEM_PROPS = {
  title: 'Password',
  subtitle: 'The password is used to login and change sensetive settings.',
  buttonText: 'Change Password',
};

const ChangePassword: React.FC<any & InjectedFormProps> = props => {
  const handleSubmit = () => {
    // todo: set handlesubmit
  };

  const modalChildren = (
    <ModalUIComponent
      title="Change Password"
      subtitle="The password is used to login and change sensetive settings"
    >
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
        <Button type="submit">Save</Button>
      </form>
    </ModalUIComponent>
  );
  return (
    <SecurityItem
      {...ITEM_PROPS}
      isPasswordPin={true}
      modalChildren={modalChildren}
    />
  );
};

export default ChangePassword;
