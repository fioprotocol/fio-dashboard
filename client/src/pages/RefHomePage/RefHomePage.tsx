import React, { useEffect, useState } from 'react';

import { RouteComponentProps } from 'react-router-dom';

import AddressWidget from '../../components/AddressWidget';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import FioAddressPage from '../FioAddressPage';

import { CONTAINED_FLOW_ACTION_TEXT } from '../../constants/containedFlow';

import classnames from './RefHomePage.module.scss';
import {
  RefProfile,
  ContainedFlowQuery,
  ContainedFlowQueryParams,
} from '../../types';
import { useNonActiveUserRedirect } from '../../util/hooks';

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
  loading: boolean;
  refProfileInfo: RefProfile;
  containedFlowQueryParams: ContainedFlowQueryParams;
  refLinkError: string | null;
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
          <AddressWidget
            logoSrc={refProfileInfo.settings.img}
            title={refProfileInfo.title}
            subtitle={refProfileInfo.subTitle}
            actionText={
              CONTAINED_FLOW_ACTION_TEXT[containedFlowQueryParams?.action]
            }
            showSignInWidget={true}
            hideBottomPlug={true}
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
