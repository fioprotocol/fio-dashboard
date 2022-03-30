import React from 'react';

import FioRequestStatusBadge from '../../../components/Badges/FioRequestStatusBadge/FioRequestStatusBadge';
import Modal from '../../../components/Modal/Modal';

import classes from '../styles/FioRecordDetailedModal.module.scss';

type Props = {
  status?: string;
  show: boolean;
  onClose: () => void;
};

const FioRecordDetailedModal: React.FC<Props> = props => {
  const { children, show, onClose, status } = props;

  return (
    <Modal
      show={show}
      onClose={onClose}
      closeButton={true}
      isSimple={true}
      hasDefaultCloseColor={true}
      isMiddleWidth={true}
    >
      <div className={classes.container}>
        <div className={classes.statusBadge}>
          <FioRequestStatusBadge status={status} />
        </div>
        <h2 className={classes.title}>FIO Request Details </h2>
        {children}
      </div>
    </Modal>
  );
};

export default FioRecordDetailedModal;
