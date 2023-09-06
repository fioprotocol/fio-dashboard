import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import Dropdown from '../../../components/Input/Dropdown';

import { COLOR_TYPE } from '../../../components/Input/ErrorBadge';
import { INPUT_UI_STYLES } from '../../../components/Input/TextInput';
import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';

import { formValidation } from './validation';

import { FioAddressDoublet } from '../../../types';
import { FormValuesProps } from '../types';

import classes from '../styles/AffiliateModal.module.scss';

type Props = {
  fioAddresses: FioAddressDoublet[];
  onAffiliateActivate: (values: FormValuesProps) => void;
};

export const AffiliateSelectFCHModal: React.FC<Props> = props => {
  const { fioAddresses, onAffiliateActivate } = props;

  return (
    <div className={classes.container}>
      <h4 className={classes.title}>Getting Started is Easy!</h4>
      <p className={classes.subtitle}>
        Select a FIO Handle to receive your referral fee earnings.
      </p>

      <Form
        onSubmit={onAffiliateActivate}
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
            <SubmitButton className={classes.button} text="ACTIVATE" />
          </form>
        )}
      </Form>
    </div>
  );
};
