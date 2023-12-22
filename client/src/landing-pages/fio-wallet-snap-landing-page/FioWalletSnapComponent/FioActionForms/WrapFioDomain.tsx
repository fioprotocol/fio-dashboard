import React from 'react';
import { Form, Field } from 'react-final-form';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

type ErrorsProps = {
  fioDomain?: string;
  chainCode?: string;
  publicAddress?: string;
};

const validateForm = ({
  fioDomain,
  chainCode,
  publicAddress,
}: {
  fioDomain: string;
  chainCode: string;
  publicAddress: string;
}): ErrorsProps => {
  const errors: ErrorsProps = {};

  if (!fioDomain) {
    errors.fioDomain = 'Required';
  }

  if (!chainCode) {
    errors.chainCode = 'Required';
  }

  if (!publicAddress) {
    errors.publicAddress = 'Required';
  }

  return errors;
};

type Props = {
  onSubmit: (values: any) => void;
};

export const WrapFioDomain: React.FC<Props> = props => {
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
              <Field
                name="chainCode"
                type="text"
                component={TextInput}
                placeholder="Type Chain Code where to wrap"
                label="Chain Code"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />
              <Field
                name="publicAddress"
                type="text"
                component={TextInput}
                placeholder="Type Public Address"
                label="Public Address"
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
