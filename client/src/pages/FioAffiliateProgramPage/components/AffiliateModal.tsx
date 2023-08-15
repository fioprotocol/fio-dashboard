import React from 'react';
import { Button } from 'react-bootstrap';
import { Field, Form, FormRenderProps } from 'react-final-form';

import Modal from '../../../components/Modal/Modal';
import Dropdown from '../../../components/Input/Dropdown';

import { COLOR_TYPE } from '../../../components/Input/ErrorBadge';
import { INPUT_UI_STYLES } from '../../../components/Input/TextInput';

import { formValidation } from './validation';

import { FioAddressDoublet, User } from '../../../types';
import { FormValuesProps } from '../types';

import classes from '../styles/AffiliateModal.module.scss';

type Props = {
  showModal: boolean;
  onCloseModal: () => void;
  fioAddresses: FioAddressDoublet[];
  onAffiliateUpdate: (values: FormValuesProps) => void;
  user: User;
};

export const AffiliateModal: React.FC<Props> = props => {
  const {
    showModal,
    onCloseModal,
    fioAddresses,
    onAffiliateUpdate,
    user,
  } = props;

  return (
    <Modal
      show={showModal}
      onClose={onCloseModal}
      closeButton
      isSimple
      isMiddleWidth
      hasDefaultCloseColor
    >
      <div className={classes.container}>
        <h4 className={classes.title}>Select FIO Handle!</h4>
        <p className={classes.subtitle}>
          Please select a FIO Handle for receipt of domain affiliate program
          earnings.
        </p>

        <Form
          initialValues={{
            fch: user?.affiliateProfile?.tpid,
          }}
          onSubmit={onAffiliateUpdate}
          validate={formValidation.validateForm}
        >
          {({ handleSubmit }: FormRenderProps) => (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <form onSubmit={handleSubmit}>
              <Field
                name="fch"
                component={Dropdown}
                errorColor={COLOR_TYPE.WARN}
                placeholder="Select FIO Handle"
                options={fioAddresses.map(({ name }) => ({
                  id: name,
                  name,
                }))}
                uiType={INPUT_UI_STYLES.BLACK_WHITE}
                isSimple
                isHigh
                isWhite
              />
              <Button className={classes.button} type="submit">
                Update
              </Button>
            </form>
          )}
        </Form>
      </div>
    </Modal>
  );
};
