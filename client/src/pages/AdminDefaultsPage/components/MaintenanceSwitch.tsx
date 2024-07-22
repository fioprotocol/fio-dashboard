import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

import DangerModal from '../../../components/Modal/DangerModal';

import apis from '../../../admin/api';
import { VarsResponse } from '../../../api/responses';
import useEffectOnce from '../../../hooks/general';

import { VARS_KEYS } from '../../../constants/vars';

import classes from '../styles/AdminDefaultsPage.module.scss';

const MaintenanceSwitch: React.FC = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffectOnce(() => {
    apis.vars.getVar(VARS_KEYS.IS_MAINTENANCE).then((data: VarsResponse) => {
      setIsMaintenance(data.value === 'false' ? false : true);
    });
  }, []);

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <h3>Maintenance</h3>
      </div>
      <p>WARNING! When set to ON, the FIO App will be disabled!</p>
      <Form.Check
        id="isMaintenance"
        type="switch"
        className="mr-3"
        label="Maintenance"
        name="isMaintenance"
        value={isMaintenance ? 1 : 0}
        checked={isMaintenance}
        onChange={() => {
          setShowModal(true);
        }}
      />

      <DangerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onActionButtonClick={() => {
          apis.vars
            .update(VARS_KEYS.IS_MAINTENANCE, isMaintenance ? 'false' : 'true')
            .then(() => {
              setIsMaintenance(!isMaintenance);
            });

          setShowModal(false);
        }}
        buttonText="Yes, switch maintenance mode"
        title="Are You Sure?"
        showCancel={true}
        cancelButtonText="Cancel"
        subtitle={`You are switching ${
          isMaintenance ? 'off' : 'on'
        } maintenance mode`}
      />
    </div>
  );
};

export default MaintenanceSwitch;
