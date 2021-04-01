import React, { useState, useEffect } from 'react';
import { Form, Field, useForm } from 'react-final-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Scrollbar } from 'react-scrollbars-custom';
import classnames from 'classnames';

import ModalComponent from '../Modal/Modal';
import FormHeader from '../FormHeader/FormHeader';
import Input from '../Input/Input';

import classes from './PasswordRecoveryForm.module.scss';

const PasswordRecoveryForm = props => {
  const {
    show,
    onClose,
    loading,
    questions,
    getRecoveryQuestions,
    account,
    onSubmit,
  } = props;

  const [isSkip, toggleSkip] = useState(false);
  const [isQuestions, toggleQuestions] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(null);

  useEffect(getRecoveryQuestions, []);

  const showSkip = () => {
    toggleSkip(true);
  };

  const hideSkip = () => {
    toggleSkip(false);
  };

  const closeSkip = () => {
    hideSkip();
    onClose();
  };

  const showQuestions = name => {
    setQuestionNumber(name);
    toggleQuestions(true);
  };

  const hideQuestions = () => {
    toggleQuestions(false);
  };

  const setQuestion = (change, value) => {
    change(questionNumber, value);
    hideQuestions();
  };

  const validateForm = values => {
    const errors = {};

    const {
      recoveryQuestionOne,
      recoveryQuestionTwo,
      recoveryAnswerOne,
      recoveryAnswerTwo,
    } = values;

    const { length: lengthOne } = recoveryAnswerOne || {};
    const { length: lengthTwo } = recoveryAnswerTwo || {};
    const { min_length: minLengthOne } = recoveryQuestionOne || {};
    const { min_length: minLengthTwo } = recoveryQuestionTwo || {};

    if (!recoveryQuestionOne) {
      errors.recoveryQuestionOne = 'Please Select Question';
    }
    if (!recoveryQuestionTwo) {
      errors.recoveryQuestionTwo = 'Please Select Question';
    }

    if (!recoveryAnswerOne) {
      errors.recoveryAnswerOne = 'Answer Field Should be Filled';
    }
    if (lengthOne < minLengthOne) {
      errors.recoveryAnswerOne = `Must have at least ${minLengthOne} characters`;
    }

    if (!recoveryAnswerTwo) {
      errors.recoveryAnswerTwo = 'Answer Field Should be Filled';
    }
    if (lengthTwo < minLengthTwo) {
      errors.recoveryAnswerTwo = `Must have at least ${minLengthTwo} characters`;
    }

    return errors;
  };

  const renderSkip = () => (
    <div className={classes.skip}>
      <FontAwesomeIcon icon="ban" className={classes.icon} />
      <FormHeader
        title="Sure You Want to Skip"
        subtitle={
          <p className={classes.subtitle}>
            If you choose to skip setting up you password recovery, and you
            loose your sign in formation, you will be unable to restore your
            account.
          </p>
        }
      />
      <Button variant="primary" className={classes.button} onClick={closeSkip}>
        SKIP ANYWAY
      </Button>
    </div>
  );

  const renderQuestionType = props => {
    const {
      input: { type, value, name },
    } = props;

    const { question } = value;

    return (
      <div className={classes.header} onClick={() => showQuestions(name)}>
        <div className={classes.text}>
          {type === '1'
            ? question || 'Choose Recovery Question 1'
            : type === '2'
            ? question || 'Choose Recovery Question 2'
            : null}
        </div>
        <FontAwesomeIcon icon="chevron-right" className={classes.icon} />
      </div>
    );
  };

  const renderQuestionItem = props => {
    const {
      input: { name },
    } = props;
    const { change, getState } = useForm();

    const { values } = getState() || {};
    const { recoveryQuestionOne, recoveryQuestionTwo } = values || {};
    const { question: questionOne } = recoveryQuestionOne || {};
    const { question: questionTwo } = recoveryQuestionTwo || {};
    const { question } = name || {};

    let isSelected = false;
    if (question === questionOne) {
      isSelected = true;
    }
    if (question === questionTwo) {
      isSelected = true;
    }

    return (
      <div
        className={classnames(
          classes.question,
          isSelected && classes.isSelected,
        )}
        key={name}
        onClick={() => !isSelected && setQuestion(change, name)}
      >
        {question}
      </div>
    );
  };

  const renderFormItems = props => {
    const { handleSubmit, valid, submitting, values } = props;

    return (
      <form onSubmit={handleSubmit}>
        <div className={classes.formBox}>
          <div className={classnames(classes.box, isQuestions && classes.show)}>
            <FormHeader
              title="Setup Password Recovery"
              isDoubleColor
              header="One Last Thing!"
              subtitle="Set up your password recovery, so you don’t loose your account forever."
            />
            <Field
              name="recoveryQuestionOne"
              type="1"
              disabled={loading}
              component={renderQuestionType}
              options={questions}
            />
            {values.recoveryQuestionOne && (
              <Field
                name="recoveryAnswerOne"
                type="text"
                placeholder="Answer"
                disabled={loading}
                component={Input}
              />
            )}
            <Field
              name="recoveryQuestionTwo"
              type="2"
              disabled={loading}
              component={renderQuestionType}
              options={questions}
            />
            {values.recoveryQuestionTwo && (
              <Field
                name="recoveryAnswerTwo"
                type="text"
                placeholder="Answer"
                disabled={loading}
                component={Input}
              />
            )}
            <Button
              htmltype="submit"
              variant="primary"
              className="w-100"
              onClick={handleSubmit}
              disabled={loading || !valid}
            >
              {loading || submitting ? (
                <FontAwesomeIcon icon="spinner" spin />
              ) : (
                'NEXT'
              )}
            </Button>
            <p className={classes.skipButton} onClick={showSkip}>
              Skip
            </p>
          </div>
          <div className={classnames(classes.box, isQuestions && classes.show)}>
            <FormHeader
              title="Setup Password Recovery"
              isDoubleColor
              subtitle="Choose Recovery Question"
            />
            <Scrollbar
              style={{ height: '350px', marginBottom: '30px' }}
              thumbYProps={{ className: classes.scrollThumbY }}
              trackYProps={{ className: classes.scrollTrackY }}
            >
              {questions.map(item => (
                <Field
                  name={item}
                  component={renderQuestionItem}
                  key={`${item.question.replace(/ /, '')}${item.category}`}
                />
              ))}
            </Scrollbar>
          </div>
        </div>
      </form>
    );
  };

  const renderForm = () =>
    isSkip ? (
      renderSkip()
    ) : (
      <Form
        onSubmit={async values => {
          const {
            recoveryAnswerTwo,
            recoveryAnswerOne,
            recoveryQuestionTwo,
            recoveryQuestionOne,
          } = values;

          try {
            const token = await account.changeRecovery(
              [recoveryQuestionOne.question, recoveryQuestionTwo.question],
              [recoveryAnswerOne, recoveryAnswerTwo],
            );
            onSubmit(token);
            return {};
          } catch (e) {
            console.error(e);
            return {
              errors: {
                recoveryAnswerOne:
                  'There was an issue setting recovery questions',
              },
            };
          }
        }}
        validate={validateForm}
      >
        {renderFormItems}
      </Form>
    );

  return (
    <ModalComponent
      show={show}
      backdrop="static"
      onClose={isSkip ? closeSkip : showSkip}
      isDanger={isSkip}
      closeButton={!isQuestions}
      title={
        (isQuestions || isSkip) && (
          <FontAwesomeIcon
            icon="arrow-left"
            className={classes.arrow}
            onClick={isQuestions ? hideQuestions : hideSkip}
          />
        )
      }
    >
      {renderForm()}
    </ModalComponent>
  );
};

export default PasswordRecoveryForm;
