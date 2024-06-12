import React from 'react';

import { NoProfileFlowContainer } from '../../components/NoProfileFlowContainer';
import AddressWidget from '../../components/AddressWidget';

import { useContext } from './NoProfileFlowRegisterFioHandleContext';

import { FioHandleValidatorComponent } from './components/FioHandleValidatorComponent';

import { RefProfile } from '../../types';

import classes from './NoProfileFlowFioHandle.module.scss';

export type Props = {
  refProfile?: RefProfile;
  publicKey?: string;
};

const NoProfileFlowRegisterFioHandle: React.FC<Props> = props => {
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
        <FioHandleValidatorComponent {...verificationParams} />
      </AddressWidget>
    </>
  );
};

const NoProfileFlowRegisterFioHandlePage: React.FC = () => (
  <NoProfileFlowContainer>
    <NoProfileFlowRegisterFioHandle />
  </NoProfileFlowContainer>
);

export default NoProfileFlowRegisterFioHandlePage;
