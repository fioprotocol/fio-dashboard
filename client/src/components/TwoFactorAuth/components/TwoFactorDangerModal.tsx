import React from 'react';
import DangerModal from '../../Modal/DangerModal';

import classes from '../styles/TwoFactorDangerModal.module.scss';

type Props = {
  onClose: () => void;
  show: boolean;
  onActionClick: () => void;
};

const TwoFactorDangerModal: React.FC<Props> = props => {
  const { onClose, show, onActionClick } = props;
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
          You can also wait until <span className="boldText">00/00/0000</span> @{' '}
          <span className="boldText">00:00 PM</span> when this device will be
          granted access to sign in with your username and password.
        </div>
      }
    />
  );
};

export default TwoFactorDangerModal;
