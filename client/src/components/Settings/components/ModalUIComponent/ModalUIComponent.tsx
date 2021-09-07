import React from 'react';
import Modal from '../../../Modal/Modal';
import classes from './ModalUIComponent.module.scss';

type Props = {
  children: React.ReactNode;
  isWide?: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  hasOnBack?: boolean;
  onBack?: () => void;
  showModal: boolean;
};

const ModalUIComponent: React.FC<Props> = props => {
  const {
    children,
    isWide,
    title,
    subtitle,
    onClose,
    showModal,
    hasOnBack,
    onBack,
  } = props;
  return (
    <Modal
      show={showModal}
      onClose={onClose}
      closeButton={true}
      isSimple={true}
      isWide={isWide}
      hasDefaultColor={true}
    >
      <div className={classes.container}>
        <h4 className={classes.title}>{title}</h4>
        <p className={classes.subtitle}>{subtitle}</p>
        {children}
        {hasOnBack ? (
          <button className={classes.cancelButton} onClick={onBack}>
            Back
          </button>
        ) : (
          <button className={classes.cancelButton} onClick={onClose}>
            Cancel
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ModalUIComponent;
