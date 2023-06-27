import React, { useEffect } from 'react';

import { Field, FormRenderProps } from 'react-final-form';

import ActionContainer from '../../../../components/LinkTokenList/ActionContainer';
import { SocialMediaLinkItemComponent } from '../../../../components/SocialMediaLinkItemComponent';

import { ROUTES } from '../../../../constants/routes';
import { ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION } from '../../../../constants/fio';
import { CONTAINER_NAMES } from '../../../../components/LinkTokenList/constants';

import { FormValues } from '../../types';
import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';

import { SocialMediaLinkItem } from '../../../../constants/socialMediaLinks';
import {
  FioAddressWithPubAddresses,
  LinkActionResult,
} from '../../../../types';

import classes from './AddSocialMediaLinksForm.module.scss';

type Props = {
  bundleCost: number;
  fioCryptoHandleObj: FioAddressWithPubAddresses;
  formProps: FormRenderProps<FormValues>;
  socialMediaLinksList: SocialMediaLinkItem[];
  changeBundleCost: (bundle: number) => void;
  onRetry: (results: LinkActionResult) => void;
};

export const AddSocialMediaLinksForm: React.FC<Props> = props => {
  const {
    formProps: { handleSubmit, values, valid },
    socialMediaLinksList,
    changeBundleCost,
  } = props;

  useEffect(
    () =>
      changeBundleCost(
        Math.ceil(
          Object.keys(values).length / ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION,
        ),
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
        hasFullWidth={false}
        {...props}
      >
        <>
          <p className={classes.text}>
            Link social media accounts to your FIO Crypto Handle
          </p>
          {socialMediaLinksList.map(socialMediaLinkItem => (
            <SocialMediaLinkItemComponent
              {...socialMediaLinkItem}
              input={
                <Field
                  name={socialMediaLinkItem.name}
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
              key={socialMediaLinkItem.name}
              showInput
            />
          ))}
        </>
      </ActionContainer>
    </form>
  );
};
