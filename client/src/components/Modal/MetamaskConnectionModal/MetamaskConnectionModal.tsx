import React from 'react';
import { FadeLoader } from 'react-spinners';

import ModalComponent from '../Modal';
import NotificationBadge from '../../NotificationBadge';
import { BADGE_TYPES } from '../../Badge/Badge';
import SubmitButton from '../../common/SubmitButton/SubmitButton';

import MetamaskIcon from '../../../assets/images/metamask.svg';

import classes from './MetamaskConnectionModal.module.scss';

type Props = {
  errorObj?: {
    message: string;
    title?: string;
    buttonText?: string;
  };
  hasCloseButton?: boolean;
  hasError?: boolean;
  isSecondModal?: boolean;
  loaderText?: string;
  show: boolean;
  title?: string;
  text?: string;
  onClose?: () => void;
};

const DEFAULT_TRANSACTION_ERROR = 'Transaction failed. Please try again.';

export const MetamaskConnectionModal: React.FC<Props> = props => {
  const {
    errorObj,
    hasCloseButton,
    hasError,
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
      {hasError ? (
        <div>
          <p className={classes.text}>{text}</p>
          <NotificationBadge
            show
            title={errorObj?.title}
            message={errorObj?.message || DEFAULT_TRANSACTION_ERROR}
            type={BADGE_TYPES.RED}
            hasNewDesign
            messageClassnames={classes.errorMessage}
          />
          <SubmitButton
            text={errorObj?.buttonText || 'Try Again'}
            onClick={onClose}
            withTopMargin
            withBottomMargin
          />
        </div>
      ) : (
        <>
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
        </>
      )}
    </ModalComponent>
  );
};
