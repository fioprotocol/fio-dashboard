import React, { useState } from 'react';

import CommonBadge from '../../../Badges/CommonBadge/CommonBadge';
import Modal from '../../../Modal/Modal';

import { DOMAIN_TYPE_PARAMS } from '../../../../constants/fio';

import { DomainItemType } from '../../../../types';

import classes from './DomainTypeBadge.module.scss';
import SubmitButton from '../../../common/SubmitButton/SubmitButton';

type Props = {
  domainType: DomainItemType;
};

export const DomainTypeBadge: React.FC<Props> = props => {
  const { domainType } = props;

  const [isModalOpen, toggleModal] = useState(false);

  const openModal = () => toggleModal(true);
  const closeModal = () => toggleModal(false);

  return (
    <>
      <div className={classes.badgeContainer} onClick={openModal}>
        <CommonBadge
          isBlue={DOMAIN_TYPE_PARAMS[domainType].isBlue}
          isOrange={DOMAIN_TYPE_PARAMS[domainType].isOrange}
          isRed={DOMAIN_TYPE_PARAMS[domainType].isRed}
          isRose={DOMAIN_TYPE_PARAMS[domainType].isRose}
        >
          <div className={classes.text}>
            {DOMAIN_TYPE_PARAMS[domainType].title}
          </div>
        </CommonBadge>
      </div>
      <Modal show={isModalOpen} isSimple closeButton onClose={closeModal}>
        <div className={classes.modalContainer}>
          <h4 className={classes.modalTitle}>
            {DOMAIN_TYPE_PARAMS[domainType].modalTitle}
          </h4>
          <p className={classes.modalBodyText}>
            {DOMAIN_TYPE_PARAMS[domainType].modalBodyText}
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
