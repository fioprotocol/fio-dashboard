import React from 'react';

import DangerModal from '../../Modal/DangerModal';

import classes from '../styles/TwoFactorDangerModal.module.scss';

type Props = {
  onClose: () => void;
  show: boolean;
  onActionClick: () => void;
  activationDate?: string | null;
};

const TwoFactorDangerModal: React.FC<Props> = props => {
  const { onClose, show, onActionClick, activationDate } = props;

  const activationDay = activationDate
    ? new Date(activationDate).toLocaleDateString([], {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric',
      })
    : '';
  const activationTime = activationDate
    ? new Date(activationDate).toLocaleString([], {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
    : '';
  return (
    <DangerModal
      onActionButtonClick={onActionClick}
      onClose={onClose}
      show={show}
      buttonText="Enter Backup Code"
      title="Cannot Sign In"
      subtitle={
        <>
          <span>
            This device cannot sign in because it does not have the right 2FA
            code.
          </span>
          <br />
          <br />
          <span className="boldText">
            Please approve this request from another logged in device or enter
            the Backup Code.
          </span>
        </>
      }
      footerContent={
        <div className={classes.footerContent}>
          You can also wait until{' '}
          <span className="boldText">{activationDay}</span> @{' '}
          <span className="boldText">{activationTime.toUpperCase()}</span> when
          this device will be granted access to sign in with your username and
          password.
        </div>
      }
    />
  );
};

export default TwoFactorDangerModal;
