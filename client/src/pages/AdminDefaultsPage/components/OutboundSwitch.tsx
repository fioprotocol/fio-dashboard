import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { FormApi } from 'final-form';

import classes from '../styles/AdminDefaultsPage.module.scss';

import { AdminDefaultsRequest } from '../../../api/responses';
import apis from '../../../api';
import { VARS_KEYS } from '../../../constants/vars';
import useEffectOnce from '../../../hooks/general';
import DangerModal from '../../../components/Modal/DangerModal';

interface OutboundSwitchProps {
  form: FormApi<AdminDefaultsRequest>;
}

const OutboundSwitch: React.FC<OutboundSwitchProps> = ({ form }) => {
  const [isOutbound, setIsOutbound] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffectOnce(() => {
    apis.vars.getVar(VARS_KEYS.IS_OUTBOUND_EMAIL_STOP).then((data: any) => {
      setIsOutbound(data.value == 'false' ? false : true);
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
        title="Are you Sure?"
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
