import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import Modal from '../../../Modal/Modal';
import classes from './SecurityItem.module.scss';

type Props = {
  attentionText?: string;
  buttonText: string;
  isPasswordPin?: boolean;
  modalChildren?: React.ReactNode; // todo: make required after created items
  subtitle: string;
  title: string;
};

const SecurityItem: React.FC<Props> = props => {
  const {
    attentionText,
    buttonText,
    isPasswordPin,
    modalChildren,
    title,
    subtitle,
  } = props;
  const [showModal, toggleShowModal] = useState(false);

  const onClick = () => toggleShowModal(true);
  const onClose = () => toggleShowModal(false);

  return (
    <>
      <div className={classes.container}>
        <h5 className={classes.title}>{title}</h5>
        <p className={classes.subtitle}>{subtitle}</p>
        <p className={classes.attentionText}>{attentionText}</p>
        <Button
          className={classnames(
            classes.button,
            isPasswordPin && classes.passwordPin,
          )}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </div>
      {modalChildren && (
        <Modal
          show={showModal}
          onClose={onClose}
          closeButton={true}
          isSimple={true}
        >
          {modalChildren}
        </Modal>
      )}
    </>
  );
};

export default SecurityItem;
