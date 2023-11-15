import React, { useEffect, useState } from 'react';

import { RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import AddressWidget from '../../components/AddressWidget';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import { FCHBanner } from '../../components/FCHBanner';
import { DetailedInfoMainPageComponent } from '../../components/DetailedInfoMainPageComponent';
import { GateVerificationComponent } from '../../components/GateVerificationComponent';

import { APP_TITLE } from '../../constants/labels';
import { DEFAULT_DOMAIN_NAME } from '../../constants/ref';

import { handleHomePageContent } from '../../util/homePage';
import { firePageViewAnalyticsEvent } from '../../util/analytics';

import { useContext } from './RefHomePageContext';

import {
  RefProfile,
  ContainedFlowQuery,
  ContainedFlowQueryParams,
} from '../../types';

import classes from './RefHomePage.module.scss';

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

  const {
    disabled,
    gatedChainName,
    hasFioHandleInfoMessage,
    hasFioVerificactionError,
    hasVerifiedError,
    infoMessage,
    isGatedFlow,
    isVerified,
    loaderText,
    showBrowserExtensionErrorModal,
    showProviderWindowError,
    showProviderLoadingIcon,
    showSelectProviderModalVisible,
    verifyLoading,
    connectWallet,
    closeSelectProviderModal,
    customHandleSubmit,
    onClick,
    onFocusOut,
    onInputChanged,
    setConnectionError,
    setShowBrowserExtensionErrorModal,
  } = useContext();

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
      <div className={classes.container}>
        <div className={classes.validationErrorContainer}>{refLinkError}</div>
      </div>
    );
  }

  const renderLoader = () => {
    if (loading || !refProfileIsLoaded) {
      return (
        <div
          className={`${classes.spinnerContainer} ${
            hideLoader ? classes.fadeOut : ''
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

    const refTitle = addressWidgetContent?.title as string;
    const refDomain = refProfileInfo?.settings?.domains[0]?.name;

    const domainName = refDomain || 'rulez';

    if (
      refTitle &&
      typeof refTitle === 'string' &&
      refTitle.includes(`@${DEFAULT_DOMAIN_NAME}`) &&
      refDomain
    ) {
      addressWidgetContent.title = refTitle.replace(
        `@${DEFAULT_DOMAIN_NAME}`,
        `@${refDomain}`,
      );
    }

    return (
      <div className={classes.container}>
        <Helmet>
          <title>
            {APP_TITLE} - {refProfileInfo.label}
          </title>
        </Helmet>
        <AddressWidget
          {...addressWidgetContent}
          title={
            <div className={classes.title}>{addressWidgetContent?.title}</div>
          }
          subtitle={
            <span className={classes.subtitle}>
              {addressWidgetContent?.subtitle}
            </span>
          }
          convert={onFocusOut}
          onInputChanged={onInputChanged}
          customHandleSubmit={customHandleSubmit}
          disabled={disabled && isGatedFlow}
          disabledInput={!isVerified && isGatedFlow}
          disabledInputGray
          isAuthenticated={isAuthenticated}
          isDarkWhite
          formatOnFocusOut
          suffixText={`@${refDomain}`}
          showSignInWidget={!isGatedFlow}
        >
          {isGatedFlow && (
            <GateVerificationComponent
              gatedChainName={gatedChainName}
              hasFioHandleInfoMessage={hasFioHandleInfoMessage}
              hasFioVerificactionError={hasFioVerificactionError}
              hasVerifiedError={hasVerifiedError}
              isVerified={isVerified}
              infoMessage={infoMessage}
              loaderText={loaderText}
              parnterName={refProfileInfo?.label}
              refDomain={refDomain}
              showBrowserExtensionErrorModal={showBrowserExtensionErrorModal}
              showProviderWindowError={showProviderWindowError}
              showProviderLoadingIcon={showProviderLoadingIcon}
              showSelectProviderModalVisible={showSelectProviderModalVisible}
              verifyLoading={verifyLoading}
              connectWallet={connectWallet}
              closeSelectProviderModal={closeSelectProviderModal}
              onClick={onClick}
              setConnectionError={setConnectionError}
              setShowBrowserExtensionErrorModal={
                setShowBrowserExtensionErrorModal
              }
            />
          )}
        </AddressWidget>
        <FCHBanner
          containerClass={classes.fchBannerConainerClass}
          customFioHandleBanner={
            <div className={classes.customFioHandleBanner}>
              bob<span className={classes.boldText}>@{domainName}</span>
            </div>
          }
          fch={`bob@${domainName}`}
          mainTextClass={classes.mainTextClass}
          publicKeyWrapperClass={classes.publicKeyWrapperClass}
          publicKeyClass={classes.publicKeyClass}
          subtextClass={classes.subtextClass}
          text="Now people can send you cryptocurrency to"
        />
        <DetailedInfoMainPageComponent domain={domainName} />
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
