import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

import { FormApi } from 'final-form';

import classes from '../styles/AdminDefaultsPage.module.scss';

import { AdminDefaultsRequest } from '../../../api/responses';
import apis from '../../../api';
import useEffectOnce from '../../../hooks/general';
import { VARS_KEYS } from '../../../constants/vars';

interface MaintenanceSwitchProps {
  form: FormApi<AdminDefaultsRequest>;
}

const MaintenanceSwitch: React.FC<MaintenanceSwitchProps> = ({ form }) => {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffectOnce(() => {
    apis.vars.getVar(VARS_KEYS.IS_MAINTENANCE).then((data: any) => {
      setIsMaintenance(data.value == 'false' ? false : true);
    });
  }, []);

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <h3>Maintenance</h3>
      </div>
      <p>WARNING! When set to ON, the Dashboard will be disabled!</p>
      <Form.Check
        id="isMaintenance"
        type="switch"
        className="mr-3"
        label="Maintenance"
        name="isMaintenance"
        value={isMaintenance ? 1 : 0}
        checked={isMaintenance}
        onChange={() => {
          apis.vars
            .update(VARS_KEYS.IS_MAINTENANCE, isMaintenance ? 'false' : 'true')
            .then(() => {
              setIsMaintenance(!isMaintenance);
            });
        }}
      />
    </div>
  );
};

export default MaintenanceSwitch;
