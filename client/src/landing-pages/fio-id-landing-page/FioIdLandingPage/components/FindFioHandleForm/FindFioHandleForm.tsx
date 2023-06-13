import React from 'react';

import { Form, Field } from 'react-final-form';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../../components/Input/TextInput';

import classes from './FindFioHadleForm.module.scss';
import SubmitButton from '../../../../../components/common/SubmitButton/SubmitButton';

import { ROUTES } from '../../../../../constants/routes';

type Props = {
  fioBaseUrl: string;
};

export const FindFioHandleForm: React.FC<Props> = props => {
  const { fioBaseUrl } = props;

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Find a FIO Handle</h1>
      <p className={classes.subtitle}>
        Make payments, view NFT signatures or connect with on social media. All
        from a FIO Handle.
      </p>
      <Form onSubmit={() => null}>
        {formProps => (
          <form onSubmit={formProps.handleSubmit} className={classes.form}>
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
          </form>
        )}
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
