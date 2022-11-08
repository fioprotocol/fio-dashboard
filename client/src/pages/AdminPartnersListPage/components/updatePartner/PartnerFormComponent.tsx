import React, { useCallback } from 'react';
import { Field, FormRenderProps } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Input from '../../../../components/Input/Input';
import { PartnerFormDomainRow } from './PartnerFormDomainRow';

import { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { CONTAINED_FLOW_ACTIONS } from '../../../../constants/containedFlow';

import { RefProfile } from '../../../../types';

import classes from '../../AdminPartnersListPage.module.scss';

export const PartnerFormComponent: React.FC<FormRenderProps<
  RefProfile
>> = props => {
  const {
    handleSubmit,
    validating,
    hasValidationErrors,
    submitting,
    pristine,
    form,
    values,
    // Passed non-API props don't work with typescript
    // @ts-ignore
    loading,
  } = props;

  const onChange = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = function() {
        form.change(
          'settings.img' as keyof RefProfile,
          reader.result as RefProfile[keyof RefProfile],
        );
      };
      reader.readAsDataURL(file);
    },
    [form],
  );

  const onAddDomain = useCallback(() => {
    form.mutators.push('settings.domains');
  }, [form]);

  const onSetDefaultDomain = useCallback(
    (domain: string) => {
      form.change(
        'settings.preselectedDomain' as keyof RefProfile,
        domain as RefProfile[keyof RefProfile],
      );
    },
    [form],
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit}>
      <Field
        type="text"
        name="label"
        component={Input}
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorColor={COLOR_TYPE.WARN}
        label="Name"
        placeholder="Name"
        loading={validating}
        disabled={submitting || loading}
      />
      <Field
        type="text"
        name="code"
        component={Input}
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorColor={COLOR_TYPE.WARN}
        label="Referral Code"
        placeholder="Referral Code"
        loading={validating}
        disabled={!!values?.id || submitting || loading}
      />
      <div className="d-flex flex-column align-self-start mb-4">
        <span className={classes.label}>Wallet logo</span>
        <div
          className={classnames(classes.imageContainer, 'd-flex', 'flex-row')}
        >
          <Field
            type="file"
            name="image"
            accept="image/*"
            component={Input}
            customChange={onChange}
            label="Wallet logo"
            placeholder="Choose a file or drop it here..."
            showPreview={false}
            loading={validating}
            disabled={submitting || loading}
          />
          <div className="d-flex align-items-center">
            {values?.settings?.img && (
              <img
                className={classes.previewImage}
                src={values?.settings?.img}
                alt={values.label}
              />
            )}
          </div>
        </div>
      </div>
      <Field
        type="text"
        name="regRefApiToken"
        component={Input}
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorColor={COLOR_TYPE.WARN}
        label="Registration site API token"
        placeholder="Registration site API token"
        loading={validating}
        disabled={submitting || loading}
      />
      <Field
        type="text"
        name="tpid"
        component={Input}
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorColor={COLOR_TYPE.WARN}
        label="TPID"
        placeholder="TPID"
        loading={validating}
        disabled={submitting || loading}
      />
      <Field
        type="text"
        name="settings.link"
        component={Input}
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorColor={COLOR_TYPE.WARN}
        label="Redirect URL"
        placeholder="Redirect URL"
        loading={validating}
        disabled={submitting || loading}
      />
      <div className="d-flex flex-column align-self-start mb-4 w-100">
        <div className="d-flex justify-content-between">
          <span className={classes.label}>Domains</span>
          <Button className="w-auto mb-4" onClick={onAddDomain}>
            <FontAwesomeIcon icon="plus-square" className="mr-2" /> Add
          </Button>
        </div>

        <div className="d-flex flex-column">
          <FieldArray
            name="settings.domains"
            render={({ fields }) =>
              fields.map((field, index) => (
                <PartnerFormDomainRow
                  key={field}
                  field={field}
                  index={index}
                  value={values?.settings?.domains[index]}
                  isDefault={
                    values?.settings?.domains[index] ===
                    values?.settings?.preselectedDomain
                  }
                  onSetDefaultDomain={onSetDefaultDomain}
                  onRemove={fields.remove}
                />
              ))
            }
          />
        </div>
      </div>
      <div className="d-flex align-self-start mb-4">
        <Field
          name="settings.allowCustomDomain"
          type="checkbox"
          component={Input}
          label="Allow custom domain registration"
        />
      </div>

      <div className="d-flex align-self-start mb-2">
        <span className={classes.label}>Landing Page text</span>
      </div>
      <div
        className={classnames(
          classes.landingTextsContainer,
          'd-flex',
          'flex-column',
          'align-self-start',
          'w-100',
          'mb-3',
        )}
      >
        <span className={classes.label}>Regular</span>
        <Field
          type="text"
          name="title"
          component={Input}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorColor={COLOR_TYPE.WARN}
          label="Title"
          placeholder="Title"
          loading={validating}
          disabled={submitting || loading}
        />
        <Field
          type="text"
          name="subTitle"
          component={Input}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorColor={COLOR_TYPE.WARN}
          label="Sub Title"
          placeholder="Sub Title"
          loading={validating}
          disabled={submitting || loading}
        />
      </div>

      <div
        className={classnames(
          classes.landingTextsContainer,
          'd-flex',
          'flex-column',
          'align-self-start',
          'w-100',
          'mb-3',
        )}
      >
        <span className={classes.label}>Sign NFT</span>
        <div className="mb-2">
          <Field
            name={`settings.actions[${CONTAINED_FLOW_ACTIONS.SIGNNFT}].enabled`}
            type="checkbox"
            component={Input}
            label="Enabled"
          />
        </div>
        <Field
          type="text"
          name={`settings.actions[${CONTAINED_FLOW_ACTIONS.SIGNNFT}].title`}
          component={Input}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorColor={COLOR_TYPE.WARN}
          label="Title"
          placeholder="Title"
          loading={validating}
          disabled={
            !values?.settings?.actions?.SIGNNFT?.enabled ||
            submitting ||
            loading
          }
        />
        <Field
          type="text"
          name={`settings.actions[${CONTAINED_FLOW_ACTIONS.SIGNNFT}].subtitle`}
          component={Input}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorColor={COLOR_TYPE.WARN}
          label="Sub Title"
          placeholder="Sub Title"
          loading={validating}
          disabled={
            !values?.settings?.actions?.SIGNNFT?.enabled ||
            submitting ||
            loading
          }
        />
        <Field
          type="text"
          name={`settings.actions[${CONTAINED_FLOW_ACTIONS.SIGNNFT}].actionText`}
          component={Input}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorColor={COLOR_TYPE.WARN}
          label="Action Text"
          placeholder="Action Text"
          loading={validating}
          disabled={
            !values?.settings?.actions?.SIGNNFT?.enabled ||
            submitting ||
            loading
          }
        />
        <Field
          name={`settings.actions[${CONTAINED_FLOW_ACTIONS.SIGNNFT}].hideActionText`}
          type="checkbox"
          component={Input}
          label="Hide Action Text"
          disabled={
            !values?.settings?.actions?.SIGNNFT?.enabled ||
            submitting ||
            loading
          }
        />
      </div>

      <div
        className={classnames(
          classes.landingTextsContainer,
          'd-flex',
          'flex-column',
          'align-self-start',
          'w-100',
          'mb-3',
        )}
      >
        <span className={classes.label}>Registration</span>
        <div className="mb-2">
          <Field
            name={`settings.actions[${CONTAINED_FLOW_ACTIONS.REG}].enabled`}
            type="checkbox"
            component={Input}
            label="Enabled"
          />
        </div>
        <Field
          type="text"
          name={`settings.actions[${CONTAINED_FLOW_ACTIONS.REG}].title`}
          component={Input}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorColor={COLOR_TYPE.WARN}
          label="Title"
          placeholder="Title"
          loading={validating}
          disabled={
            !values?.settings?.actions?.REG?.enabled || submitting || loading
          }
        />
        <Field
          type="text"
          name={`settings.actions[${CONTAINED_FLOW_ACTIONS.REG}].subtitle`}
          component={Input}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorColor={COLOR_TYPE.WARN}
          label="Sub Title"
          placeholder="Sub Title"
          loading={validating}
          disabled={
            !values?.settings?.actions?.REG?.enabled || submitting || loading
          }
        />
        <Field
          type="text"
          name={`settings.actions[${CONTAINED_FLOW_ACTIONS.REG}].actionText`}
          component={Input}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorColor={COLOR_TYPE.WARN}
          label="Action Text"
          placeholder="Action Text"
          loading={validating}
          disabled={
            !values?.settings?.actions?.REG?.enabled || submitting || loading
          }
        />
        <Field
          name={`settings.actions[${CONTAINED_FLOW_ACTIONS.REG}].hideActionText`}
          type="checkbox"
          component={Input}
          label="Hide Action Text"
          disabled={
            !values?.settings?.actions?.REG?.enabled || submitting || loading
          }
        />
      </div>
      <SubmitButton
        text={loading ? 'Saving' : 'Save'}
        disabled={
          loading || hasValidationErrors || validating || submitting || pristine
        }
        loading={loading || submitting}
      />
    </form>
  );
};
