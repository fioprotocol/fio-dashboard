import React, { useCallback } from 'react';

import { Form, Field } from 'react-final-form';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../../components/Input/TextInput';
import SubmitButton from '../../../../../components/common/SubmitButton/SubmitButton';
import {
  FioProfileActionBadge,
  ACTION_BUTTONS_NAMES,
} from '../../../../../components/FioProfileActionBadge';

import { currentYear } from '../../../../../utils';

import { ROUTES } from '../../../../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../../../../constants/queryParams';

import classes from './FioIdFooter.module.scss';

type Props = {
  fioBaseUrl: string;
};

type FormValues = {
  fch: string;
};

export const FioIdFooter: React.FC<Props> = props => {
  const { fioBaseUrl } = props;

  const submit = useCallback(
    (values: FormValues) => {
      const { fch } = values || {};
      let url = `${fioBaseUrl}${ROUTES.FIO_ADDRESSES_SELECTION}`;

      if (fch) {
        url = `${url}?${QUERY_PARAMS_NAMES.ADDRESS}=${fch}`;
      }

      window.open(url, '_blank');
    },
    [fioBaseUrl],
  );

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>
        Get your FIO Handle and start sharing everything you.
      </h1>
      <Form onSubmit={submit}>
        {formProps => (
          <form onSubmit={formProps.handleSubmit} className={classes.form}>
            <div className={classes.field}>
              <Field
                component={TextInput}
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                hasRegularHeight
                lowerCased
                name="fch"
                type="text"
                placeholder="Enter a Username"
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
              />
            </div>
            <div>
              <SubmitButton
                text="GET IT"
                isTransparent
                isWhiteBordered
                hasAutoWidth
                hasNoSidePaddings
                withoutMargin
                className={classes.button}
              />
            </div>
          </form>
        )}
      </Form>
      <div className={classes.actionBadge}>
        <FioProfileActionBadge
          fioBaseUrl={fioBaseUrl}
          actionButtons={[
            ACTION_BUTTONS_NAMES.LEARN_MORE_ABOUT_FIO,
            ACTION_BUTTONS_NAMES.MANAGE_FIO_HANDLE,
          ]}
        />
      </div>
      <div className={classes.links}>
        <a
          href={fioBaseUrl + ROUTES.PRIVACY_POLICY}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.linkItem}
        >
          Privacy Policy
        </a>
        <div className={classes.linkItemWithDevider}>
          <hr className={classes.divider} />
          <a
            href={fioBaseUrl + ROUTES.TERMS_OF_SERVICE}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.linkItem}
          >
            Terms of Service
          </a>
          <hr className={classes.divider} />
        </div>
        <p className={classes.linkItem}>© {currentYear()} FIO</p>
      </div>
    </div>
  );
};
