import React, { useCallback, useEffect } from 'react';

import { Field, FormRenderProps } from 'react-final-form';
import { OnBlur } from 'react-final-form-listeners';

import ActionContainer from '../../../../components/LinkTokenList/ActionContainer';
import { SocialMediaLinkItemComponent } from '../../../../components/SocialMediaLinkItemComponent';
import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';

import { ROUTES } from '../../../../constants/routes';
import { ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION } from '../../../../constants/fio';
import { CONTAINER_NAMES } from '../../../../components/LinkTokenList/constants';

import { extractLastValueFormUrl, isURL } from '../../../../util/general';
import MathOp from '../../../../util/math';

import { FormValues } from '../../types';
import {
  FioAddressWithPubAddresses,
  SocialMediaLinkItem,
  SocialMediaLinkIdProp,
} from '../../../../types';

import classes from './AddSocialMediaLinksForm.module.scss';

type Props = {
  bundleCost: number;
  fioCryptoHandleObj: FioAddressWithPubAddresses;
  formProps: FormRenderProps<FormValues>;
  socialMediaLinksList: SocialMediaLinkItem[];
  changeBundleCost: (bundle: number) => void;
};

export const AddSocialMediaLinksForm: React.FC<Props> = props => {
  const {
    formProps: { handleSubmit, values, valid, form },
    socialMediaLinksList,
    changeBundleCost,
  } = props;

  const formatInputValue = useCallback(
    (fieldName: SocialMediaLinkIdProp) => {
      const { value } = form.getFieldState(fieldName) || {};

      let valueToFormat = value;

      if (isURL(valueToFormat)) {
        valueToFormat = extractLastValueFormUrl(valueToFormat);
      }
      if (valueToFormat && valueToFormat.startsWith('@')) {
        valueToFormat = value.substr(1);
      }

      form.change(fieldName, valueToFormat);
    },
    [form],
  );

  useEffect(
    () =>
      changeBundleCost(
        new MathOp(Object.keys(values).length)
          .div(ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION)
          .round(0, 3)
          .toNumber(),
      ),
    [changeBundleCost, values],
  );

  return (
    <form onSubmit={handleSubmit}>
      <ActionContainer
        onActionButtonClick={handleSubmit}
        isDisabled={!valid}
        containerName={CONTAINER_NAMES.ADD_SOCIAL_MEDIA}
        link={ROUTES.FIO_SOCIAL_MEDIA_LINKS}
        hasFullWidth
        {...props}
      >
        <>
          <p className={classes.text}>
            Link social media accounts to your FIO Handle
          </p>
          {socialMediaLinksList.map(socialMediaLinkItem => (
            <div key={socialMediaLinkItem.name}>
              <SocialMediaLinkItemComponent
                {...socialMediaLinkItem}
                input={
                  <Field
                    name={socialMediaLinkItem.tokenName}
                    type="text"
                    component={TextInput}
                    placeholder="Enter username"
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
                    showPasteButton
                    isLowHeight
                    withoutBottomMargin
                  />
                }
                showInput
              />
              <OnBlur name={socialMediaLinkItem.tokenName}>
                {() => formatInputValue(socialMediaLinkItem.tokenName)}
              </OnBlur>
            </div>
          ))}
        </>
      </ActionContainer>
    </form>
  );
};
