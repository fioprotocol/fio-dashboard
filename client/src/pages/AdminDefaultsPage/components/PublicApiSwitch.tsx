import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

import DangerModal from '../../../components/Modal/DangerModal';

import apis from '../../../admin/api';
import { VarsResponse } from '../../../api/responses';
import useEffectOnce from '../../../hooks/general';

import { VARS_KEYS } from '../../../constants/vars';

import classes from '../styles/AdminDefaultsPage.module.scss';

export const PublicApiSwitch: React.FC = () => {
  const [isPublicApiAvailable, setIsPublicApiAvailable] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffectOnce(() => {
    apis.vars
      .getVar(VARS_KEYS.IS_PUBLIC_API_AVAILABLE)
      .then((data: VarsResponse) => {
        setIsPublicApiAvailable(data.value !== 'false');
      });
  }, []);

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <h3>Public Api</h3>
      </div>
      <p>WARNING! When set to ON, the FIO Public Api will be available!</p>
      <Form.Check
        id="isPublicApiAvailable"
        type="switch"
        className="mr-3"
        label="Available"
        name="isPublicApiAvailable"
        value={isPublicApiAvailable ? 1 : 0}
        checked={isPublicApiAvailable}
        onChange={() => {
          setShowModal(true);
        }}
      />

      <DangerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onActionButtonClick={() => {
          apis.vars
            .update(
              VARS_KEYS.IS_PUBLIC_API_AVAILABLE,
              isPublicApiAvailable ? 'false' : 'true',
            )
            .then(() => {
              setIsPublicApiAvailable(!isPublicApiAvailable);
            });

          setShowModal(false);
        }}
        buttonText="Yes, make public api available"
        title="Are You Sure?"
        showCancel={true}
        cancelButtonText="Cancel"
        subtitle={`You are switching ${
          isPublicApiAvailable ? 'off' : 'on'
        } public api availability`}
      />
    </div>
  );
};
