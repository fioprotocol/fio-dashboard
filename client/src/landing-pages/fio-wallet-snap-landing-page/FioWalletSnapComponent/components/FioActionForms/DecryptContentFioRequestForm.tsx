import React from 'react';

import { Form, Field } from 'react-final-form';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../../components/Input/TextInput';
import { COLOR_TYPE } from '../../../../../components/Input/ErrorBadge';
import SubmitButton from '../../../../../components/common/SubmitButton/SubmitButton';

type ErrorsProps = {
  content?: string;
};

const validateForm = ({ content }: { content: string }): ErrorsProps => {
  const errors: ErrorsProps = {};

  if (!content) {
    errors.content = 'Required';
  }

  return errors;
};

type Props = {
  onSubmit: (values: any) => void;
};

export const DecryptContentFioRequestForm: React.FC<Props> = props => {
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
                name="content"
                type="text"
                component={TextInput}
                placeholder="Type Ecnrypted content string from FIO Request"
                label="Encrypted content string"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />
              <Field
                name="encryptionPublicKey"
                type="text"
                component={TextInput}
                placeholder="Type Public Key of other user who send Request to you or received from you."
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
