import React from 'react';

import { NoProfileFlowContainer } from '../../components/NoProfileFlowContainer';
import AddressWidget from '../../components/AddressWidget';

import { useContext } from './NoProfileFlowRenewFioHandlePageContext';

import { NoProfileFlowValidatorComponent } from '../../components/NoProfileFlowValidatorComponent';

import { RefProfile } from '../../types';

import classes from './NoProfileFlowRenewFioHandlePage.module.scss';

export type Props = {
  refProfile?: RefProfile;
  publicKey?: string;
};

const NoProfileFlowRenewFioHandle: React.FC<Props> = props => {
  const { addressWidgetContent, verificationParams } = useContext(props);

  return (
    <>
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
      >
        <NoProfileFlowValidatorComponent {...verificationParams} />
      </AddressWidget>
    </>
  );
};

const NoProfileFlowRenewFioHandlePage: React.FC = () => (
  <NoProfileFlowContainer>
    <NoProfileFlowRenewFioHandle />
  </NoProfileFlowContainer>
);

export default NoProfileFlowRenewFioHandlePage;
