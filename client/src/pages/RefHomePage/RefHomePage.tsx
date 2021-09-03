import React, { useEffect, useState } from 'react';

import RefAddressWidget from '../../components/AddressWidget/RefAddressWidget';
import FioAddressPage from '../FioAddressPage';

import classnames from './RefHomePage.module.scss';
import { RouteComponentProps } from 'react-router-dom';
import { RefProfile, RefQuery } from '../../types';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from '../../components/AuthContainer/AuthContainer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { validateRefActionQuery } from '../../util/ref';

type MatchParams = {
  refProfileCode: string;
};

// example url - /ref/uniqueone?action=SIGNNFT&chain_code=ETH&contract_address=FIO5CniznG2z6yVPc4as69si711R1HJMAAnC3Rxjd4kGri4Kp8D8P&token_id=ETH&url=ifg://dfs.sdfs/sdfs&hash=f83klsjlgsldkfjsdlf&metadata={"creator_url":"https://www.google.com.ua/"}&r=https://www.google.com.ua/

type Location = {
  location: {
    query: RefQuery;
  };
};

type Props = {
  isAuthenticated: boolean;
  loading: boolean;
  refProfileInfo: RefProfile;
  getInfo: (code: string) => void;
  setContainedParams: (params: any) => void;
  showLoginModal: () => void;
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
    showLoginModal,
  } = props;
  const [validationError, setQueryValidationError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    try {
      validateRefActionQuery(refProfileCode, query);
      getInfo(refProfileCode);
    } catch (e) {
      console.error(e);
      setQueryValidationError('The referral link is invalid');
    }
  }, []);
  useEffect(() => {
    if (refProfileCode != null) {
      setContainedParams(query);
    }
  }, [refProfileCode]);

  if (validationError) {
    return (
      <div className={classnames.container}>
        <div className={classnames.validationErrorContainer}>
          {validationError}
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
          action={query.action}
          showLoginModal={showLoginModal}
        />
      </div>
    );
  }

  return <FioAddressPage />;
};
