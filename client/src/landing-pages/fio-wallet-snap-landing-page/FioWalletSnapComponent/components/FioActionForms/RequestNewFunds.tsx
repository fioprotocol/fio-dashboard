import React from 'react';

import { Form, Field } from 'react-final-form';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../../components/Input/TextInput';
import { COLOR_TYPE } from '../../../../../components/Input/ErrorBadge';
import SubmitButton from '../../../../../components/common/SubmitButton/SubmitButton';

type ErrorsProps = {
  amount?: string;
  payeeFioHandle?: string;
  payerFioHandle?: string;
};

const validateForm = ({
  amount,
  payeeFioHandle,
  payerFioHandle,
}: {
  amount: string;
  payeeFioHandle: string;
  payerFioHandle: string;
}): ErrorsProps => {
  const errors: ErrorsProps = {};

  if (!amount) {
    errors.amount = 'Required';
  }

  if (!payeeFioHandle) {
    errors.payeeFioHandle = 'Required';
  }

  if (!payerFioHandle) {
    errors.payerFioHandle = 'Required';
  }

  return errors;
};

type Props = {
  onSubmit: (values: any) => void;
};

export const RequestNewFunds: React.FC<Props> = props => {
  const { onSubmit } = props;
  return (
    <div>
      <Form
        onSubmit={onSubmit}
        validate={validateForm}
        render={formProps => {
          return (
            <form onSubmit={formProps.handleSubmit}>
              <Field
                name="payeeFioHandle"
                type="text"
                component={TextInput}
                placeholder="Type payee FIO Handle"
                label="Payee FIO Handle"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />
              <Field
                name="payerFioHandle"
                type="text"
                component={TextInput}
                placeholder="Type payer FIO Handle"
                label="Payer FIO Handle"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />
              <Field
                name="amount"
                type="text"
                component={TextInput}
                placeholder="Type requested amount"
                label="FIO tokens amount"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />
              <Field
                name="memo"
                type="text"
                component={TextInput}
                placeholder="Type memo"
                label="Memo"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />

              <SubmitButton
                text="Confirm params"
                hasLowHeight
                hasSmallText
                hasAutoWidth
                isCobalt
                disabled={!formProps.valid}
              />
            </form>
          );
        }}
      />
    </div>
  );
};
