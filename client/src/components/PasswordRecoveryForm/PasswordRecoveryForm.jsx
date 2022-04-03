import React, { useState, useEffect } from 'react';
import { Form, Field, useForm, FormSpy } from 'react-final-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Scrollbar } from 'react-scrollbars-custom';
import classnames from 'classnames';

import EdgeConfirmAction from '../EdgeConfirmAction';
import { ErrorBadge } from '../Input/ErrorBadge';
import ModalComponent from '../Modal/Modal';
import FormHeader from '../FormHeader/FormHeader';
import Input from '../Input/Input';
import SuccessModal from '../Modal/SuccessModal';

import { ACTIONS } from '../Notifications/Notifications';
import { BADGE_TYPES } from '../Badge/Badge';
import { NOTIFICATIONS_CONTENT_TYPE } from '../../constants/notifications';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { ROUTES } from '../../constants/routes';

import { formValidation } from './validation';
import { log } from '../../util/general';

import classes from './PasswordRecoveryForm.module.scss';

const PasswordRecoveryForm = props => {
  const {
    show,
    closeRecoveryModal,
    edgeAuthLoading,
    questions,
    getRecoveryQuestions,
    showPinConfirm,
    onSubmit: setProfileRecovery,
    changeRecoveryQuestions,
    changeRecoveryQuestionsClose,
    changeRecoveryQuestionsResults,
    checkRecoveryQuestions,
    username,
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
  const [submitData, setSubmitData] = useState(null);

  useEffect(getRecoveryQuestions, []);

  useEffect(() => {
    if (status) {
      if (isSettings) {
        toggleSuccessModal(true);
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

  const onSubmit = values => {
    setDefaultValues(values);
    setSubmitData(values);
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
      contentType: NOTIFICATIONS_CONTENT_TYPE.RECOVERY_PASSWORD,
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

  const submit = async ({ edgeAccount, data }) => {
    const {
      recoveryAnswerTwo,
      recoveryAnswerOne,
      recoveryQuestionTwo,
      recoveryQuestionOne,
    } = data;
    try {
      const token = await edgeAccount.changeRecovery(
        [recoveryQuestionOne.question, recoveryQuestionTwo.question],
        [recoveryAnswerOne, recoveryAnswerTwo],
      );
      setProfileRecovery(token);
      return { status: 1 };
    } catch (e) {
      log.error(e);
      setError('There was an issue setting recovery questions');
      return {};
      // todo: handle error for each field
      // return {
      //   recoveryAnswerTwo:
      //     'There was an issue setting recovery questions',
      // };
    }
  };

  const onSuccess = results => {
    if (results.status) {
      setSubmitData(null);
    } else {
      onCancel();
    }
  };
  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const onSuccessClose = () => {
    closeRecoveryModal();
    changeRecoveryQuestionsClose();
    toggleSuccessModal(false);
    checkRecoveryQuestions(username);
  };

  const renderSkip = () => (
    <div className={classes.skip}>
      <FontAwesomeIcon icon="ban" className={classes.icon} />
      <FormHeader
        title="Sure You Want to Skip"
        subtitle={
          <p className={classes.subtitle}>
            If you choose to skip setting up you password recovery, and you lose
            your sign in formation, you will be unable to restore your account.
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
              subtitle="Set up your password recovery, so you don’t lose your account forever."
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
              onClick={handleSubmit}
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
        onSubmit={onSubmit}
        initialValues={defaultValues}
        validate={formValidation.validateForm}
      >
        {renderFormItems}
      </Form>
    );

  return (
    <>
      {!showSuccessModal && (
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
          <SuccessModal
            showModal={showSuccessModal}
            title="Password Recovery Setup!"
            subtitle="Your password recovery questions has been successfully setup"
            onClose={onSuccessClose}
          />
        </>
      )}
      <EdgeConfirmAction
        action={CONFIRM_PIN_ACTIONS.RECOVERY}
        setProcessing={setProcessing}
        onSuccess={onSuccess}
        onCancel={onCancel}
        processing={processing}
        hideProcessing={true}
        data={submitData}
        submitAction={submit}
      />
    </>
  );
};

export default PasswordRecoveryForm;
