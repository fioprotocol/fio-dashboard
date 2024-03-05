import React from 'react';
import classnames from 'classnames';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import SuccessModal from '../../../../components/Modal/SuccessModal';

import ActionButton from '../ActionButton';

import {
  EMAIL_NOTIFICATION_PARAMS,
  useContext,
} from './EmailNotificationContext';

import { EmailNotificationParamsNamesType } from '../../../../types';

import classes from './EmailNotifications.module.scss';

type CheckedIconProps = {
  isChecked: boolean;
  onClick: () => void;
};

const SUCCESS_MODAL_CONTENT = {
  successModalTitle: 'EMAIL NOTIFICATIONS TYPES CHANGED!',
  successModalSubtitle:
    'Your email notification types has been successfully changed',
};

const CheckedIcon: React.FC<CheckedIconProps> = props => {
  const { isChecked, onClick } = props;

  return isChecked ? (
    <CheckBoxIcon className={classes.checkIcon} onClick={onClick} />
  ) : (
    <CheckBoxOutlineBlankIcon className={classes.checkIcon} onClick={onClick} />
  );
};

export const EmailNotifications: React.FC = () => {
  const {
    disableConfigs,
    emailNotificationParams,
    hasError,
    loading,
    showSuccessModal,
    onSuccessClose,
    toggleCheckClick,
    updateEmailNotification,
  } = useContext();

  return (
    <>
      <p
        className={classnames(classes.text, disableConfigs && classes.disabled)}
      >
        Choose which email notification types that you would like to receive
      </p>
      <div className={classes.checkContainer}>
        {Object.entries(emailNotificationParams).map(
          ([
            emailNotificationParamItemKey,
            emailNotificationParamItemValue,
          ]) => {
            const onClick = () =>
              disableConfigs
                ? null
                : toggleCheckClick(
                    emailNotificationParamItemKey as EmailNotificationParamsNamesType,
                  );

            return (
              <div
                className={classnames(
                  classes.itemContainer,
                  disableConfigs && classes.disabled,
                )}
                key={emailNotificationParamItemKey}
              >
                <CheckedIcon
                  isChecked={emailNotificationParamItemValue as boolean}
                  onClick={onClick}
                />
                <p className={classes.title}>
                  {
                    EMAIL_NOTIFICATION_PARAMS[emailNotificationParamItemKey]
                      .title
                  }
                </p>
              </div>
            );
          },
        )}
      </div>
      <div className={classes.actionButton}>
        <ActionButton
          title={
            loading
              ? 'Updating ...'
              : hasError
              ? 'Try Again'
              : 'Update Email Notifications'
          }
          onClick={updateEmailNotification}
          disabled={disableConfigs}
        />
      </div>
      <SuccessModal
        title={SUCCESS_MODAL_CONTENT.successModalTitle}
        subtitle={SUCCESS_MODAL_CONTENT.successModalSubtitle}
        onClose={onSuccessClose}
        showModal={showSuccessModal}
      />
    </>
  );
};
