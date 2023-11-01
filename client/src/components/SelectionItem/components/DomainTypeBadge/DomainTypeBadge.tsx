import React, { useState } from 'react';

import classnames from 'classnames';

import CommonBadge from '../../../Badges/CommonBadge/CommonBadge';
import Modal from '../../../Modal/Modal';
import SubmitButton from '../../../common/SubmitButton/SubmitButton';

import { DOMAIN_TYPE, DOMAIN_TYPE_PARAMS } from '../../../../constants/fio';

import { DomainItemType } from '../../../../types';

import classes from './DomainTypeBadge.module.scss';

type Props = {
  disabled?: boolean;
  domainType: DomainItemType;
  isFree?: boolean;
};

export const DomainTypeBadge: React.FC<Props> = props => {
  const { disabled, domainType, isFree } = props;

  const [isModalOpen, toggleModal] = useState(false);

  const openModal = () => disabled && toggleModal(true);
  const closeModal = () => toggleModal(false);

  const domainTypeToShow =
    domainType === DOMAIN_TYPE.ALLOW_FREE && !isFree
      ? DOMAIN_TYPE.PREMIUM
      : domainType;

  return (
    <>
      <div
        className={classnames(
          classes.badgeContainer,
          disabled && classes.disabled,
        )}
        onClick={openModal}
      >
        <CommonBadge
          isBlue={DOMAIN_TYPE_PARAMS[domainTypeToShow].isBlue}
          isOrange={DOMAIN_TYPE_PARAMS[domainTypeToShow].isOrange}
          isRed={DOMAIN_TYPE_PARAMS[domainTypeToShow].isRed}
          isRose={DOMAIN_TYPE_PARAMS[domainTypeToShow].isRose}
        >
          <div className={classes.text}>
            {DOMAIN_TYPE_PARAMS[domainTypeToShow].title}
          </div>
        </CommonBadge>
      </div>
      <Modal show={isModalOpen} isSimple closeButton onClose={closeModal}>
        <div className={classes.modalContainer}>
          <h4 className={classes.modalTitle}>
            {DOMAIN_TYPE_PARAMS[domainTypeToShow].modalTitle}
          </h4>
          <p className={classes.modalBodyText}>
            {DOMAIN_TYPE_PARAMS[domainTypeToShow].modalBodyText}
          </p>
          <SubmitButton
            text="Close"
            hasAutoWidth
            onClick={closeModal}
            withBottomMargin
          />
        </div>
      </Modal>
    </>
  );
};
