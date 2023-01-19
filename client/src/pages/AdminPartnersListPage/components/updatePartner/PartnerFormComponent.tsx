import React, { useCallback } from 'react';
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

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Input from '../../../../components/Input/Input';
import { PartnerFormDomainRow } from './PartnerFormDomainRow';

import { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { CONTAINED_FLOW_ACTIONS } from '../../../../constants/containedFlow';
import {
  PARTNER_LOGO_MAX_WIDTH,
  PARTNER_LOGO_MAX_HEIGHT,
  REF_PROFILE_TYPES_OPTIONS,
  REF_PROFILE_TYPE,
} from '../../../../constants/common';

import { RefProfile, RefProfileDomain } from '../../../../types';

import classes from '../../AdminPartnersListPage.module.scss';

type FieldsType = FieldArrayRenderProps<
  RefProfileDomain,
  HTMLElement
>['fields'];

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

  const onRemoveImage = useCallback(() => {
    form.change('settings.img' as keyof RefProfile, null);
    form.change('image' as keyof RefProfile, null);
  }, [form]);

  const onAddDomain = useCallback(() => {
    form.mutators.push('settings.domains', {
      name: '',
      isPremium: false,
      rank: 0,
    });
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

  const makeOnDragEndFunction = (fields: FieldsType) => (
    result: DropResult,
  ) => {
    if (!result.destination) {
      return;
    }
    const length = fields.value.length;
    const source = fields.value[result.source.index];
    const dest = fields.value[result.destination.index];

    fields.update(result.source.index, {
      ...source,
      rank: length - result.destination.index,
    });

    fields.update(result.destination.index, {
      ...dest,
      rank: length - result.source.index,
    });

    fields.swap(result.source.index, result.destination.index);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
          <Field
            type="text"
            name="regRefCode"
            component={Input}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            label="Reg Site Ref Code *"
            placeholder="Reg Site Ref Code"
            loading={validating}
            disabled={submitting || loading}
          />
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
                  <Button onClick={onRemoveImage} className={classes.removeImg}>
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
            type="text"
            name="regRefApiToken"
            component={Input}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            label="Registration site API token *"
            placeholder="Registration site API token"
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

            <Field
              type="hidden"
              name="settings.preselectedDomain"
              component={Input}
            />
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
                                    value={
                                      values?.settings?.domains[index].name
                                    }
                                    isDefault={
                                      values?.settings?.domains[index].name ===
                                      values?.settings?.preselectedDomain
                                    }
                                    isRemoveAvailable={
                                      values?.settings?.domains?.length > 1
                                    }
                                    onSetDefaultDomain={onSetDefaultDomain}
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
          loading || hasValidationErrors || validating || submitting || pristine
        }
        loading={loading || submitting}
      />
    </form>
  );
};
