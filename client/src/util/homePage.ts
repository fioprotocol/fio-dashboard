import {
  CONTAINED_FLOW_ACTION_TEXT,
  CONTAINED_FLOW_SUBTITLES,
  CONTAINED_FLOW_TITLES,
} from '../constants/containedFlow';

import { ContainedFlowQueryParams, RefProfile } from '../types';

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

  if (refProfileInfo?.settings) {
    const {
      settings: { img, actions },
      subTitle,
      title: refTitle,
    } = refProfileInfo;

    logoSrc = img;

    if (isContainedFlow) {
      title = actions[containedFlowQueryParams?.action].title;
      subtitle = actions[containedFlowQueryParams?.action].subtitle;
    } else {
      title = refTitle;
      subtitle = subTitle;
    }
  }

  if (isContainedFlow) {
    title = CONTAINED_FLOW_TITLES[containedFlowQueryParams?.action];
    if (!refProfileInfo)
      subtitle = CONTAINED_FLOW_SUBTITLES[containedFlowQueryParams?.action];
  }

  return {
    logoSrc,
    title,
    subtitle,
    actionText: CONTAINED_FLOW_ACTION_TEXT[containedFlowQueryParams?.action],
    hasMinHeight: isContainedFlow,
    showSignInWidget: isContainedFlow,
    hideBottomPlug: isContainedFlow,
  };
};
