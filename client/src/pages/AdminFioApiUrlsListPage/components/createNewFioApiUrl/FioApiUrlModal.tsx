import React from 'react';

import Modal from '../../../../components/Modal/Modal';
import ApiUrlForm from './ApiUrlForm';

import { FormValuesProps } from '../../types';
import { FioApiUrl } from '../../../../types';

type Props = {
  show: boolean;
  loading: boolean;
  onSubmit: (values: FormValuesProps) => void;
  onClose: () => void;
  initialValues?: Partial<FioApiUrl>;
};

const FioApiUrlModal: React.FC<Props> = props => {
  const { show, loading, onSubmit, onClose, initialValues } = props;
  return (
    <Modal
      show={show}
      closeButton
      isSimple
      isWide
      hasDefaultCloseColor
      onClose={onClose}
      enableOverflow
    >
      <div className="d-flex flex-column w-100">
        <h3 className="text-left mb-3">
          {initialValues && initialValues.id ? 'Edit' : 'Create'} FIO Api Url
        </h3>
        <ApiUrlForm
          onSubmit={onSubmit}
          loading={loading}
          initialValues={initialValues}
        />
      </div>
    </Modal>
  );
};

export default FioApiUrlModal;
