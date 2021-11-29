import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Modal from '../../Modal/Modal';

import classes from '../styles/TwoFactorApproveModal.module.scss';

type Props = {
  show: boolean;
  onClose: () => void;
};

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

const TwoFactorApproveModal: React.FC<Props> = props => {
  const { show, onClose } = props;
  return (
    <Modal show={show} onClose={onClose} closeButton={true} isInfo={true}>
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
        <div className={classes.infoContainer}>
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
        </div>
        <button className={classes.cancelButton}>Not Me, Deny All</button>
      </div>
    </Modal>
  );
};

export default TwoFactorApproveModal;
