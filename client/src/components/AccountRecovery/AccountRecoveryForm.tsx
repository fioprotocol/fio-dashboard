import React from 'react';
import { Form, Field, FormRenderProps } from 'react-final-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Input from '../Input/Input';
import SubmitButton from '../common/SubmitButton/SubmitButton';
import CancelButton from '../common/CancelButton/CancelButton';

import { ErrorBadge, ERROR_UI_TYPE } from '../Input/ErrorBadge';

import { formValidation } from './validation';

import { FormValues } from './types';

import classes from './AccountRecoveryForm.module.scss';

type Props = {
  cancelAction: () => void;
  loading: boolean;
  questionsLoading: boolean;
  questions: string[];
  username: string;
  token: string;
  recoveryAccount: (params: {
    token: string;
    password: string;
    username: string;
    answers: string[];
  }) => void;
  recoveryAccountResults: { status?: number; type?: string };
};

const AccountRecoveryForm: React.FC<Props> = props => {
  const {
    cancelAction,
    loading,
    questions,
    questionsLoading,
    username,
    recoveryAccount,
    recoveryAccountResults,
    token,
  } = props;
  const questionItems = {
    recoveryQuestionOne: questions[0] || '',
    recoveryQuestionTwo: questions[1] || '',
  };

  const answersError =
    recoveryAccountResults.type === 'PasswordError' &&
    'Some of the answers were incorrect. Please try again!';

  const onSubmit = (values: FormValues) => {
    const {
      password = '',
      recoveryAnswerOne = '',
      recoveryAnswerTwo = '',
    } = values;
    const answers = [recoveryAnswerOne, recoveryAnswerTwo];

    const params = {
      token,
      password,
      answers,
      username,
    };

    recoveryAccount(params);
  };

  const renderForm = (formProps: FormRenderProps) => {
    const { handleSubmit, valid, touched } = formProps;
    const isLoading = loading || questionsLoading;
    const disabledButton =
      isLoading ||
      (!valid &&
        touched &&
        Object.values(touched).every(touchedField => touchedField));

    return (
      <form onSubmit={handleSubmit} className={classes.form}>
        <p className={classes.subtitle}>
          In order to recover your account and reset your password, you must
          answer your recover account questions.
        </p>
        <div className={classes.questionItem}>
          <div className={classes.question}>
            {questionsLoading ? (
              <FontAwesomeIcon icon="spinner" spin className={classes.icon} />
            ) : (
              questionItems.recoveryQuestionOne
            )}
          </div>
          <Field
            component={Input}
            type="text"
            placeholder="Enter Your Answer"
            name="recoveryAnswerOne"
            autoComplete="off"
            disabled={isLoading}
            showErrorBorder={answersError}
          />
        </div>
        <div className={classes.questionItem}>
          <div className={classes.question}>
            {questionsLoading ? (
              <FontAwesomeIcon icon="spinner" spin className={classes.icon} />
            ) : (
              questionItems.recoveryQuestionTwo
            )}
          </div>
          <Field
            component={Input}
            type="text"
            placeholder="Enter Your Answer"
            name="recoveryAnswerTwo"
            autoComplete="off"
            disabled={isLoading}
            showErrorBorder={answersError}
          />
        </div>
        {answersError && (
          <div className={classes.error}>
            <ErrorBadge
              type={ERROR_UI_TYPE.BADGE}
              error={answersError}
              hasError={true}
            />
          </div>
        )}
        <p className={classes.subtitle}>
          Please update your password in order to access the dashboard.
        </p>
        <Field
          component={Input}
          type="password"
          name="password"
          placeholder="Enter Password"
          autoComplete="new-password"
          disabled={isLoading}
        />
        <Field
          component={Input}
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          autoComplete="new-password"
        />

        <SubmitButton
          text={answersError ? 'Try Again' : 'Confirm'}
          disabled={disabledButton}
          loading={isLoading}
          withBottomMargin={true}
        />
        <CancelButton onClick={cancelAction} withBottomMargin={true} />
      </form>
    );
  };
  return (
    <Form
      onSubmit={onSubmit}
      render={renderForm}
      validate={formValidation.validateForm}
    />
  );
};

export default AccountRecoveryForm;
