import React from 'react';

import { NoProfileAddressWidget } from '../../../NoProfileAddressWidget';

import { AddressWidgetProps } from '../../../AddressWidget/AddressWidget';

type Props = {
  addressWidgetContent: AddressWidgetProps;
  verificationParams: {
    hasFioVerificationError: boolean;
    infoMessage: string;
    isVerifying: boolean;
    isFioItemVerified: boolean;
  };
};

export const FioPublicKeyComponent: React.FC<Props> = props => {
  return <NoProfileAddressWidget {...props} />;
};
