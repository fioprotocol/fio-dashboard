import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';

import AddressWidget from '../../components/AddressWidget';
import { FCHBanner } from '../../components/FCHBanner';
import { FCHSpecialsBanner } from '../../components/SpecialsBanner';
import { WidelyAdoptedSection } from '../../components/WidelyAdoptedSection';

import { ROUTES } from '../../constants/routes';

import { handleHomePageContent } from '../../util/homePage';

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
      history.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isContainedFlow, history]);

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
