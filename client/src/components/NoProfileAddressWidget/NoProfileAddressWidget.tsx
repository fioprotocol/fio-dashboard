import React from 'react';

import AddressWidget from '../AddressWidget';
import { AddressWidgetProps } from '../AddressWidget/AddressWidget';
import { NoProfileFlowValidatorComponent } from '../NoProfileFlowValidatorComponent';

import classes from './NoProfileAddressWidget.module.scss';

type Props = {
  addressWidgetContent: AddressWidgetProps;
  verificationParams: {
    hasFioVerificationError: boolean;
    infoMessage: string;
    isVerifying: boolean;
    isFioItemVerified: boolean;
    infoBagde?: {
      title: string;
      message: string;
    };
  };
};

export const NoProfileAddressWidget: React.FC<Props> = props => {
  const { addressWidgetContent, verificationParams } = props;
  return (
    <AddressWidget
      {...addressWidgetContent}
      inputClassNames={classes.input}
      hasRoundRadius
      classNameActionText={classes.actionText}
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
