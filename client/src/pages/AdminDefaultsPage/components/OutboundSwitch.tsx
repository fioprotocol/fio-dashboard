import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

import DangerModal from '../../../components/Modal/DangerModal';

import apis from '../../../api';
import { VarsResponse } from '../../../api/responses';
import useEffectOnce from '../../../hooks/general';

import { VARS_KEYS } from '../../../constants/vars';

import classes from '../styles/AdminDefaultsPage.module.scss';

const OutboundSwitch: React.FC = () => {
  const [isOutbound, setIsOutbound] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffectOnce(() => {
    apis.vars
      .getVar(VARS_KEYS.IS_OUTBOUND_EMAIL_STOP)
      .then((data: VarsResponse) => {
        setIsOutbound(data.value === 'false' ? false : true);
      });
  }, []);

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <h3>Outbound Emails</h3>
      </div>
      <p>WARNING! When set to ON, the Outbound emails will be stopped!</p>
      <Form.Check
        id="isOutbound"
        type="switch"
        className="mr-3"
        label="Outbound Emails"
        name="isOutbound"
        value={isOutbound ? 1 : 0}
        checked={isOutbound}
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
              VARS_KEYS.IS_OUTBOUND_EMAIL_STOP,
              isOutbound ? 'false' : 'true',
            )
            .then(() => {
              setIsOutbound(!isOutbound);
            });

          setShowModal(false);
        }}
        buttonText={`Yes, ${isOutbound ? 'start' : 'stop'} outbound emails`}
        title="Are You Sure?"
        showCancel={true}
        cancelButtonText="Cancel"
        subtitle={`You are ${
          isOutbound ? 'starting' : 'stopping'
        } outbound emails`}
      />
    </div>
  );
};

export default OutboundSwitch;
