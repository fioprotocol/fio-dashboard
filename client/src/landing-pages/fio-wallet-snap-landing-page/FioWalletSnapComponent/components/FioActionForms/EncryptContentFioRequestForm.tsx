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
};

const validateForm = ({ amount }: { amount: string }): ErrorsProps => {
  const errors: ErrorsProps = {};

  if (!amount) {
    errors.amount = 'Required';
  }

  return errors;
};

type Props = {
  onSubmit: (values: {
    amount: string;
    memo: string;
    encryptionPublicKey: string;
  }) => void;
};

export const EncryptContentFioRequestForm: React.FC<Props> = props => {
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
              <Field
                name="encryptionPublicKey"
                type="text"
                component={TextInput}
                placeholder="Type Public Key of other user who send Request to you or received from you."
                label="Other user FIO Public Key for encrypt data"
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
