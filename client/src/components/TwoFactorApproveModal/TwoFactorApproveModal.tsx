import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Modal from '../Modal/Modal';
import EdgeConfirmAction from '../EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import { User } from '../../types';
import { SubmitActionParams } from '../EdgeConfirmAction/types';

import classes from './TwoFactorApproveModal.module.scss';

const INFO_ELEMENTS = [
  {
    title: 'Device',
    value: '<Device>',
  },
  {
    title: 'Location',
    value: '<Location>',
  },
  {
    title: 'Request on',
    value: '00/00/0000 @ 00:00 PM',
  },
];

type Props = {
  user: User;
};

const TwoFactorAuth: React.FC<Props> = props => {
  const { user } = props;
  const [showApprove, toggleApproveModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<boolean | null>(null);

  const onCloseApproveModal = () => toggleApproveModal(false);

  const submit = async ({ edgeAccount }: SubmitActionParams) => {
    // toggleDisableModal(true);
    // disableTwoFactor(edgeAccount);
  };

  const onSuccess = () => {
    setProcessing(false);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const { newDeviceTwoFactor } = user || {};

  useEffect(() => {
    if (newDeviceTwoFactor) {
      toggleApproveModal(true);
    }

    if (!user) {
      toggleApproveModal(false);
    }
  }, [newDeviceTwoFactor]);

  return (
    <>
      <EdgeConfirmAction
        onSuccess={onSuccess}
        onCancel={onCancel}
        submitAction={submit}
        data={submitData}
        action={CONFIRM_PIN_ACTIONS.TWO_FACTOR_REQUEST}
        processing={processing}
        setProcessing={setProcessing}
        hideProcessing={true}
      />
      <Modal
        show={showApprove && !submitData}
        onClose={onCloseApproveModal}
        closeButton={true}
        isInfo={true}
        backdrop={true}
      >
        <div className={classes.approveContainer}>
          <FontAwesomeIcon
            icon="exclamation-triangle"
            className={classes.icon}
          />
          <h4 className={classes.title}>New Device Sign In</h4>
          <p className={classes.subtitle}>
            A new device would like to sign in to you account.
          </p>
          <p className={classes.message}>
            If you did not make this request, your password may have been stole
            and you risk losing your funds.
          </p>
          <p className={classes.message}>
            Please deny the request and change your password.
          </p>
          <div className={classes.infoContainer}>
            {submitData ? (
              <>
                {INFO_ELEMENTS.map(infoElement => (
                  <div className={classes.infoElement} key={infoElement.title}>
                    <h5 className={classes.title}>{infoElement.title}</h5>
                    <p className={classes.value}>{infoElement.value}</p>
                  </div>
                ))}
                <h5 className={classes.denied}>
                  Unless denied, access will be granted on
                </h5>
                <p className={classes.deniedValue}>00/00/0000 @ 00:00 PM</p>
                <button className={classes.actionButton}>
                  It was Me, Grant Access
                </button>
              </>
            ) : (
              <>
                <div className={classes.infoElement}>
                  Please Enter PIN to see details
                </div>
                <button
                  className={classes.actionButton}
                  onClick={() => setSubmitData(true)}
                >
                  Enter PIN
                </button>
              </>
            )}
          </div>
          <button className={classes.cancelButton}>Not Me, Deny All</button>
        </div>
      </Modal>
    </>
  );
};

export default TwoFactorAuth;
