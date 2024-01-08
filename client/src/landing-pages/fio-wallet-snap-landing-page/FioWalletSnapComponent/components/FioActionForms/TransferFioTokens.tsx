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
  payeeFioPublicKey?: string;
};

const validateForm = ({
  amount,
  payeeFioPublicKey,
}: {
  amount: string;
  payeeFioPublicKey: string;
}): ErrorsProps => {
  const errors: ErrorsProps = {};

  if (!amount) {
    errors.amount = 'Required';
  }

  if (!payeeFioPublicKey) {
    errors.payeeFioPublicKey = 'Required';
  }

  return errors;
};

type Props = {
  onSubmit: (values: any) => void;
};

export const TransferFioTokens: React.FC<Props> = props => {
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
                name="amount"
                type="text"
                component={TextInput}
                placeholder="Type FIO Amount to send"
                label="FIO Tokens amount"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />
              <Field
                name="payeeFioPublicKey"
                type="text"
                component={TextInput}
                placeholder="Type Public Key for receiving tokens"
                label="FIO Public Key"
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
