import React, { useState } from 'react';
import {
  Form,
  Field,
  useForm,
  FormSpy,
  FieldRenderProps,
  FormRenderProps,
} from 'react-final-form';
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
import useEffectOnce from '../../hooks/general';

import classes from './PasswordRecoveryForm.module.scss';
import { NotificationParams, StatusResponse } from '../../types';
import { SubmitActionParams } from '../EdgeConfirmAction/types';

const SCROLL_BAR_STYLES = { height: '350px', marginBottom: '30px' };

type FormValues = {
  recoveryAnswerTwo: string;
  recoveryAnswerOne: string;
  recoveryQuestionTwo: string;
  recoveryQuestionOne: string;
};

type Props = {
  show: boolean;
  edgeAuthLoading: boolean;
  username: string | null;
  questions: { category: string; question: string }[];
  showPinConfirm: boolean;
  changeRecoveryQuestions: boolean;
  changeRecoveryQuestionsResults: { status?: number };
  onSubmit: (token: string) => void;
  changeRecoveryQuestionsClose: () => void;
  getRecoveryQuestions: () => void;
  closeRecoveryModal: () => void;
  checkRecoveryQuestions: (username: string) => void;
  createNotification: (params: NotificationParams) => void;
};

const PasswordRecoveryForm: React.FC<Props> = props => {
  const {
    show,
    closeRecoveryModal,
    edgeAuthLoading,
    questions,
    username,
    showPinConfirm,
    changeRecoveryQuestions,
    changeRecoveryQuestionsResults,
    getRecoveryQuestions,
    onSubmit: setProfileRecovery,
    changeRecoveryQuestionsClose,
    checkRecoveryQuestions,
    createNotification,
  } = props;

  const isSettings = changeRecoveryQuestions; // todo: should be refactored on settings recovery password design task
  const status = !!changeRecoveryQuestionsResults.status;
  const [isSkip, toggleSkip] = useState(false);
  const [isQuestions, toggleQuestions] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [defaultValues, setDefaultValues] = useState<Partial<FormValues>>({});
  const [errorMessage, setError] = useState('');
  const [showSuccessModal, toggleSuccessModal] = useState(false);
  const [submitData, setSubmitData] = useState<FormValues | null>(null);

  useEffectOnce(getRecoveryQuestions, [getRecoveryQuestions]);

  useEffectOnce(
    () => {
      if (isSettings) {
        toggleSuccessModal(true);
      } else {
        closeRecoveryModal();
        changeRecoveryQuestionsClose();
      }
      setProcessing(false);
      setDefaultValues({});
    },
    [isSettings, changeRecoveryQuestionsClose, closeRecoveryModal],
    status,
  );

  const fieldValuesChanged = () => {
    setError('');
  };

  const onSubmit = (values: FormValues) => {
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
    createNotification({
      action: ACTIONS.RECOVERY,
      contentType: NOTIFICATIONS_CONTENT_TYPE.RECOVERY_PASSWORD,
      type: BADGE_TYPES.ALERT,
      pagesToShow: [ROUTES.HOME],
    });
  };

  const showQuestions = (name: string) => {
    setQuestionNumber(name);
    toggleQuestions(true);
  };

  const hideQuestions = () => {
    toggleQuestions(false);
  };

  const setQuestion = (
    change: (field: string, val: string) => void,
    value: string,
  ) => {
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

  const submit = async ({ edgeAccount, data }: SubmitActionParams) => {
    const {
      recoveryAnswerTwo,
      recoveryAnswerOne,
      recoveryQuestionTwo,
      recoveryQuestionOne,
    } = data;
    try {
      const token = await edgeAccount.changeRecovery(
        [recoveryQuestionOne, recoveryQuestionTwo],
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

  const onSuccess = (results: StatusResponse) => {
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

  const renderQuestionType = (
    fieldRenderProps: FieldRenderProps<FormValues>,
  ) => {
    const {
      input: { type, value, name },
    } = fieldRenderProps;

    return (
      <div
        className={classnames(classes.header, processing && classes.disabled)}
        onClick={() => !processing && showQuestions(name)}
      >
        <div className={classes.text}>
          {type === '1'
            ? value || 'Choose Recovery Question 1'
            : type === '2'
            ? value || 'Choose Recovery Question 2'
            : null}
        </div>
        <FontAwesomeIcon icon="chevron-right" className={classes.icon} />
      </div>
    );
  };

  const QuestionItem = ({ question }: { question: string }) => {
    const { change, getState } = useForm();

    const { values } = getState() || {};
    const { recoveryQuestionOne, recoveryQuestionTwo } = values || {};

    let isSelected = false;
    if (question === recoveryQuestionOne) {
      isSelected = true;
    }
    if (question === recoveryQuestionTwo) {
      isSelected = true;
    }

    return (
      <div
        className={classnames(
          classes.question,
          isSelected && classes.isSelected,
        )}
        key={question}
        onClick={() => !isSelected && setQuestion(change, question)}
      >
        {question}
      </div>
    );
  };

  const renderFormItems = (formRenderProps: FormRenderProps<FormValues>) => {
    const { handleSubmit, valid, submitting, values } = formRenderProps;

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
              type="submit"
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
              style={SCROLL_BAR_STYLES}
              thumbYProps={{ className: classes.scrollThumbY }}
              trackYProps={{ className: classes.scrollTrackY }}
            >
              {questions.map(item => (
                <QuestionItem
                  key={`${item.question.replace(/ /, '')}${item.category}`}
                  question={item.question}
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
