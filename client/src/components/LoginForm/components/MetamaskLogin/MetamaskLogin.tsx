import React from 'react';

import SubmitButton from '../../../common/SubmitButton/SubmitButton';
import ModalComponent from '../../../Modal/Modal';

import { useContext } from './MetamaskLoginContext';

import MetamaskIcon from '../../../../assets/images/metamask.svg';

import classes from './MetamaskLogin.module.scss';

const MODAL_CONTENT_LIST = [
  'To get started ensure that you have MetaMask chrome extension installed.',
  'Sign-in with MetaMask.',
  'Accept the connection in MetaMask from FIO Wallet.',
  'Approve and install the FIO Wallet.',
  'Let FIO Wallet access the FIO Private key.',
  'Sign the request to verify you are the owner of the private key.',
];

export const MetamaskLogin: React.FC = () => {
  const {
    isModalOpen,
    connectMetamask,
    onDetailsClick,
    onModalClose,
  } = useContext();

  return (
    <>
      <SubmitButton
        text={
          <span className={classes.textContainer}>
            <img
              src={MetamaskIcon}
              alt="Metamask Logo"
              className={classes.icon}
            />
            Sign in with MetaMask
          </span>
        }
        onClick={connectMetamask}
        withTopMargin
        withBottomMargin
      />
      <p className={classes.description} onClick={onDetailsClick}>
        Want more info on sign in with MetaMask?
      </p>
      <ModalComponent
        show={isModalOpen}
        onClose={onModalClose}
        closeButton
        isSecondModal
      >
        <h5 className={classes.modalTitle}>Sign In with MetaMask</h5>
        <ol type="1" className={classes.modalList}>
          {MODAL_CONTENT_LIST.map(contentItem => (
            <li key={contentItem} className={classes.modalListItem}>
              {contentItem}
            </li>
          ))}
        </ol>
      </ModalComponent>
    </>
  );
};