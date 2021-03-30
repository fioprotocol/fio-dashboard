import React, { useState } from 'react';
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
  const { show, onClose, loading, questions } = props;

  const [isSkip, toggleSkip] = useState(false);
  const [isQuestions, toggleQuestions] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(null);

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
    toggleQuestions(true)
  };

  const hideQuestions = () => {
    toggleQuestions(false);
  };

  const setQuestion = (change, value) => {
    change(questionNumber, value)
    hideQuestions();
  }

  const validateForm = values => {
    const errors = {};

    if (!values.recoveryQuestionOne) {
      errors.recoveryQuestionOne = 'Please Select Question';
    }
    if (!values.recoveryQuestionTwo) {
      errors.recoveryQuestionTwo = 'Please Select Question';
    }

    if (!values.recoveryAnswerOne) {
      errors.recoveryAnswerOne = 'Answer Field Should be Filled';
    }
    if (!values.recoveryAnswerTwo) {
      errors.recoveryAnswerTwo = 'Answer Field Should be Filled';
    }

    return errors;
  };

  const renderSkip = () => (
    <div className={classes.skip}>

      <FontAwesomeIcon icon='ban' className={classes.icon} />
      <FormHeader
        title='Sure You Want to Skip'
        subtitle={
          <p className={classes.subtitle}>
            If you choose to skip setting up you password recovery, and you
            loose your sign in formation, you will be unable to restore your
            account.
          </p>
        }
      />
      <Button variant='primary' className={classes.button} onClick={closeSkip}>
        SKIP ANYWAY
      </Button>
    </div>
  );

  const renderQuestionType = props => {
    const { input: { type, value, name }} = props;

    return (
     <div
        className={classes.header}
        onClick={() => showQuestions(name)}
      >
        <div className={classes.text}>
          {type === '1' ?
            value.question || 'Choose Recovery Question 1'
            :
            type === '2' ?
              value.question || 'Choose Recovery Question 2'
              : null
          }
        </div>
        <FontAwesomeIcon
          icon='chevron-right'
          className={classes.icon}
        />
      </div>
    )
  };

  const renderQuestionItem = props => {
    const { input: { name } } = props;
    const { change, getState } = useForm();

    const values = getState().values;
    const type = parseInt(name.type);
    const formSelectedOne = values && values.recoveryQuestionOne && parseInt(values.recoveryQuestionOne.type);
    const formSelectedTwo = values && values.recoveryQuestionTwo && parseInt(values.recoveryQuestionTwo.type);

    let isSelected = false;
    if (type === formSelectedOne) {
      isSelected = true;
    }
    if (type === formSelectedTwo) {
      isSelected = true;
    }

    return (
      <div
        className={classnames(classes.question, isSelected && classes.isSelected)}
        key={name}
        onClick={() => !isSelected && setQuestion(change, name)}
      >
        {name.question}
      </div>
    );
  };

  const renderFormItems = props => {
    const {
      handleSubmit, valid, submitting, values
    } = props;

    return (
      <form onSubmit={handleSubmit}>
        <div className={classes.formBox}>
          <div
            className={classnames(classes.box, isQuestions && classes.show)}
          >
            <FormHeader
              title='Setup Password Recovery'
              isDoubleColor
              header='One Last Thing!'
              subtitle='Set up your password recovery, so you don’t loose your account forever.'
            />
            <Field
              name='recoveryQuestionOne'
              type='1'
              disabled={loading}
              component={renderQuestionType}
              options={questions}
            />
            {values.recoveryQuestionOne && (
              <Field
                name='recoveryAnswerOne'
                type='text'
                placeholder='Answer'
                disabled={loading}
                component={Input}
              />
            )}
            <Field
              name='recoveryQuestionTwo'
              type='2'
              disabled={loading}
              component={renderQuestionType}
              options={questions}
            />
            {values.recoveryQuestionTwo && (
              <Field
                name='recoveryAnswerTwo'
                type='text'
                placeholder='Answer'
                disabled={loading}
                component={Input}
              />
            )}
            <Button
              htmltype='submit'
              variant='primary'
              className='w-100'
              onClick={handleSubmit}
              disabled={loading || !valid}
            >
              {(loading || submitting) ? <FontAwesomeIcon icon='spinner' spin /> : 'NEXT'}
            </Button>
            <p className={classes.skipButton} onClick={showSkip}>
              Skip
            </p>
          </div>
          <div
            className={classnames(classes.box, isQuestions && classes.show)}
          >
            <FormHeader
              title='Setup Password Recovery'
              isDoubleColor
              subtitle='Choose Recovery Question'
            />
            <Scrollbar
              style={{ height: '350px', marginBottom: '30px' }}
              thumbYProps={{ className: classes.scrollThumbY }}
              trackYProps={{ className: classes.scrollTrackY }}
            >
              {questions.map((item) => (
                <Field
                  name={item}
                  component={renderQuestionItem}
                  key={item.type}
                />
              ))}
            </Scrollbar>
          </div>
        </div>
      </form>
    );
  }

  const renderForm = () => (
    isSkip ? renderSkip() : (
      <Form
        onSubmit={(values) => {console.log(values)}} //todo: transform values data into appropriate format 
        validate={validateForm}
      >
        {renderFormItems}
      </Form>
    )
  );

  return (
    <ModalComponent
      show={show}
      backdrop='static'
      onClose={isSkip ? closeSkip : showSkip}
      isDanger={isSkip}
      closeButton={!isQuestions}
      title={
        (isQuestions || isSkip) && (
          <FontAwesomeIcon
            icon='arrow-left'
            className={classes.arrow}
            onClick={isQuestions ? hideQuestions : hideSkip}
          />
        )
      }
    >
      {renderForm()}
    </ModalComponent>
  );
}

export default PasswordRecoveryForm;
