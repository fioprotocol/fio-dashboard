import React from 'react';

import AddressWidget from '../AddressWidget';
import { NoProfileFlowValidatorComponent } from '../NoProfileFlowValidatorComponent';

import classes from './NoProfileAddressWidget.module.scss';

type Props = {
  addressWidgetContent: {
    subtitle: string;
    title: string;
  };
  verificationParams: {
    hasFioVerificationError: boolean;
    infoMessage: string;
    isVerifying: boolean;
    isFioItemVerified: boolean;
  };
};

export const NoProfileAddressWidget: React.FC<Props> = props => {
  const { addressWidgetContent, verificationParams } = props;
  return (
    <AddressWidget
      {...addressWidgetContent}
      title={<div className={classes.title}>{addressWidgetContent?.title}</div>}
      subtitle={
        <span className={classes.subtitle}>
          {addressWidgetContent?.subtitle}
        </span>
      }
    >
      <NoProfileFlowValidatorComponent {...verificationParams} />
    </AddressWidget>
  );
};
