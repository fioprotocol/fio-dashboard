import React, { useCallback, useState } from 'react';
import { Form } from 'react-bootstrap';

import DangerModal from '../../../components/Modal/DangerModal';

import apis from '../../../admin/api';
import useEffectOnce from '../../../hooks/general';
import { capitalizeFirstLetter } from '../../../utils';

import { VARS_KEYS } from '../../../constants/vars';

import classes from '../styles/AdminDefaultsPage.module.scss';

export const FormsOfPayment: React.FC = () => {
  const [formsOfPayment, setFormsOfPayment] = useState<{
    [key: string]: boolean;
  }>({});
  const [showModal, setShowModal] = useState<{
    [key: string]: boolean;
  }>({});

  const getFormOfPaymentsVars = useCallback(async () => {
    const formOfPaymentVars = await apis.vars.getVar(
      VARS_KEYS.FORMS_OF_PAYMENT,
    );

    const parsedFormOfPayments = JSON.parse(formOfPaymentVars.value);

    setFormsOfPayment(parsedFormOfPayments);

    const showModalValues: { [key: string]: boolean } = {};

    for (const key in parsedFormOfPayments) {
      showModalValues[key] = false;
    }

    setShowModal(showModalValues);
  }, []);

  const updateFormOfPayments = useCallback(
    async (keyToUpdate: string) => {
      const updatedValues = {
        ...formsOfPayment,
        [keyToUpdate]: !formsOfPayment[keyToUpdate],
      };

      await apis.vars.update(
        VARS_KEYS.FORMS_OF_PAYMENT,
        JSON.stringify(updatedValues),
      );

      setFormsOfPayment(updatedValues);
      setShowModal({ ...showModal, [keyToUpdate]: false });
    },
    [formsOfPayment, showModal],
  );

  const transformString = (input: string) => {
    let result = capitalizeFirstLetter(input);

    result = result.replace(/([a-z])([A-Z])/g, '$1 $2');

    return result;
  };

  useEffectOnce(() => {
    getFormOfPaymentsVars();
  }, []);

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <h3>Forms of Payment</h3>
      </div>
      <p>WARNING! When set to OFF, the form of payment will be disabled!</p>
      {Object.entries(formsOfPayment).map(([key, value]) => {
        return (
          <div key={key} className={classes.checkContainer}>
            <p>{transformString(key)}</p>
            <div className={classes.checkItem}>
              <p>OFF</p>
              <Form.Check
                id={key}
                type="switch"
                name={key}
                value={value ? 1 : 0}
                checked={value}
                onChange={() => {
                  setShowModal({ ...showModal, [key]: true });
                }}
              />
              <p>ON</p>
            </div>
            <DangerModal
              show={showModal[key]}
              onClose={() => setShowModal({ ...showModal, [key]: false })}
              onActionButtonClick={() => {
                updateFormOfPayments(key);
              }}
              buttonText={`Yes, turn ${value ? 'OFF' : 'ON'} ${transformString(
                key,
              )}`}
              title="Are You Sure?"
              showCancel={true}
              cancelButtonText="Cancel"
              subtitle={`You are turning ${
                value ? 'OFF' : 'ON'
              } ${transformString(key)} form of payment`}
            />
          </div>
        );
      }, [])}
    </div>
  );
};
