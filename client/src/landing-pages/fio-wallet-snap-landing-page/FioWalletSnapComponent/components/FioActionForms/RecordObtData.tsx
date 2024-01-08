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
  obtId?: string;
};

const validateForm = ({
  amount,
  payeeFioHandle,
  payerFioHandle,
  obtId,
}: {
  amount: string;
  payeeFioHandle: string;
  payerFioHandle: string;
  obtId: string;
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

  if (!obtId) {
    errors.obtId = 'Required';
  }

  return errors;
};

type Props = {
  onSubmit: (values: any) => void;
};

export const RecordObtData: React.FC<Props> = props => {
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
                placeholder="Type TO FIO Handle"
                label="Send To FIO Handle *"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />
              <Field
                name="payerFioHandle"
                type="text"
                component={TextInput}
                placeholder="Type FROM FIO Handle"
                label="From FIO Handle *"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />
              <Field
                name="amount"
                type="text"
                component={TextInput}
                placeholder="Type requested amount"
                label="FIO tokens amount *"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />
              <Field
                name="obtId"
                type="text"
                component={TextInput}
                placeholder="Type OBT ID"
                label="Type OBT transaction_id *"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />
              <Field
                name="fioRequestId"
                type="text"
                component={TextInput}
                placeholder="Type FIO request ID"
                label="FIO Request ID"
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
                name="hash"
                type="text"
                component={TextInput}
                placeholder="Type hash"
                label="Hash"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />

              <Field
                name="offLineUrl"
                type="text"
                component={TextInput}
                placeholder="Type OffLine url"
                label="OffLine URL"
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
