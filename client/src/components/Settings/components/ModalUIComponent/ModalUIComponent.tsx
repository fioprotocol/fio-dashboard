import React from 'react';
import Modal from '../../../Modal/Modal';
import classes from './ModalUIComponent.module.scss';

type Props = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onClose: () => void;
  showModal: boolean;
};

const ModalUIComponent: React.FC<Props> = props => {
  const { children, title, subtitle, onClose, showModal } = props;
  return (
    <Modal
      show={showModal}
      onClose={onClose}
      closeButton={true}
      isSimple={true}
      isWide={true}
      hasDefaultColor={true}
    >
      <div className={classes.container}>
        <h4 className={classes.title}>{title}</h4>
        <p className={classes.subtitle}>{subtitle}</p>
        {children}
        <button className={classes.cancelButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ModalUIComponent;
