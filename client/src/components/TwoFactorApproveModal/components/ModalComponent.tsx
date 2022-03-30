import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Modal from '../../Modal/Modal';
import SubmitButton from '../../common/SubmitButton/SubmitButton';

import { ACTION_TYPE } from '../constants';

import { commonFormatTime } from '../../../util/general';

import { PendingVoucher } from '../types';

import classes from '../styles/ModalComponent.module.scss';

type Props = {
  show: boolean;
  loading: { [key: string]: boolean };
  onClick: (type: { type: string; voucherId?: string }) => void;
  newDevicesList: PendingVoucher[];
};

const InfoItem = ({ title, value }: { title: string; value?: string }) => (
  <div className={classes.infoElement}>
    <h5 className={classes.title}>{title}</h5>
    <p className={classes.value}>{value || 'N/A'}</p>
  </div>
);

const ModalComponent: React.FC<Props> = props => {
  const { show, newDevicesList, loading, onClick } = props;
  const isLoading = Object.values(loading).some(loadItem => !!loadItem);

  return (
    <Modal
      show={show}
      onClose={() => {
        onClick({ type: ACTION_TYPE.DENY_ALL });
      }}
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
            voucherId,
          } = device;
          const currentLoading = loading[voucherId];

          return (
            <div
              key={device.created.getTime()}
              className={classes.devicesContainer}
            >
              <div className={classes.infoContainer}>
                <InfoItem title="Device" value={deviceDescription} />
                <InfoItem title="Location" value={ipDescription} />
                <InfoItem
                  title="Request on"
                  value={commonFormatTime(new Date(created).toJSON())}
                />

                <h5 className={classes.denied}>
                  Unless denied, access will be granted on
                </h5>
                <p className={classes.deniedValue}>
                  {commonFormatTime(new Date(activates).toJSON())}
                </p>
                <div className={classes.actionButton}>
                  <SubmitButton
                    text="It was Me, Grant Access"
                    loading={currentLoading}
                    disabled={isLoading}
                    onClick={() =>
                      onClick({
                        voucherId,
                        type: ACTION_TYPE.GRANT_ACCESS,
                      })
                    }
                    isGreenTeal={true}
                    hasLowHeight={true}
                    hasBoldText={true}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div className={classes.cancelButton}>
          <SubmitButton
            text="Not Me, Deny All"
            disabled={isLoading}
            onClick={() => onClick({ type: ACTION_TYPE.DENY_ALL })}
            isBlack={true}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponent;
