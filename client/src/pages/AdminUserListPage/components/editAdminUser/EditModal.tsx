import React, { useCallback } from 'react';

import { Button } from 'react-bootstrap';

import Modal from '../../../../components/Modal/Modal';
import { formatDateToLocale } from '../../../../helpers/stringFormatters';
import { AdminUser } from '../../../../types';

type Props = {
  show: boolean;
  loading: boolean;
  adminUser: AdminUser;
  isCurrentUser: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onResetPassword: (id: string) => void;
};

const EditModal: React.FC<Props> = props => {
  const {
    show,
    adminUser,
    isCurrentUser,
    onClose,
    onDelete,
    onResetPassword,
  } = props;

  const handleDelete = useCallback(() => {
    if (adminUser) {
      onDelete(adminUser.id);
      onClose();
    }
  }, [adminUser, onDelete, onClose]);

  const handleResetPassword = useCallback(() => {
    if (adminUser) {
      onResetPassword(adminUser.id);
      onClose();
    }
  }, [adminUser, onResetPassword, onClose]);

  if (!adminUser) {
    return null;
  }

  return (
    <Modal
      show={show}
      closeButton={true}
      isSimple={true}
      isWide={true}
      hasDefaultCloseColor={true}
      onClose={onClose}
    >
      <div className="d-flex flex-column w-100">
        <h3 className="text-left mb-3">Edit Admin User</h3>

        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <div className="mr-3">
              <b>Email</b>
            </div>
            <div>{adminUser.email}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="mr-3">
              <b>Last LogIn:</b>
            </div>
            <div>{formatDateToLocale(adminUser.lastLogIn)}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="mr-3">
              <b>Created:</b>
            </div>
            <div>{formatDateToLocale(adminUser.createdAt)}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="mr-3">
              <b>Role:</b>
            </div>
            <div>{adminUser.role.role}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="mr-3">
              <b>Status:</b>
            </div>
            <div>{adminUser.status.status}</div>
          </div>
        </div>

        {!isCurrentUser && (
          <div className="d-flex justify-content-between">
            <Button onClick={handleResetPassword}>Reset Password</Button>
            <Button onClick={handleDelete} variant="danger">
              Delete User
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EditModal;
