import React from 'react';
import { Form, Field } from 'react-final-form';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

type ErrorsProps = {
  customAction?: string;
};

const validateForm = ({
  customAction,
}: {
  customAction: string;
}): ErrorsProps => {
  const errors: ErrorsProps = {};

  if (!customAction) {
    errors.customAction = 'Required';
  }

  return errors;
};

type Props = {
  onSubmit: (values: any) => void;
};

export const CustomActionForm: React.FC<Props> = props => {
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
                name="customAction"
                type="textarea"
                element="textarea"
                component={TextInput}
                placeholder="Type Custom Action Params"
                label="Custom Action Params"
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
