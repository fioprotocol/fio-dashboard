import React from 'react';
import { Form, Field } from 'react-final-form';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../../components/Input/TextInput';
import { COLOR_TYPE } from '../../../../../components/Input/ErrorBadge';
import SubmitButton from '../../../../../components/common/SubmitButton/SubmitButton';
import { AnyType } from '../../../../../types';

type ErrorsProps = {
  fioDomain?: string;
};

const validateForm = ({ fioDomain }: { fioDomain: string }): ErrorsProps => {
  const errors: ErrorsProps = {};

  if (!fioDomain) {
    errors.fioDomain = 'Required';
  }

  return errors;
};

type Props = {
  onSubmit: (values: AnyType) => void;
};

export const RenewFioDomain: React.FC<Props> = props => {
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
                name="fioDomain"
                type="text"
                component={TextInput}
                placeholder="Type FIO Domain"
                label="FIO Domain"
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
