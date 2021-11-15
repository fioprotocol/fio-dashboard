import React, { useState } from 'react';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import ActionButton from '../ActionButton';
import ModalUIComponent from '../ModalUIComponent';
import ChangeEmailForm from './ChangeEmailForm';

import { User } from '../../../../types';
import { FormValuesProps } from './types';

import classes from '../../styles/ChangeEmail.module.scss';

type Props = {
  user: User;
  loading: boolean;
};

const ChangeEmail: React.FC<Props> = props => {
  const { user, loading } = props;
  const [showModal, toggleModal] = useState(false);

  const onCloseModal = () => toggleModal(false);
  const onActionButtonClick = () => toggleModal(true);

  const handleSubmit = (values: FormValuesProps) => {
    console.log(values);
  };

  return (
    <div>
      <div className={classes.badgeContainer}>
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div className={classes.user}>{user.email}</div>
        </Badge>
        <div className={classes.buttonContainer}>
          <ActionButton
            title="Update Email Address"
            onClick={onActionButtonClick}
          />
        </div>
        <ModalUIComponent
          onClose={onCloseModal}
          showModal={showModal}
          isWide={true}
          title="Update Email"
          subtitle="Your email address is used access your FIO dashboard and recover your account."
        >
          <ChangeEmailForm onSubmit={handleSubmit} loading={loading} />
        </ModalUIComponent>
      </div>
    </div>
  );
};

export default ChangeEmail;
