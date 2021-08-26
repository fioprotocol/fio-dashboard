import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import classes from './SecurityItem.module.scss';
import ModalUIComponent from '../ModalUIComponent';

type Props = {
  attentionText?: string;
  buttonText: string;
  isPasswordPin?: boolean;
  modalChildren?: React.ReactNode; // todo: make required after created items
  modalTitle: string;
  modalSubtitle?: string;
  subtitle: string;
  title: string;
};

const SecurityItem: React.FC<Props> = props => {
  const {
    attentionText,
    buttonText,
    isPasswordPin,
    modalChildren,
    modalTitle,
    modalSubtitle,
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
        <ModalUIComponent
          onClose={onClose}
          showModal={showModal}
          subtitle={modalSubtitle}
          title={modalTitle}
        >
          {modalChildren}
        </ModalUIComponent>
      )}
    </>
  );
};

export default SecurityItem;
