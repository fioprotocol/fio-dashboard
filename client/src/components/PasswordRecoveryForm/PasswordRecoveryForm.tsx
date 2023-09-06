import React, { useCallback, useState } from 'react';
import {
  Form,
  Field,
  useForm,
  FormSpy,
  FieldRenderProps,
  FormRenderProps,
} from 'react-final-form';
import { useHistory } from 'react-router';
import { Button } from 'react-bootstrap';
import { Scrollbar } from 'react-scrollbars-custom';
import classnames from 'classnames';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BlockIcon from '@mui/icons-material/Block';

import EdgeConfirmAction from '../EdgeConfirmAction';
import { ErrorBadge } from '../Input/ErrorBadge';
import ModalComponent from '../Modal/Modal';
import FormHeader from '../FormHeader/FormHeader';
import Input from '../Input/Input';
import Modal from '../Modal/Modal';
import PageTitle from '../PageTitle/PageTitle';

import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { LINKS } from '../../constants/labels';

import { formValidation } from './validation';
import { log } from '../../util/general';
import useEffectOnce from '../../hooks/general';

import { StatusResponse } from '../../types';
import { SubmitActionParams } from '../EdgeConfirmAction/types';

import classes from './PasswordRecoveryForm.module.scss';
import SubmitButton from '../common/SubmitButton/SubmitButton';

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
  useremail: string | null;
  questions: { category: string; question: string }[];
  showPinConfirm: boolean;
  changeRecoveryQuestions: boolean;
  changeRecoveryQuestionsResults: { status?: number };
  onSubmit: (token: string) => void;
  changeRecoveryQuestionsClose: () => void;
  getRecoveryQuestions: () => void;
  closeRecoveryModal: () => void;
  checkRecoveryQuestions: (username: string) => void;
};

const PasswordRecoveryForm: React.FC<Props> = props => {
  const {
    show,
    closeRecoveryModal,
    edgeAuthLoading,
    questions,
    username,
    useremail,
    showPinConfirm,
    changeRecoveryQuestions,
    changeRecoveryQuestionsResults,
    getRecoveryQuestions,
    onSubmit: setProfileRecovery,
    changeRecoveryQuestionsClose,
    checkRecoveryQuestions,
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

  const history = useHistory<{ openSettingsModal: string }>();

  const clearRouterState = useCallback(() => {
    const state = history.location.state;

    if (state) {
      delete state.openSettingsModal;
    }

    history.replace({ ...history.location, state });
  }, [history]);

  useEffectOnce(getRecoveryQuestions, [getRecoveryQuestions]);

  useEffectOnce(
    () => {
      toggleSuccessModal(true);
      setProcessing(false);
      setDefaultValues({});
    },
    [changeRecoveryQuestionsClose, closeRecoveryModal],
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
      clearRouterState();
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
      <PageTitle
        link={LINKS.CREATE_ACCOUNT_SECRET_QUESTIONS_SKIP}
        isVirtualPage
        shouldFireOnce
      />
      <BlockIcon className={classes.icon} />
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
        <ChevronRightIcon />
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
            <SubmitButton
              onClick={handleSubmit}
              text="NEXT"
              loading={edgeAuthLoading || submitting || processing}
              disabled={edgeAuthLoading || !valid || processing}
              withBottomMargin
            />
            {!isSettings && (
              <p className={classes.skipButton} onClick={showSkip}>
                Skip
              </p>
            )}
          </div>
          <div className={classnames(classes.box, isQuestions && classes.show)}>
            <FormHeader
              title="Setup Password Recovery"
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
      <>
        <PageTitle
          link={
            !isQuestions
              ? LINKS.CREATE_ACCOUNT_SECRET_QUESTIONS
              : LINKS.CREATE_ACCOUNT_SECRET_ANSWERS
          }
          isVirtualPage
          shouldFireOnce
        />
        <Form
          onSubmit={onSubmit}
          initialValues={defaultValues}
          validate={formValidation.validateForm}
        >
          {renderFormItems}
        </Form>
      </>
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
              <ArrowBackIcon
                onClick={isQuestions ? hideQuestions : hideSkip}
                className={classes.arrow}
              />
            )
          }
        >
          {renderForm()}
        </ModalComponent>
      )}
      <Modal
        show={showSuccessModal}
        closeButton
        isIndigo
        onClose={onSuccessClose}
      >
        <div className={classes.modalContainer}>
          <AssignmentTurnedInIcon className={classes.icon} />
          <h5 className={classes.title}>
            Password recovery questions and answers saved
          </h5>
          <p className={classes.text}>
            We have sent you an email to{' '}
            <span className="boldText">{useremail}</span> with a recovery link
            which you should save.
          </p>
          <p className={classes.infoText}>
            If you ever loose your password, click on the link, answer the
            secret questions correctly and you will be able to create a new
            password.
          </p>
          <SubmitButton
            text="Close"
            isWhiteBordered
            onClick={onSuccessClose}
            withBottomMargin
          />
        </div>
      </Modal>
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
