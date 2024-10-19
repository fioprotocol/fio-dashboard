import React, { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { redirectLink as redirectLinkSelector } from '../../redux/navigation/selectors';

import AddressWidget from '../../components/AddressWidget';
import { FCHBanner } from '../../components/FCHBanner';
import { FCHSpecialsBanner } from '../../components/SpecialsBanner';
import { WidelyAdoptedSection } from '../../components/WidelyAdoptedSection';

import { ROUTES } from '../../constants/routes';
import { REF_PROFILE_SLUG_NAME } from '../../constants/ref';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { handleHomePageContent } from '../../util/homePage';
import useQuery from '../../hooks/useQuery';

import { RefProfile, ContainedFlowQueryParams } from '../../types';

import classnames from './HomePage.module.scss';

type Props = {
  isAuthenticated: boolean;
  isContainedFlow: boolean;
  refProfileInfo: RefProfile;
  containedFlowQueryParams: ContainedFlowQueryParams;
};

const HomePage: React.FC<Props & RouteComponentProps> = props => {
  const history = useHistory();
  const redirectLink = useSelector(redirectLinkSelector);
  const queryParams = useQuery();

  const publicKeyQueryParam = queryParams.get(QUERY_PARAMS_NAMES.PUBLIC_KEY);

  const {
    isAuthenticated,
    isContainedFlow,
    refProfileInfo,
    containedFlowQueryParams,
  } = props;

  const addressWidgetContent = handleHomePageContent({
    isContainedFlow,
    containedFlowQueryParams,
    refProfileInfo,
  });

  useEffect(() => {
    if (isAuthenticated && !isContainedFlow) {
      if (redirectLink) {
        history.push(redirectLink);
        return;
      }
      history.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isContainedFlow, history, redirectLink]);

  if (refProfileInfo?.settings?.hasNoProfileFlow) {
    return (
      <Redirect
        to={{
          pathname: `${ROUTES.NO_PROFILE_REGISTER_FIO_HANDLE.replace(
            REF_PROFILE_SLUG_NAME,
            refProfileInfo?.code,
          )}`,
          search: publicKeyQueryParam
            ? `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${publicKeyQueryParam}`
            : '',
        }}
      />
    );
  }

  if (isContainedFlow)
    return <AddressWidget isDarkWhite {...addressWidgetContent} />;

  return (
    <div className={classnames.container}>
      <AddressWidget isDarkWhite={!!refProfileInfo} {...addressWidgetContent} />
      <FCHBanner fch="bob@rulez" />
      <FCHSpecialsBanner />
      <WidelyAdoptedSection />
      <AddressWidget {...addressWidgetContent} isReverseColors />
    </div>
  );
};

export default HomePage;
