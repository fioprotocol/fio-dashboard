import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Modal from '../Modal';

import classes from './EmailModal.module.scss';

type Props = {
  children: React.ReactNode;
  show: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
};

const EmailModal: React.FC<Props> = props => {
  const { children, show, title, subtitle, onClose } = props;
  return (
    <Modal show={show} isInfo={true} closeButton={true} onClose={onClose}>
      <FontAwesomeIcon icon="envelope" className={classes.icon} />
      <h4 className={classes.title}>{title}</h4>
      <p className={classes.subtitle}>{subtitle}</p>
      {children}
    </Modal>
  );
};

export default EmailModal;
