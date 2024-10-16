import React, { useCallback } from 'react';

import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import classnames from 'classnames';

import { FIOSDK } from '@fioprotocol/fiosdk';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../../components/Input/TextInput';
import SubmitButton from '../../../../../components/common/SubmitButton/SubmitButton';
import NotificationBadge from '../../../../../components/NotificationBadge';

import apis from '../../../api';

import { BADGE_TYPES } from '../../../../../components/Badge/Badge';
import { ROUTES } from '../../../../../constants/routes';

import classes from './FindFioHandleForm.module.scss';

type Props = {
  fioBaseUrl: string;
  setFch: (fch: string) => void;
};

type FormProps = {
  fch: string;
};

export const FindFioHandleForm: React.FC<Props> = props => {
  const { fioBaseUrl, setFch } = props;

  const submit = useCallback(
    async (values: FormProps) => {
      const { fch } = values || {};

      if (!fch) return;

      let errors;

      try {
        FIOSDK.isFioAddressValid(fch);

        const isAvail = await apis.fio.availCheck(fch);

        if (isAvail && isAvail.is_registered === 1) {
          window.history.pushState({}, null, `/${fch}`);
          setFch(fch);
          return;
        } else {
          return { [FORM_ERROR]: 'FIO Handle is not registered' };
        }
      } catch (error) {
        errors = error;
      }

      return errors;
    },
    [setFch],
  );

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Find a FIO Handle</h1>
      <p className={classes.subtitle}>
        Make payments, view NFT signatures or connect with on social media. All
        from a FIO Handle.
      </p>
      <Form onSubmit={submit}>
        {formProps => {
          const {
            dirtySinceLastSubmit,
            handleSubmit,
            hasSubmitErrors,
          } = formProps;
          const hasError = hasSubmitErrors && !dirtySinceLastSubmit;

          return (
            <form onSubmit={handleSubmit} className={classes.form}>
              <div
                className={classnames(
                  classes.notification,
                  hasError && classes.hasError,
                )}
              >
                <NotificationBadge
                  hasNewDesign
                  type={BADGE_TYPES.RED}
                  show={hasError}
                  message="Please check the FIO Handle below and try again."
                  title="Doesn’t Exist"
                  marginTopZero
                  marginBottomZero
                />
              </div>
              <div
                className={classnames(
                  classes.fieldContainer,
                  hasError && classes.hasError,
                )}
              >
                <div className={classes.field}>
                  <Field
                    name="fch"
                    type="text"
                    component={TextInput}
                    placeholder="Enter a FIO Handle"
                    uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                    colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                    lowerCased
                    hideError="true"
                    isMiddleHeight
                  />
                </div>
                <div>
                  <SubmitButton
                    text="Look it Up!"
                    isLightBlack
                    hasAutoWidth
                    hasLowHeight
                    hasSmallText
                    withoutMargin
                    className={classes.button}
                  />
                </div>
              </div>
            </form>
          );
        }}
      </Form>
      <p className={classes.actionText}>
        Want your own?{' '}
        <a
          href={fioBaseUrl + ROUTES.FIO_ADDRESSES_SELECTION}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
        >
          Get One!
        </a>
      </p>
    </div>
  );
};
