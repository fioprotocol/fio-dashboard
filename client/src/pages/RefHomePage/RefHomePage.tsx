import React, { useEffect } from 'react';

import RefAddressWidget from '../../components/AddressWidget/RefAddressWidget';
import FioAddressPage from '../FioAddressPage';

import classnames from './RefHomePage.module.scss';
import { RouteComponentProps } from 'react-router-dom';
import { RefProfile, RefQuery } from '../../types';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from '../../components/AuthContainer/AuthContainer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  refProfileQueryParams: RefQuery;
  refLinkError: string | null;
  getInfo: (code: string) => void;
  setContainedParams: (params: any) => void;
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

  useEffect(() => {
    getInfo(refProfileCode);
  }, []);
  useEffect(() => {
    if (refProfileCode != null && refProfileQueryParams == null) {
      setContainedParams(query);
    }
  }, [refProfileCode]);

  if (refLinkError) {
    return (
      <div className={classnames.container}>
        <div className={classnames.validationErrorContainer}>
          {refLinkError}
        </div>
      </div>
    );
  }

  if (loading || refProfileInfo == null) {
    return (
      <div className={classnames.container}>
        <FontAwesomeIcon icon={faSpinner} spin className={styles.spinner} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={classnames.container}>
        <RefAddressWidget
          logo={
            <img
              src={refProfileInfo.settings.img}
              className={classnames.refImg}
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
