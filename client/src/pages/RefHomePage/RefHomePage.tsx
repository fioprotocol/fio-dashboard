import React, { useEffect } from 'react';

import AddressWidget from '../../components/AddressWidget';
import FioAddressPage from '../FioAddressPage';

import classnames from './RefHomePage.module.scss';
import { RouteComponentProps } from 'react-router-dom';
import { RefProfile } from '../../types';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from '../../components/AuthContainer/AuthContainer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type MatchParams = {
  refProfileCode: string;
};

type Location = {
  location: {
    query: {
      chain_code?: string;
      contract_address?: string;
      token_id?: string;
      url?: string;
      hash?: string;
      metadata?: string;
      creator_url?: string;
      r?: string;
    };
  };
};

type Props = {
  isAuthenticated: boolean;
  loading: boolean;
  refProfileInfo: RefProfile;
  getInfo: (code: string) => void;
  setContainedParams: (params: any) => void;
};

export const RefHomePage: React.FC<Props &
  RouteComponentProps<MatchParams> &
  Location> = props => {
  const {
    refProfileInfo,
    isAuthenticated,
    loading,
    match: {
      params: { refProfileCode },
    },
    location: { query },
    getInfo,
    setContainedParams,
  } = props;

  useEffect(() => {
    getInfo(refProfileCode);
  }, []);
  useEffect(() => {
    if (refProfileCode != null) {
      setContainedParams(query);
    }
  }, [refProfileCode]);

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
        <AddressWidget />
      </div>
    );
  }

  return <FioAddressPage />;
};
