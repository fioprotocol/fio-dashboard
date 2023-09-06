import React from 'react';
import EmailIcon from '@mui/icons-material/Email';

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
      <EmailIcon className={classes.icon} />
      <h4 className={classes.title}>{title}</h4>
      <p className={classes.subtitle}>{subtitle}</p>
      {children}
    </Modal>
  );
};

export default EmailModal;
