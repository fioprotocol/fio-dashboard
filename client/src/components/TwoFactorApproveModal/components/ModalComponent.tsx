import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Modal from '../../Modal/Modal';

import { CLICK_TYPE } from '../TwoFactorApproveModal';

import { commonFormatTime } from '../../../util/general';

import { PendingVoucher } from '../types';

import classes from '../styles/ModalComponent.module.scss';

type Props = {
  show: boolean;
  onClose: () => void;
  loading: boolean;
  onClick: (type: { type: string; voucherId?: string }) => void;
  newDevicesList: PendingVoucher[];
};

const InfoItem = ({ title, value }: { title: string; value: string }) => (
  <div className={classes.infoElement}>
    <h5 className={classes.title}>{title}</h5>
    <p className={classes.value}>{value || 'N/A'}</p>
  </div>
);

const ModalComponent: React.FC<Props> = props => {
  const { show, onClose, newDevicesList, loading, onClick } = props;
  return (
    <Modal
      show={show}
      onClose={onClose}
      closeButton={true}
      isInfo={true}
      backdrop={false}
    >
      <div className={classes.approveContainer}>
        <FontAwesomeIcon icon="exclamation-triangle" className={classes.icon} />
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
        {newDevicesList.map(device => {
          const {
            deviceDescription,
            ipDescription,
            created,
            activates,
          } = device;
          return (
            <div key={device.created} className={classes.devicesContainer}>
              <div className={classes.infoContainer}>
                <InfoItem title="Device" value={deviceDescription} />
                <InfoItem title="Location" value={ipDescription} />
                <InfoItem
                  title="Request on"
                  value={commonFormatTime(created)}
                />

                <h5 className={classes.denied}>
                  Unless denied, access will be granted on
                </h5>
                <p className={classes.deniedValue}>
                  {commonFormatTime(activates)}
                </p>
                <button
                  className={classes.actionButton}
                  onClick={() =>
                    onClick({
                      voucherId: device.voucherId,
                      type: CLICK_TYPE.GRANT_ACCESS,
                    })
                  }
                  disabled={loading}
                >
                  It was Me, Grant Access{' '}
                </button>
              </div>
            </div>
          );
        })}
        <button
          className={classes.cancelButton}
          onClick={() => onClick({ type: CLICK_TYPE.DENY_ALL })}
        >
          Not Me, Deny All
        </button>
      </div>
    </Modal>
  );
};

export default ModalComponent;
