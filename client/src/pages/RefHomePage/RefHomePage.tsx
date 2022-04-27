import React, { useEffect, useState } from 'react';

import { RouteComponentProps } from 'react-router-dom';

import RefAddressWidget from '../../components/AddressWidget/RefAddressWidget';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import FioAddressPage from '../FioAddressPage';

import classnames from './RefHomePage.module.scss';
import { RefProfile, RefQuery, RefQueryParams } from '../../types';
import { useNonActiveUserRedirect } from '../../util/hooks';

const FADE_OUT_TIMEOUT = 780;

type MatchParams = {
  refProfileCode: string;
};

type Location = {
  location: {
    query: RefQuery;
  };
};

type Props = {
  isAuthenticated: boolean;
  loading: boolean;
  edgeAuthLoading: boolean;
  refProfileInfo: RefProfile;
  refProfileQueryParams: RefQueryParams;
  refLinkError: string | null;
  getInfo: (code: string) => void;
  setContainedParams: (params: RefQuery) => void;
  showLoginModal: () => void;
};

export const RefHomePage: React.FC<Props &
  RouteComponentProps<MatchParams> &
  Location> = props => {
  const {
    refProfileInfo,
    refProfileQueryParams,
    isAuthenticated,
    loading,
    edgeAuthLoading,
    match: {
      params: { refProfileCode },
    },
    location: { query },
    getInfo,
    refLinkError,
    setContainedParams,
    showLoginModal,
  } = props;
  useNonActiveUserRedirect();
  const [hideLoader, setHideLoader] = useState(false);
  const [refProfileIsLoaded, setRefProfileIsLoaded] = useState(false);

  useEffect(() => {
    getInfo(refProfileCode);
  }, []);
  useEffect(() => {
    if (refProfileCode != null && refProfileQueryParams == null) {
      setContainedParams(query);
    }
  }, [refProfileCode]);
  useEffect(() => {
    if (refProfileInfo != null) {
      setHideLoader(true);
    }
  }, [refProfileInfo]);
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
    if (!isAuthenticated) {
      return (
        <div className={classnames.container}>
          <RefAddressWidget
            logo={
              <img
                src={refProfileInfo.settings.img}
                className={classnames.refImg}
                alt=""
              />
            }
            title={refProfileInfo.title}
            subTitle={refProfileInfo.subTitle}
            action={refProfileQueryParams.action}
            edgeAuthLoading={edgeAuthLoading}
            showLoginModal={showLoginModal}
          />
        </div>
      );
    }

    return <FioAddressPage />;
  };

  return (
    <>
      {renderLoader()}
      {renderContent()}
    </>
  );
};
