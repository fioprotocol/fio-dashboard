import React from 'react';

import { AddBundledTransaction } from './AddBundledTransaction';
import { AddPublicAddressForm } from './AddPublicAddressForm';
import { AddNftForm } from './AddNftForm';
import { CancelFioRequest } from './CancelFioRequest';
import { CustomActionForm } from './CustomActionForm';
import { RegisterFioHandle } from './RegisterFioHandle';
import { RequestNewFunds } from './RequestNewFunds';
import { RegisterFioDomain } from './RegisterFioDomain';
import { ChangeDomainVisibility } from './ChangeDomainVisibility';
import { RecordObtData } from './RecordObtData';
import { RejectFioRequest } from './RejectFioRequest';
import { RemoveAllPublicAddresses } from './RemoveAllPublicAddresses';
import { RemovePublicAddress } from './RemovePublicAddress';
import { RenewFioDomain } from './RenewFioDomain';
import { StakeFioTokens } from './StakeFioTokens';
import { TransferFioHandle } from './TransferFioHandle';
import { TransferFioDomain } from './TransferFioDomain';
import { TransferFioTokens } from './TransferFioTokens';
import { UnstakeFioTokens } from './UnstakeFioTokens';

import { ACTIONS, TRANSACTION_ACTION_NAMES } from '../../../../constants/fio';
import { CUSTOM_ACTION_NAME } from '../constants';

type Props = {
  action: string;
  onSubmit: (values: any) => void;
};

export const FioActionForms: React.FC<Props> = props => {
  const { action, onSubmit } = props;

  switch (action) {
    case TRANSACTION_ACTION_NAMES[ACTIONS.addBundledTransactions]:
      return <AddBundledTransaction onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.addNft]:
      return <AddNftForm onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.addPublicAddress]:
      return <AddPublicAddressForm onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.cancelFundsRequest]:
      return <CancelFioRequest onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.requestFunds]:
      return <RequestNewFunds onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.registerFioAddress]:
      return <RegisterFioHandle onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.registerFioDomain]:
      return <RegisterFioDomain onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.setFioDomainVisibility]:
      return <ChangeDomainVisibility onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.recordObtData]:
      return <RecordObtData onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.rejectFundsRequest]:
      return <RejectFioRequest onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.removeAllPublicAddresses]:
      return <RemoveAllPublicAddresses onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.removePublicAddresses]:
      return <RemovePublicAddress onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.renewFioDomain]:
      return <RenewFioDomain onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.stakeFioTokens]:
      return <StakeFioTokens onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.transferFioAddress]:
      return <TransferFioHandle onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.transferFioDomain]:
      return <TransferFioDomain onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.transferTokens]:
      return <TransferFioTokens onSubmit={onSubmit} />;
    case TRANSACTION_ACTION_NAMES[ACTIONS.unStakeFioTokens]:
      return <UnstakeFioTokens onSubmit={onSubmit} />;
    case CUSTOM_ACTION_NAME:
      return <CustomActionForm onSubmit={onSubmit} />;
    default:
      return null;
  }
};
