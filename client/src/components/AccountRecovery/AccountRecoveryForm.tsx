import React from 'react';
import { Form, Field, FormRenderProps } from 'react-final-form';
import { Button } from 'react-bootstrap';
import Input from '../Input/Input';
import validation from './validation';
import classes from './AccountRecoveryForm.module.scss';
import { FormValues } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  cancelAction: () => void;
  loading: boolean;
  questionsLoading: boolean;
  questions: string[];
  username: string;
  token: string;
  recoveryAccount: ({}) => void;
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
    // todo: uncomment after rebase
    // recoveryAccountResults,
    token,
  } = props;
  const questionItems = {
    recoveryQuestionOne: questions[0] || '',
    recoveryQuestionTwo: questions[1] || '',
  };

  // todo: uncomment after rebase
  // const answersError =
  //   recoveryAccountResults.type === 'PasswordError' && 'Invalid Answers';

  const onSubmit = (values: FormValues) => {
    const { password, recoveryAnswerOne, recoveryAnswerTwo } = values;
    const answers = [recoveryAnswerOne, recoveryAnswerTwo];

    const params = {
      token,
      password,
      answers,
      username,
    };

    recoveryAccount(params);
  };

  const renderForm = (props: FormRenderProps) => {
    const { handleSubmit, valid, touched } = props;
    const isLoading = loading || questionsLoading;
    const disabledButton =
      isLoading ||
      (!valid && Object.values(touched).some(touchedField => touchedField));

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
            showErr
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
          />
        </div>
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
        <Button
          type="submit"
          className={classes.submitButton}
          disabled={disabledButton}
        >
          Confirm
          {isLoading && (
            <FontAwesomeIcon icon="spinner" spin className="ml-2" />
          )}
        </Button>
        <button
          type="button"
          onClick={cancelAction}
          className={classes.cancelButton}
        >
          Cancel
        </button>
      </form>
    );
  };
  return <Form onSubmit={onSubmit} render={renderForm} validate={validation} />;
};

export default AccountRecoveryForm;
