import React, { useEffect, useState } from 'react';

import { RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import AddressWidget from '../../components/AddressWidget';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import { FCHBanner } from '../../components/FCHBanner';
import { FCHSpecialsBanner } from '../../components/SpecialsBanner';
import { WidelyAdoptedSection } from '../../components/WidelyAdoptedSection';

import { APP_TITLE } from '../../constants/labels';

import { handleHomePageContent } from '../../util/homePage';
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
    loading,
    refLinkError,
    isContainedFlow,
  } = props;
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

    const {
      settings: { showExplanationsSection, showPartnersSection } = {},
    } = refProfileInfo;

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
          showSignInWidget
          isDarkWhite
          formAction
        />
        {showExplanationsSection && (
          <>
            <FCHBanner fch="bob@rulez" />
            <FCHSpecialsBanner />
          </>
        )}
        {showPartnersSection && <WidelyAdoptedSection />}
        {(showExplanationsSection || showPartnersSection) && (
          <AddressWidget {...addressWidgetContent} isReverseColors formAction />
        )}
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
