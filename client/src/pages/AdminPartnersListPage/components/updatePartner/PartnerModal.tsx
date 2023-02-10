import React from 'react';

import Modal from '../../../../components/Modal/Modal';
import { PartnerForm } from './PartnerForm';

import { AnyObject, FioAccountProfile, RefProfile } from '../../../../types';

type Props = {
  fioAccountsProfilesList: FioAccountProfile[];
  show: boolean;
  loading: boolean;
  onSubmit: (values: RefProfile) => Promise<AnyObject>;
  onClose: () => void;
  initialValues?: Partial<RefProfile>;
};

export const PartnerModal: React.FC<Props> = props => {
  const {
    fioAccountsProfilesList,
    show,
    loading,
    onSubmit,
    onClose,
    initialValues,
  } = props;

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
        <h3 className="text-left mb-3">
          {initialValues?.id ? 'Edit' : 'Add New'} Partner
        </h3>
        <PartnerForm
          onSubmit={onSubmit}
          loading={loading}
          initialValues={initialValues}
          fioAccountsProfilesList={fioAccountsProfilesList}
        />
      </div>
    </Modal>
  );
};
