import React, { useCallback } from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { FieldArray, FieldArrayRenderProps } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import DeleteIcon from '@mui/icons-material/Delete';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import DangerModal from '../../../../components/Modal/DangerModal';
import TextInput, {
  INPUT_UI_STYLES as TEXT_INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { FIO_ACCOUNT_TYPES_OPTIONS } from '../../../../constants/fio';

import { formValidation } from './validation';

import { FormValuesProps } from '../../types';
import { FioAccountProfile } from '../../../../types';

import classes from './AccountProfileForm.module.scss';

type Props = {
  onSubmit: (values: FormValuesProps) => void;
  loading: boolean;
  initialValues?: FioAccountProfile;
  showWarningModal: boolean;
  dangerModaActionClick: (vaues: FormValuesProps) => void;
  toggleShowWarningModal: (showModal: boolean) => void;
};

type FieldsType = FieldArrayRenderProps<string[], HTMLElement>['fields'];

const FIELD_ARRAY_KEY = 'domains';

const AccountProfileForm: React.FC<Props> = props => {
  const {
    onSubmit,
    loading,
    initialValues,
    showWarningModal,
    dangerModaActionClick,
    toggleShowWarningModal,
  } = props;

  const RenderForm = ({
    formProps,
  }: {
    formProps: FormRenderProps<FormValuesProps>;
  }) => {
    const {
      handleSubmit,
      validating,
      hasValidationErrors,
      submitting,
      pristine,
      values,
      form,
    } = formProps;

    const onClose = useCallback(() => {
      toggleShowWarningModal(false);
    }, []);

    const onActionClick = useCallback(() => {
      dangerModaActionClick(values);
    }, [values]);

    const addNewEntry = useCallback(() => {
      form.mutators.push(FIELD_ARRAY_KEY, '');
    }, [form]);

    const removeEntry = useCallback((index: number, fields: FieldsType) => {
      fields.remove(index);
    }, []);

    return (
      <>
        <form onSubmit={handleSubmit}>
          <Field
            type="text"
            name="name"
            component={Input}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            placeholder="Enter Account Profile name"
            loading={validating}
            disabled={submitting || loading}
          />
          <Field
            type="text"
            name="actor"
            component={Input}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            placeholder="Enter actor"
            loading={validating}
            disabled={submitting || loading}
          />
          <Field
            type="text"
            name="permission"
            component={Input}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            placeholder="Enter permission"
            loading={validating}
            disabled={submitting || loading}
          />
          <Field
            type="dropdown"
            name="accountType"
            component={Input}
            options={FIO_ACCOUNT_TYPES_OPTIONS}
            errorColor={COLOR_TYPE.WARN}
            uiType={INPUT_UI_STYLES.BLACK_VIOLET}
            placeholder="Set Account Type"
            disabled={submitting || loading}
          />
          <div className={classes.domainsContainer}>
            <div className={classes.actionContainer}>
              <h5 className={classes.subtitle}>Controlled Domains</h5>
              <SubmitButton
                hasLowHeight
                hasAutoWidth
                isBlack
                onClick={addNewEntry}
                text="Add domain"
              />
            </div>
            <FieldArray name={FIELD_ARRAY_KEY}>
              {({ fields }) =>
                fields.map((name, index) => (
                  <div key={name} className={classes.fieldContainer}>
                    <div className={classes.field}>
                      <Field
                        component={TextInput}
                        lowerCased
                        name={`${name}`}
                        placeholder="Set domain to register by this account"
                        type="text"
                        uiType={TEXT_INPUT_UI_STYLES.BLACK_WHITE}
                        withoutBottomMargin
                      />
                    </div>

                    <SubmitButton
                      isRed
                      hasLowHeight
                      hasAutoWidth
                      onClick={() => removeEntry(index, fields)}
                      text={<DeleteIcon />}
                    />
                  </div>
                ))
              }
            </FieldArray>
          </div>
          <SubmitButton
            text={
              loading
                ? initialValues
                  ? 'Updating'
                  : 'Creating'
                : initialValues
                ? 'Update'
                : 'Create'
            }
            disabled={
              loading ||
              hasValidationErrors ||
              validating ||
              submitting ||
              pristine
            }
            loading={loading || submitting}
            withTopMargin
          />
          <DangerModal
            show={showWarningModal}
            title="Account type warnings"
            subtitle={`You already have ${values?.accountType} account. Would you like to replace it with this one?`}
            onClose={onClose}
            buttonText="Yes"
            cancelButtonText="No"
            showCancel
            onActionButtonClick={onActionClick}
          />
        </form>
      </>
    );
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={formValidation.validateForm}
      mutators={{ ...arrayMutators }}
    >
      {formProps => <RenderForm formProps={formProps} />}
    </Form>
  );
};

export default AccountProfileForm;
