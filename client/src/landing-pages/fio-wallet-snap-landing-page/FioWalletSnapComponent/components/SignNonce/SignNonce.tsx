import React from 'react';
import { Form, Field } from 'react-final-form';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../../components/Input/TextInput';
import { COLOR_TYPE } from '../../../../../components/Input/ErrorBadge';
import SubmitButton from '../../../../../components/common/SubmitButton/SubmitButton';

import classes from './SignNonce.module.scss';

type ErrorsProps = {
  secret?: string;
};

const validateForm = ({ secret }: { secret: string }): ErrorsProps => {
  const errors: ErrorsProps = {};

  if (!secret) {
    errors.secret = 'Required';
  }

  return errors;
};

type Props = {
  signatureError: Error | null;
  signatureLoading: boolean;
  isSignatureVerified: boolean | null;
  nonce: string | null;
  signature: string | null;
  onSubmit: (values: { secret: string }) => void;
  signNonce: () => void;
};

export const SignNonce: React.FC<Props> = props => {
  const {
    isSignatureVerified,
    nonce,
    signature,
    signatureError,
    signatureLoading,
    onSubmit,
    signNonce,
  } = props;

  return (
    <div className={classes.container}>
      <Form
        onSubmit={onSubmit}
        validate={validateForm}
        render={formProps => {
          return (
            <form onSubmit={formProps.handleSubmit} className={classes.form}>
              <Field
                name="secret"
                type="text"
                component={TextInput}
                placeholder="Type secret"
                label="Type secret"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />

              <SubmitButton
                text="Generate nonce"
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
      {nonce && (
        <>
          <h6 className="mt-4">Generated nonce: {nonce}</h6>
          <SubmitButton
            text="Generate signature"
            hasLowHeight
            hasSmallText
            hasAutoWidth
            isCobalt
            onClick={signNonce}
            loading={signatureLoading}
            disabled={signatureLoading}
          />

          {signature && !signatureError && (
            <>
              <h6 className="mt-4">Signature: {signature}</h6>
              <h6 className="mt-4">
                Is Signature verified: &nbsp;
                <span
                  className={
                    isSignatureVerified ? 'text-success' : 'text-danger'
                  }
                >
                  {isSignatureVerified != null &&
                    JSON.stringify(isSignatureVerified)}
                </span>
              </h6>
            </>
          )}
          {signatureError && (
            <h6 className="mt-4 text-danger">
              Signature Error: {signatureError.message}
            </h6>
          )}
        </>
      )}
    </div>
  );
};
