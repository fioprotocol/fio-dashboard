import {
  CONTAINED_FLOW_ACTION_TEXT,
  CONTAINED_FLOW_SUBTITLES,
  CONTAINED_FLOW_TITLES,
} from '../constants/containedFlow';

import { removeExtraCharactersFromString } from '../util/general';

import {
  ContainedFlowQueryParams,
  RefProfile,
  ContainedFlowActionSettingsKey,
} from '../types';

export const handleHomePageContent = ({
  isContainedFlow,
  containedFlowQueryParams,
  refProfileInfo,
}: {
  isContainedFlow: boolean;
  containedFlowQueryParams: ContainedFlowQueryParams;
  refProfileInfo: RefProfile;
}) => {
  let title = null;
  let subtitle = null;
  let logoSrc = null;
  const actionName = removeExtraCharactersFromString(
    containedFlowQueryParams?.action,
  );

  if (refProfileInfo?.settings) {
    const {
      settings: { img, actions },
      subTitle,
      title: refTitle,
    } = refProfileInfo;

    logoSrc = img;

    if (isContainedFlow) {
      title =
        actions[actionName as ContainedFlowActionSettingsKey]?.title ||
        CONTAINED_FLOW_TITLES[actionName];
      subtitle =
        actions[actionName as ContainedFlowActionSettingsKey].subtitle ||
        CONTAINED_FLOW_SUBTITLES[actionName];
    } else {
      title = refTitle;
      subtitle = subTitle;
    }
  }

  if (isContainedFlow && !refProfileInfo) {
    title = CONTAINED_FLOW_TITLES[actionName];
    subtitle = CONTAINED_FLOW_SUBTITLES[actionName];
  }

  return {
    logoSrc,
    title,
    subtitle,
    actionText: CONTAINED_FLOW_ACTION_TEXT[actionName],
    hasMinHeight: isContainedFlow,
    showSignInWidget: isContainedFlow,
    hideBottomPlug: isContainedFlow,
  };
};
