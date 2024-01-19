import React from 'react';
import { FadeLoader } from 'react-spinners';

import ModalComponent from '../Modal';

import MetamaskIcon from '../../../assets/images/metamask.svg';

import classes from './MetamaskConnectionModal.module.scss';

type Props = {
  hasCloseButton?: boolean;
  isSecondModal?: boolean;
  loaderText?: string;
  show: boolean;
  title?: string;
  text?: string;
  onClose?: () => void;
};

export const MetamaskConnectionModal: React.FC<Props> = props => {
  const {
    hasCloseButton,
    isSecondModal,
    loaderText = 'Connecting...',
    show,
    title = 'Sign Transaction',
    text = 'Please complete the actions in the MetaMask window.',
    onClose,
  } = props;
  return (
    <ModalComponent
      show={show}
      onClose={onClose}
      closeButton={hasCloseButton}
      isSecondModal={isSecondModal}
    >
      <img alt="MetaMask logo" src={MetamaskIcon} className={classes.icon} />
      <h5 className={classes.title}>{title}</h5>
      <div className={classes.loader}>
        <FadeLoader
          height="8px"
          width="5px"
          radius="3px"
          margin="1px"
          color="rgb(118, 92, 214)"
        />
        <p className={classes.loderText}>{loaderText}</p>
      </div>
      <p className={classes.text}>{text}</p>
    </ModalComponent>
  );
};
