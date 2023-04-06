import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';

import AddressWidget from '../../components/AddressWidget';
import TwitterMeta from '../../components/TwitterMeta/TwitterMeta';
import { FCHBanner } from '../../components/FCHBanner';
import { FCHSpecialsBanner } from '../../components/SpecialsBanner';
import { WidelyAdoptedSection } from '../../components/WidelyAdoptedSection';
import { BADGE_TYPES } from '../../components/Badge/Badge';

import apis from '../../api';
import { ROUTES } from '../../constants/routes';
import { addressWidgetContent, TWITTER_DOMAIN } from '../../constants/twitter';
import { USERNAME_REGEX } from '../../constants/regExps';
import { FIO_ADDRESS_DELIMITER } from '../../utils';

import {
  RefProfile,
  ContainedFlowQueryParams,
  TwitterNotification,
} from '../../types';

import classnames from './TwitterPage.module.scss';

import neverExpiresIcon from '../../assets/images/landing-page/never-expires-twitter.svg';
import sendReceiveIcon from '../../assets/images/landing-page/send-receive-twitter.svg';

type Props = {
  isAuthenticated: boolean;
  isContainedFlow: boolean;
  refProfileInfo: RefProfile;
  containedFlowQueryParams: ContainedFlowQueryParams;
};

const noNotificationState: TwitterNotification = {
  hasNotification: false,
  type: '',
  message: '',
  title: '',
};

const TwitterPage: React.FC<Props & RouteComponentProps> = props => {
  const history = useHistory();

  const { isAuthenticated, isContainedFlow, refProfileInfo } = props;
  const [notification, setNotification] = useState<TwitterNotification>(
    noNotificationState,
  );

  useEffect(() => {
    if (isAuthenticated && !isContainedFlow) {
      history.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isContainedFlow, history]);

  const onFocusOut = (value: string) => {
    if (USERNAME_REGEX.test(value)) {
      setNotification(noNotificationState);
    } else {
      setNotification({
        hasNotification: true,
        type: BADGE_TYPES.ERROR,
        message:
          'The handle format is not valid. Please update the handle and try again.',
        title: 'Invalid Format',
      });
    }

    return value
      ? value
          .toLowerCase()
          .replaceAll('@', '')
          .replaceAll('_', '-')
      : '';
  };

  const customHandleSubmit = async ({ address }: { address: string }) => {
    const isRegistered = await apis.fio.availCheckTableRows(
      `${address}${FIO_ADDRESS_DELIMITER}${TWITTER_DOMAIN}`,
    );

    if (isRegistered) {
      setNotification({
        hasNotification: true,
        type: BADGE_TYPES.ERROR,
        message:
          'This handle is already registered. If you own it map it to your public addresses.',
        title: 'Existing Handle',
      });
    } else {
      setNotification(noNotificationState);
    }
  };

  return (
    <>
      <TwitterMeta />
      <div className={classnames.container}>
        <AddressWidget
          isDarkWhite={!!refProfileInfo}
          {...addressWidgetContent}
          formAction={addressWidgetContent.formAction}
          prefixText={addressWidgetContent.prefixText}
          convert={onFocusOut}
          notification={notification}
          customHandleSubmit={customHandleSubmit}
          formatOnFocusOut
          suffix
        />
        <FCHBanner fch={addressWidgetContent.fch} />
        <FCHSpecialsBanner
          customNeverExpiresIcon={neverExpiresIcon}
          customNeverExpiresMobileIcon={neverExpiresIcon}
          customSendReceiveIcon={sendReceiveIcon}
        />
        <WidelyAdoptedSection />
      </div>
    </>
  );
};

export default TwitterPage;
