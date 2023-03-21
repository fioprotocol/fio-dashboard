import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { FormApi } from 'final-form';

import classes from '../styles/AdminDefaultsPage.module.scss';

import { AdminDefaultsRequest } from '../../../api/responses';
import apis from '../../../api';
import { VARS_KEYS } from '../../../constants/vars';
import useEffectOnce from '../../../hooks/general';

interface OutboundSwitchProps {
  form: FormApi<AdminDefaultsRequest>;
}

const OutboundSwitch: React.FC<OutboundSwitchProps> = ({ form }) => {
  const [isOutbound, setIsOutbound] = useState(false);

  useEffectOnce(() => {
    apis.vars.getVar(VARS_KEYS.IS_OUTBOUND_EMAIL_STOP).then((data: any) => {
      setIsOutbound(data.value == 'false' ? false : true);
    });
  }, []);

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <h3>Outbound</h3>
      </div>
      <p>WARNING! When set to OFF, the Outbound emails will be stopped!</p>
      <Form.Check
        id="isOutbound"
        type="switch"
        className="mr-3"
        label="Outbound"
        name="isOutbound"
        value={isOutbound ? 1 : 0}
        checked={isOutbound}
        onChange={() => {
          apis.vars
            .update(
              VARS_KEYS.IS_OUTBOUND_EMAIL_STOP,
              isOutbound ? 'false' : 'true',
            )
            .then(() => {
              setIsOutbound(!isOutbound);
            });
        }}
      />
    </div>
  );
};

export default OutboundSwitch;
