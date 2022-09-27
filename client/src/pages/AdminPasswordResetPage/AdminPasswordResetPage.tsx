import React from 'react';

import AdminPasswordResetForm from './components/AdminPasswordResetForm/AdminPasswordResetForm';
import Loader from '../../components/Loader/Loader';

import { useContext } from './AdminPasswordResetPageContext';

const AdminPasswordResetPage: React.FC = () => {
  const {
    isProfileLoading,
    isTokenValidationLoading,
    initialValues,
    onSubmit,
    tokenValidationError,
  } = useContext();

  if (isTokenValidationLoading) {
    return <Loader />;
  }

  if (tokenValidationError) {
    return (
      <div>
        <p>Token is not valid!</p>
        <p>{tokenValidationError?.code}</p>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <AdminPasswordResetForm
        onSubmit={onSubmit}
        loading={isProfileLoading}
        initialValues={initialValues}
      />
    </div>
  );
};

export default AdminPasswordResetPage;
