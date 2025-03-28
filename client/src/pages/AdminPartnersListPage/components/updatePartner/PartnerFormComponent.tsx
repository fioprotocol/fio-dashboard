import React, { useCallback, useEffect, useState } from 'react';
import { FormState } from 'final-form';
import { Field, FormRenderProps } from 'react-final-form';
import { FieldArray, FieldArrayRenderProps } from 'react-final-form-arrays';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import debounce from 'lodash/debounce';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Input from '../../../../components/Input/Input';
import DangerModal from '../../../../components/Modal/DangerModal';
import { PartnerFormDomainRow } from './PartnerFormDomainRow';
import { PartnerFormApiTokenRow } from './PartnerFormApiTokenRow';

import { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { CONTAINED_FLOW_ACTIONS } from '../../../../constants/containedFlow';
import {
  PARTNER_LOGO_MAX_WIDTH,
  PARTNER_LOGO_MAX_HEIGHT,
  REF_PROFILE_TYPES_OPTIONS,
  REF_PROFILE_TYPE,
} from '../../../../constants/common';
import { FIO_ACCOUNT_TYPES } from '../../../../constants/fio';
import { MORALIS_CHAIN_LIST_ARR } from '../../../../constants/ethereum';
import { ASSETS_SETTINGS_CHOICE } from '../../../../constants/ref';

import {
  FioAccountProfile,
  RefProfile,
  RefProfileDomain,
} from '../../../../types';

import classes from '../../AdminPartnersListPage.module.scss';
import api from '../../../../admin/api';

type FieldsType = FieldArrayRenderProps<
  RefProfileDomain,
  HTMLElement
>['fields'];

const RANK_REARRANGEMENT_DELAY_MS = 500;

export const PartnerFormComponent: React.FC<FormRenderProps<RefProfile> & {
  loading: boolean;
  fioAccountsProfilesList: FioAccountProfile[];
}> = props => {
  const {
    handleSubmit,
    validating,
    hasValidationErrors,
    submitting,
    pristine,
    form,
    values,
    fioAccountsProfilesList,
    loading,
  } = props;

  const [
    isRemoveApiTokenApproveModalVisible,
    setIsRemoveApiTokenApproveModalVisible,
  ] = useState(false);
  const [
    isRegenerateApiTokenApproveModalVisible,
    setIsRegenerateApiTokenApproveModalVisible,
  ] = useState(false);
  const [apiTokenToEdit, setApiTokenToEdit] = useState<{
    index: number;
    item?: Pick<RefProfile, 'apiTokens'>;
    remove?: (index: number) => void;
  } | null>(null);

  const fioAccountsProfilesOptions = fioAccountsProfilesList.map(
    fioAccountsProfile => ({
      id: fioAccountsProfile.id,
      name: `${fioAccountsProfile.name}: ${fioAccountsProfile.accountType ||
        FIO_ACCOUNT_TYPES.REGULAR}`,
    }),
  );

  useEffect(() => {
    const subscriptionFn = debounce((subscription: FormState<RefProfile>) => {
      if (!subscription.values) return;
      const items = subscription.values.settings.domains;
      items?.forEach((item, index) => {
        const expectedRank = index + 1;
        if (item.rank !== expectedRank) {
          form.mutators.update('settings.domains', index, {
            ...item,
            rank: expectedRank,
          });
        }
      });
    }, RANK_REARRANGEMENT_DELAY_MS);
    const unsubscribe = form.subscribe(subscriptionFn, { values: true });
    return () => {
      unsubscribe();
    };
  }, []);

  const onChange = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = function() {
        const img = document.createElement('img');
        img.src = reader.result as string;

        img.onload = function() {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > PARTNER_LOGO_MAX_WIDTH) {
              height *= PARTNER_LOGO_MAX_WIDTH / width;
              width = PARTNER_LOGO_MAX_WIDTH;
            }
          } else {
            if (height > PARTNER_LOGO_MAX_HEIGHT) {
              width *= PARTNER_LOGO_MAX_HEIGHT / height;
              height = PARTNER_LOGO_MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          form.change(
            'settings.img' as keyof RefProfile,
            canvas.toDataURL(file.type) as RefProfile[keyof RefProfile],
          );
        };
      };
      reader.readAsDataURL(file);
    },
    [form],
  );

  const onGenerateApiToken = useCallback(async () => {
    const apiToken = await api.admin.createPartnerApiToken();

    form.mutators.push('apiTokens' as keyof RefProfile, {
      token: apiToken,
      access: true,
      dailyFreeLimit: null,
    });
  }, [form]);

  const onRegenerateApiTokenConfirm = useCallback(
    async (index: number, item: Pick<RefProfile, 'apiTokens'>) => {
      setIsRegenerateApiTokenApproveModalVisible(true);
      setApiTokenToEdit({ index, item });
    },
    [],
  );
  const onRegenerateApiToken = useCallback(async () => {
    setIsRegenerateApiTokenApproveModalVisible(false);
    const apiToken = await api.admin.createPartnerApiToken();

    form.mutators.update('apiTokens', apiTokenToEdit.index, {
      ...apiTokenToEdit.item,
      token: apiToken,
    });
  }, [form, apiTokenToEdit]);

  const onRemoveApiTokenConfirm = useCallback(async (index, remove) => {
    setIsRemoveApiTokenApproveModalVisible(true);
    setApiTokenToEdit({ index, remove });
  }, []);

  const onRemoveApiToken = useCallback(async () => {
    setIsRemoveApiTokenApproveModalVisible(false);
    apiTokenToEdit.remove(apiTokenToEdit.index);
  }, [apiTokenToEdit]);

  const onRemoveImage = useCallback(() => {
    form.change('settings.img' as keyof RefProfile, null);
    form.change('image' as keyof RefProfile, null);
  }, [form]);

  const onAddDomain = useCallback(() => {
    const fieldKey = 'settings.domains' as keyof RefProfile;
    const numberOfDomains = form.getFieldState(fieldKey).length;
    form.mutators.push('settings.domains', {
      name: '',
      isPremium: false,
      rank: numberOfDomains + 1,
      isFirstRegFree: false,
      expirationDate: null,
    });
  }, [form]);

  const makeOnDragEndFunction = (fields: FieldsType) => (
    result: DropResult,
  ) => {
    if (!result.destination) {
      return;
    }
    fields.move(result.source.index, result.destination.index);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Field
          type="dropdown"
          name="type"
          component={Input}
          options={REF_PROFILE_TYPES_OPTIONS}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorColor={COLOR_TYPE.WARN}
          label="Type *"
          placeholder="Type"
          loading={validating}
          disabled={submitting || loading}
        />
        <Field
          type="text"
          name="label"
          component={Input}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorColor={COLOR_TYPE.WARN}
          label="Name *"
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
          label="Referral Code *"
          placeholder="Referral Code"
          loading={validating}
          disabled={!!values?.id || submitting || loading}
        />
        {values?.type === REF_PROFILE_TYPE.REF && (
          <>
            <div className="d-flex flex-column align-self-start mb-4">
              <span className={classes.label}>Wallet logo</span>
              <div
                className={classnames(
                  classes.imageContainer,
                  'd-flex',
                  'flex-row',
                )}
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
                <div className={classes.previewImageWrapper}>
                  {values?.settings?.img && (
                    <img
                      className={classes.previewImage}
                      src={values?.settings?.img}
                      alt={values.label}
                    />
                  )}
                  {values?.settings?.img && (
                    <Button
                      onClick={onRemoveImage}
                      className={classes.removeImg}
                    >
                      <FontAwesomeIcon
                        icon="times-circle"
                        onClick={onRemoveImage}
                      />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <Field
              type="dropdown"
              name="freeFioAccountProfileId"
              component={Input}
              options={fioAccountsProfilesOptions}
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              label="FIO Account Profile for Free Registrations *"
              placeholder="Select..."
              loading={validating}
              disabled={submitting || loading}
            />
            <Field
              type="dropdown"
              name="paidFioAccountProfileId"
              component={Input}
              options={fioAccountsProfilesOptions}
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              label="FIO Account Profile for Paid Registrations *"
              placeholder="Select..."
              loading={validating}
              disabled={submitting || loading}
            />
          </>
        )}
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
        {values?.type === REF_PROFILE_TYPE.REF && (
          <>
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
                  render={({ fields }) => (
                    <DragDropContext onDragEnd={makeOnDragEndFunction(fields)}>
                      <Droppable droppableId="settings.domains">
                        {provided => (
                          <div ref={provided.innerRef}>
                            {fields.map((field, index) => (
                              <Draggable
                                index={index}
                                key={field}
                                draggableId={field}
                              >
                                {provided => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="d-flex align-items-center border border-light px-2 py-3 rounded"
                                  >
                                    <PartnerFormDomainRow
                                      key={field}
                                      index={index}
                                      field={field}
                                      isRemoveAvailable={
                                        values?.settings?.domains?.length > 1
                                      }
                                      onRemove={fields.remove}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                />
              </div>
            </div>

            <div className="d-flex align-self-start mb-4">
              <Field
                name="settings.isBranded"
                type="checkbox"
                component={Input}
                label="Partner branded"
              />
            </div>
            <div className="d-flex align-self-start mb-4">
              <Field
                name="settings.hasNoProfileFlow"
                type="checkbox"
                component={Input}
                label="No profile (legacy reg site)"
              />
            </div>

            <div className="d-flex align-self-start mb-4">
              <Field
                name="settings.gatedRegistration.isOn"
                type="checkbox"
                component={Input}
                label="Gated Registration"
              />
            </div>

            {values.settings?.gatedRegistration?.isOn && (
              <>
                <Field
                  type="dropdown"
                  name="settings.gatedRegistration.params.chainId"
                  component={Input}
                  options={MORALIS_CHAIN_LIST_ARR}
                  uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  errorColor={COLOR_TYPE.WARN}
                  label="Chain"
                  placeholder="Select..."
                  loading={validating}
                  disabled={submitting || loading}
                />
                <Field
                  type="dropdown"
                  name="settings.gatedRegistration.params.asset"
                  component={Input}
                  options={ASSETS_SETTINGS_CHOICE}
                  uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  errorColor={COLOR_TYPE.WARN}
                  label="Asset"
                  placeholder="Select..."
                  loading={validating}
                  disabled={submitting || loading}
                />
                <Field
                  type="text"
                  name="settings.gatedRegistration.params.contractAddress"
                  component={Input}
                  uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  errorColor={COLOR_TYPE.WARN}
                  label="Contract Address"
                  placeholder="Set Contract Address"
                  loading={validating}
                  disabled={submitting || loading}
                />
              </>
            )}

            <div className="d-flex align-self-start mb-4">
              <Field
                name="apiAccess"
                type="checkbox"
                component={Input}
                label="Api Access"
              />
            </div>

            {values.apiAccess && (
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
                <div className="d-flex justify-content-between">
                  <span className={classes.label} />
                  <Button className="w-auto mb-4" onClick={onGenerateApiToken}>
                    <FontAwesomeIcon icon="plus-square" className="mr-2" />{' '}
                    Generate New API Key
                  </Button>
                </div>
                <div className="d-flex flex-column">
                  <FieldArray
                    name="apiTokens"
                    render={({ fields }) => (
                      <>
                        {fields.map((field, index) => (
                          <PartnerFormApiTokenRow
                            key={field}
                            index={index}
                            field={field}
                            token={fields.value[index].token}
                            legacyHash={fields.value[index].legacyHash}
                            onRegenerate={() =>
                              onRegenerateApiTokenConfirm(index, {
                                ...fields.value[index],
                              })
                            }
                            onRemove={() =>
                              onRemoveApiTokenConfirm(index, fields.remove)
                            }
                          />
                        ))}
                      </>
                    )}
                  />
                </div>
              </div>
            )}

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
              <Field
                type="text"
                name={`settings.actions[${CONTAINED_FLOW_ACTIONS.SIGNNFT}].title`}
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
                name={`settings.actions[${CONTAINED_FLOW_ACTIONS.SIGNNFT}].subtitle`}
                component={Input}
                uiType={INPUT_UI_STYLES.BLACK_WHITE}
                errorColor={COLOR_TYPE.WARN}
                label="Sub Title"
                placeholder="Sub Title"
                loading={validating}
                disabled={submitting || loading}
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
                disabled={submitting || loading}
              />
              <Field
                name={`settings.actions[${CONTAINED_FLOW_ACTIONS.SIGNNFT}].hideActionText`}
                type="checkbox"
                component={Input}
                label="Hide Action Text"
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
              <span className={classes.label}>Registration</span>
              <Field
                type="text"
                name={`settings.actions[${CONTAINED_FLOW_ACTIONS.REG}].title`}
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
                name={`settings.actions[${CONTAINED_FLOW_ACTIONS.REG}].subtitle`}
                component={Input}
                uiType={INPUT_UI_STYLES.BLACK_WHITE}
                errorColor={COLOR_TYPE.WARN}
                label="Sub Title"
                placeholder="Sub Title"
                loading={validating}
                disabled={submitting || loading}
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
                disabled={submitting || loading}
              />
              <Field
                name={`settings.actions[${CONTAINED_FLOW_ACTIONS.REG}].hideActionText`}
                type="checkbox"
                component={Input}
                label="Hide Action Text"
                disabled={submitting || loading}
              />
            </div>
          </>
        )}
        <SubmitButton
          text={loading ? 'Saving' : 'Save'}
          disabled={
            loading ||
            hasValidationErrors ||
            validating ||
            submitting ||
            pristine
          }
          loading={loading || submitting}
        />
      </form>
      <DangerModal
        show={isRemoveApiTokenApproveModalVisible}
        onClose={() => setIsRemoveApiTokenApproveModalVisible(false)}
        onActionButtonClick={onRemoveApiToken}
        title="Do you really want to delete API token?"
        showCancel={true}
        buttonText="Yes"
        cancelButtonText="Cancel"
      />
      <DangerModal
        show={isRegenerateApiTokenApproveModalVisible}
        onClose={() => setIsRegenerateApiTokenApproveModalVisible(false)}
        onActionButtonClick={onRegenerateApiToken}
        title="Do you really want to generate new API token?"
        showCancel={true}
        buttonText="Yes"
        cancelButtonText="Cancel"
      />
    </>
  );
};
