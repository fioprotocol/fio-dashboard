import React from 'react';

import {
  CONTAINED_FLOW_ACTION_TEXT,
  CONTAINED_FLOW_SUBTITLES,
  CONTAINED_FLOW_TITLES,
} from '../constants/containedFlow';
import { DEFAULT_DOMAIN_NAME } from '../constants/ref';

import { removeExtraCharactersFromString } from './general';

import {
  ContainedFlowQueryParams,
  RefProfile,
  ContainedFlowActionSettingsKey,
} from '../types';
import { REF_PROFILE_TYPE } from '../constants/common';

type DefaultContentProps = string | null;

export const handleHomePageContent = ({
  isContainedFlow,
  containedFlowQueryParams,
  refProfileInfo,
}: {
  isContainedFlow: boolean;
  containedFlowQueryParams: ContainedFlowQueryParams;
  refProfileInfo: RefProfile;
}): {
  logoSrc: DefaultContentProps;
  title: DefaultContentProps | React.ReactElement;
  subtitle: DefaultContentProps;
  actionText: DefaultContentProps;
  hasMinHeight: boolean;
  showSignInWidget: boolean;
  initialValues: { domain?: string };
  isDarkWhite?: boolean;
  isAffiliate?: boolean;
} => {
  let title = null;
  let subtitle = null;
  let logoSrc = null;
  let actionText = null;
  let initialValues = null;
  let isDarkWhite = false;
  const actionName = removeExtraCharactersFromString(
    containedFlowQueryParams?.action,
  )?.toUpperCase();

  if (refProfileInfo?.settings) {
    const {
      settings: { img, actions, domains },
      subTitle,
      title: refTitle,
    } = refProfileInfo;

    logoSrc = img;

    initialValues = {
      domain: domains[0]?.name,
    };

    if (isContainedFlow) {
      title =
        actions?.[actionName as ContainedFlowActionSettingsKey]?.title ||
        CONTAINED_FLOW_TITLES[actionName] ||
        '';
      subtitle =
        actions?.[actionName as ContainedFlowActionSettingsKey]?.subtitle ||
        CONTAINED_FLOW_SUBTITLES[actionName] ||
        '';
      actionText = actions?.[actionName as ContainedFlowActionSettingsKey]
        ?.hideActionText
        ? null
        : actions?.[actionName as ContainedFlowActionSettingsKey]?.actionText ||
          CONTAINED_FLOW_ACTION_TEXT[actionName];
    } else {
      title = refTitle;
      subtitle = subTitle;
    }
  }

  if (isContainedFlow && !refProfileInfo) {
    title = CONTAINED_FLOW_TITLES[actionName];
    subtitle = CONTAINED_FLOW_SUBTITLES[actionName];
    actionText = CONTAINED_FLOW_ACTION_TEXT[actionName];
  }

  if (refProfileInfo && refProfileInfo.type === REF_PROFILE_TYPE.REF) {
    title = title ? title : `Claim your @${DEFAULT_DOMAIN_NAME} web3 name!`;
    subtitle = subtitle
      ? subtitle
      : 'Replace all of your public wallet addresses with a single, secure, customizable handle.';
  }

  isDarkWhite =
    (!!refProfileInfo && refProfileInfo.type === REF_PROFILE_TYPE.REF) ||
    isContainedFlow;

  return {
    logoSrc,
    title,
    subtitle,
    actionText,
    hasMinHeight: isContainedFlow,
    showSignInWidget: isContainedFlow,
    initialValues,
    isDarkWhite,
    isAffiliate:
      !!refProfileInfo && refProfileInfo.type === REF_PROFILE_TYPE.AFFILIATE,
  };
};
