import React, { useEffect, useState } from 'react';

import { RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import AddressWidget from '../../components/AddressWidget';
import FioLoader from '../../components/common/FioLoader/FioLoader';

import { APP_TITLE } from '../../constants/labels';

import { handleHomePageContent } from '../../util/homePage';
import { useNonActiveUserRedirect } from '../../util/hooks';
import { firePageViewAnalyticsEvent } from '../../util/analytics';

import {
  RefProfile,
  ContainedFlowQuery,
  ContainedFlowQueryParams,
} from '../../types';

import classnames from './RefHomePage.module.scss';

const FADE_OUT_TIMEOUT = 780;

type MatchParams = {
  refProfileCode: string;
};

type Location = {
  location: {
    query: ContainedFlowQuery;
  };
};

type Props = {
  isAuthenticated: boolean;
  hasFreeAddress: boolean;
  loading: boolean;
  refProfileInfo: RefProfile;
  containedFlowQueryParams: ContainedFlowQueryParams;
  refLinkError: string | null;
  isContainedFlow: boolean;
};

export const RefHomePage: React.FC<Props &
  RouteComponentProps<MatchParams> &
  Location> = props => {
  const {
    refProfileInfo,
    containedFlowQueryParams,
    isAuthenticated,
    hasFreeAddress,
    loading,
    refLinkError,
    isContainedFlow,
  } = props;
  useNonActiveUserRedirect();
  const [hideLoader, setHideLoader] = useState(false);
  const [refProfileIsLoaded, setRefProfileIsLoaded] = useState(false);

  useEffect(() => {
    if (refProfileInfo != null) {
      setHideLoader(true);
    }
  }, [refProfileInfo]);
  useEffect(() => {
    if (refProfileInfo?.code) {
      firePageViewAnalyticsEvent(
        `${APP_TITLE} - ${refProfileInfo.label}`,
        `${window.location.origin}/ref/${refProfileInfo.code}`,
      );
    }
  }, [refProfileInfo?.code, refProfileInfo?.label]);
  useEffect(() => {
    if (hideLoader) {
      const tId = setTimeout(
        () => setRefProfileIsLoaded(true),
        FADE_OUT_TIMEOUT,
      );
      return () => clearTimeout(tId);
    }
  }, [hideLoader]);

  if (refLinkError) {
    return (
      <div className={classnames.container}>
        <div className={classnames.validationErrorContainer}>
          {refLinkError}
        </div>
      </div>
    );
  }

  const renderLoader = () => {
    if (loading || !refProfileIsLoaded) {
      return (
        <div
          className={`${classnames.spinnerContainer} ${
            hideLoader ? classnames.fadeOut : ''
          }`}
        >
          <FioLoader />
        </div>
      );
    }
  };

  const renderContent = () => {
    if (refProfileInfo == null) return null;
    const addressWidgetContent = handleHomePageContent({
      isContainedFlow,
      containedFlowQueryParams,
      refProfileInfo,
    });
    return (
      <div className={classnames.container}>
        <Helmet>
          <title>
            {APP_TITLE} - {refProfileInfo.label}
          </title>
        </Helmet>
        <AddressWidget
          {...addressWidgetContent}
          isAuthenticated={isAuthenticated}
          hasFreeAddress={hasFreeAddress}
          showSignInWidget
          hideBottomPlug
        />
      </div>
    );
  };

  return (
    <>
      {renderLoader()}
      {renderContent()}
    </>
  );
};
