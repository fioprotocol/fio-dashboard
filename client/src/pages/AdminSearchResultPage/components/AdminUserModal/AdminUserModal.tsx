import React from 'react';

import Modal from '../../../../components/Modal/Modal';
import { formatDateToLocale } from '../../../../helpers/stringFormatters';

import { AdminUserItemProfile } from '../../../../types';

type Props = {
  onClose: () => void;
  userItem: AdminUserItemProfile;
  isVisible: boolean;
};

const AdminUserModal: React.FC<Props> = ({ isVisible, onClose, userItem }) => {
  if (!userItem) return null;

  return (
    <Modal
      show={isVisible}
      closeButton={true}
      isSimple={true}
      isFullWidth={true}
      hasDefaultCloseColor={true}
      onClose={onClose}
    >
      <div>
        <div className="d-flex justify-content-between">
          <div className="mr-3">
            <b>Email</b>
          </div>
          <div>{userItem.email}</div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="mr-3">
            <b>Name:</b>
          </div>
          <div>{userItem.username}</div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="mr-3">
            <b>Created:</b>
          </div>
          <div>{formatDateToLocale(userItem.createdAt)}</div>
        </div>
        <div className="d-flex justify-content-between mb-4">
          <div className="mr-3">
            <b>Status:</b>
          </div>
          <div>{userItem.status}</div>
        </div>
      </div>
    </Modal>
  );
};

export default AdminUserModal;
