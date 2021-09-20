import React, { useState, useEffect } from 'react';
import { Form, Field, useForm, FormSpy } from 'react-final-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Scrollbar } from 'react-scrollbars-custom';
import classnames from 'classnames';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { ROUTES } from '../../constants/routes';
import { ErrorBadge } from '../Input/ErrorBadge';

import { ACTIONS } from '../Notifications/Notifications';
import { BADGE_TYPES } from '../Badge/Badge';
import ModalComponent from '../Modal/Modal';
import FormHeader from '../FormHeader/FormHeader';
import Input from '../Input/Input';
import SuccessModal from '../Modal/SuccessModal';
import SendLinkModal from './SendLinkModal';

import classes from './PasswordRecoveryForm.module.scss';

const MIN_VALID_LENGTH = 3;

const PasswordRecoveryForm = props => {
  const {
    show,
    closeRecoveryModal,
    edgeAuthLoading,
    pinConfirmation,
    showPinConfirm,
    questions,
    getRecoveryQuestions,
    onSubmit,
    showPinModal,
    resetPinConfirm,
    changeRecoveryQuestions,
    changeRecoveryQuestionsClose,
    changeRecoveryQuestionsResults,
    checkRecoveryQuestions,
    username,
    resendRecovery,
  } = props;

  const isSettings = changeRecoveryQuestions; // todo: should be refactored on settings recovery password design task
  const { status } = changeRecoveryQuestionsResults;

  const [isSkip, toggleSkip] = useState(false);
  const [isQuestions, toggleQuestions] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});
  const [errorMessage, setError] = useState('');
  const [showSuccessModal, toggleSuccessModal] = useState(false);
  const [showSendEmailModal, toggleSendEmailModal] = useState(false);

  useEffect(getRecoveryQuestions, []);
  useEffect(async () => {
    if (
      processing &&
      pinConfirmation &&
      pinConfirmation.account &&
      pinConfirmation.action === CONFIRM_PIN_ACTIONS.RECOVERY
    ) {
      const recoveryForm = document.getElementById('recovery-form');
      recoveryForm.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true }),
      );
    }
    if (processing && pinConfirmation && pinConfirmation.error) {
      setProcessing(false);
    }
  }, [pinConfirmation]);

  useEffect(() => {
    if (status) {
      if (isSettings) {
        toggleSendEmailModal(true);
      } else {
        closeRecoveryModal();
        changeRecoveryQuestionsClose();
      }
      setProcessing(false);
      setDefaultValues({});
    }
  }, [status]);

  const fieldValuesChanged = () => {
    setError('');
  };

  const confirmPin = values => () => {
    setProcessing(true);
    const {
      recoveryAnswerTwo,
      recoveryAnswerOne,
      recoveryQuestionTwo,
      recoveryQuestionOne,
    } = values;

    setDefaultValues(values);
    showPinModal(CONFIRM_PIN_ACTIONS.RECOVERY, {
      recoveryAnswerTwo,
      recoveryAnswerOne,
      recoveryQuestionTwo,
      recoveryQuestionOne,
    });
  };

  const showSkip = () => {
    toggleSkip(true);
  };

  const hideSkip = () => {
    toggleSkip(false);
  };

  const closeSkip = () => {
    hideSkip();
    closeRecoveryModal();
    props.createNotification({
      action: ACTIONS.RECOVERY,
      type: BADGE_TYPES.ALERT,
      pagesToShow: [ROUTES.HOME],
    });
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

  const handleClose = () => {
    if (processing) return;
    if (isSettings) {
      closeRecoveryModal();
      changeRecoveryQuestionsClose();
      return;
    }
    return isSkip ? closeSkip() : showSkip();
  };

  const onSendEmailClick = () => {
    resendRecovery();
    toggleSendEmailModal(false);
    toggleSuccessModal(true); // todo: show success modal on resend recovery results
  };

  const onSendEmailModalClose = () => {
    toggleSendEmailModal(false);
    toggleSuccessModal(true);
  };

  const onSuccessClose = () => {
    closeRecoveryModal();
    changeRecoveryQuestionsClose();
    toggleSuccessModal(false);
    checkRecoveryQuestions(username);
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

    if (!recoveryQuestionOne) {
      errors.recoveryQuestionOne = 'Please Select Question';
    }
    if (!recoveryQuestionTwo) {
      errors.recoveryQuestionTwo = 'Please Select Question';
    }

    if (!recoveryAnswerOne) {
      errors.recoveryAnswerOne = 'Answer Field Should be Filled';
    }
    if (lengthOne < MIN_VALID_LENGTH) {
      errors.recoveryAnswerOne = `Must have at least 3 characters`;
    }

    if (!recoveryAnswerTwo) {
      errors.recoveryAnswerTwo = 'Answer Field Should be Filled';
    }
    if (lengthTwo < MIN_VALID_LENGTH) {
      errors.recoveryAnswerTwo = `Must have at least 3 characters`;
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
      <div
        className={classnames(classes.header, processing && classes.disabled)}
        onClick={() => !processing && showQuestions(name)}
      >
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

  const QuestionItem = props => {
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
      <form onSubmit={handleSubmit} id="recovery-form">
        <FormSpy
          subscription={{ values: true }}
          onChange={fieldValuesChanged}
        />
        <div className={classes.formBox}>
          <div className={classnames(classes.box, isQuestions && classes.show)}>
            <FormHeader
              title="Setup Password Recovery"
              isDoubleColor
              header={!isSettings && 'One Last Thing!'}
              subtitle="Set up your password recovery, so you don’t loose your account forever."
            />
            <Field
              name="recoveryQuestionOne"
              type="1"
              disabled={edgeAuthLoading || processing}
              component={renderQuestionType}
              options={questions}
            />
            {values.recoveryQuestionOne && (
              <Field
                name="recoveryAnswerOne"
                type="text"
                placeholder="Answer"
                disabled={edgeAuthLoading || processing}
                component={Input}
              />
            )}
            <Field
              name="recoveryQuestionTwo"
              type="2"
              disabled={edgeAuthLoading || processing}
              component={renderQuestionType}
              options={questions}
            />
            {values.recoveryQuestionTwo && (
              <Field
                name="recoveryAnswerTwo"
                type="text"
                placeholder="Answer"
                disabled={edgeAuthLoading || processing}
                component={Input}
              />
            )}

            {errorMessage && (
              <ErrorBadge error={errorMessage} hasError={true} data={{}} wrap />
            )}
            <Button
              htmltype="submit"
              variant="primary"
              className="w-100"
              onClick={confirmPin(values)}
              disabled={edgeAuthLoading || !valid || processing}
            >
              {edgeAuthLoading || submitting || processing ? (
                <FontAwesomeIcon icon="spinner" spin />
              ) : (
                'NEXT'
              )}
            </Button>
            {!isSettings && (
              <p className={classes.skipButton} onClick={showSkip}>
                Skip
              </p>
            )}
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
                  component={QuestionItem}
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
    isSkip && !isSettings ? (
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
            const token = await pinConfirmation.account.changeRecovery(
              [recoveryQuestionOne.question, recoveryQuestionTwo.question],
              [recoveryAnswerOne, recoveryAnswerTwo],
            );
            onSubmit(token);
          } catch (e) {
            console.error(e);
            setProcessing(false);
            setError('There was an issue setting recovery questions');
            // todo: handle error for each field
            // return {
            //   recoveryAnswerTwo:
            //     'There was an issue setting recovery questions',
            // };
          }
          resetPinConfirm();
          return {};
        }}
        initialValues={defaultValues}
        validate={validateForm}
      >
        {renderFormItems}
      </Form>
    );

  return (
    <>
      {!showSuccessModal && !showSendEmailModal && (
        <ModalComponent
          show={show && !showPinConfirm}
          backdrop="static"
          onClose={handleClose}
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
      )}
      {isSettings && (
        <>
          <SendLinkModal
            show={showSendEmailModal}
            onClose={onSendEmailModalClose}
            onClick={onSendEmailClick}
          />
          <SuccessModal
            showModal={showSuccessModal}
            title="Password Recovery Changed!"
            subtitle="Your password recovery questions has been successfully changed"
            onClose={onSuccessClose}
          />
        </>
      )}
    </>
  );
};

export default PasswordRecoveryForm;
