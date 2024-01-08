import React from 'react';
import { Form, Field } from 'react-final-form';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../../components/Input/TextInput';
import { COLOR_TYPE } from '../../../../../components/Input/ErrorBadge';
import SubmitButton from '../../../../../components/common/SubmitButton/SubmitButton';
import {
  CHAIN_CODE_REGEXP,
  TOKEN_CODE_REGEXP,
} from '../../../../../constants/regExps';
import {
  MAX_CHAIN_LENGTH,
  MAX_TOKEN_LENGTH,
} from '../../../../../constants/fio';
import { CHAIN_CODES } from '../../../../../constants/common';

type ErrorsProps = {
  chainCode?: string;
  tokenCode?: string;
  publicAddress?: string;
  fioHandle?: string;
};

const validateToken = ({
  chainCode,
  tokenCode,
  publicAddress,
  fioHandle,
}: {
  chainCode: string;
  tokenCode: string;
  publicAddress: string;
  fioHandle: string;
}): ErrorsProps => {
  const errors: ErrorsProps = {};

  if (!chainCode) {
    errors.chainCode = 'Required';
  }
  if (chainCode && !CHAIN_CODE_REGEXP.test(chainCode)) {
    errors.chainCode = 'Wrong Chain Code';
  }
  if ((chainCode?.length || 0) > MAX_CHAIN_LENGTH) {
    errors.chainCode = 'Chain Code is too long';
  }

  if (!tokenCode) {
    errors.tokenCode = 'Required';
  }
  if (tokenCode && !TOKEN_CODE_REGEXP.test(tokenCode)) {
    errors.tokenCode = 'Wrong Token Code';
  }
  if ((tokenCode?.length || 0) > MAX_TOKEN_LENGTH) {
    errors.tokenCode = 'Token Code is too long';
  }

  if (chainCode && tokenCode) {
    if (chainCode === CHAIN_CODES.FIO && tokenCode === CHAIN_CODES.FIO) {
      errors.chainCode =
        'Your FIO Public Key is already mapped to your FIO Handle and that mapping cannot be changed via the FIO App.';
    }
  }

  if (!publicAddress) {
    errors.publicAddress = 'Required';
  }
  if (publicAddress && publicAddress.length >= 128) {
    errors.publicAddress = 'Too long token';
  }

  if (!fioHandle) {
    errors.fioHandle = 'Required';
  }

  return errors;
};

type Props = {
  onSubmit: (values: any) => void;
};

export const AddPublicAddressForm: React.FC<Props> = props => {
  const { onSubmit } = props;
  return (
    <div>
      <Form
        onSubmit={onSubmit}
        validate={validateToken}
        render={formProps => {
          return (
            <form onSubmit={formProps.handleSubmit}>
              <Field
                name="chainCode"
                type="text"
                component={TextInput}
                placeholder="Type Chain Code"
                label="Chain Code"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />
              <Field
                name="tokenCode"
                type="text"
                component={TextInput}
                placeholder="Type Token Code"
                label="Token Code"
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

              <Field
                name="fioHandle"
                type="text"
                component={TextInput}
                placeholder="Type FIO Handle"
                label="FIO Handle"
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
