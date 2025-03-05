import React from 'react';

import { Action } from '@fioprotocol/fiosdk';

import { AddBundledTransaction } from './AddBundledTransaction';
import { AddPublicAddressForm } from './AddPublicAddressForm';
import { AddNftForm } from './AddNftForm';
import { CancelFioRequest } from './CancelFioRequest';
import { CustomActionForm } from './CustomActionForm';
import { DecryptContentFioRequestForm } from './DecryptContentFioRequestForm';
import { DecryptContentObtDataForm } from './DecryptContentObtDataForm';
import { EncryptContentFioRequestForm } from './EncryptContentFioRequestForm';
import { EncryptContentObtDataForm } from './EncryptContentObtDataForm';
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
import { WrapFioDomain } from './WrapFioDomain';
import { WrapFioTokens } from './WrapFioTokens';

import {
  CUSTOM_ACTION_NAME,
  DECRYPT_FIO_REQUEST_CONTENT_NAME,
  DECRYPT_OBT_DATA_CONTENT_NAME,
  ENCRYPT_FIO_REQUEST_CONTENT_NAME,
  ENCRYPT_OBT_DATA_CONTENT_NAME,
} from '../../constants';
import { AnyType } from '../../../../../types';

type Props = {
  action: string;
  onSubmit: (values: AnyType) => void;
};

export const FioActionForms: React.FC<Props> = props => {
  const { action, onSubmit } = props;

  switch (action) {
    case Action.addBundledTransactions:
      return <AddBundledTransaction onSubmit={onSubmit} />;
    case Action.addNft:
      return <AddNftForm onSubmit={onSubmit} />;
    case Action.addPublicAddresses:
      return <AddPublicAddressForm onSubmit={onSubmit} />;
    case Action.cancelFundsRequest:
      return <CancelFioRequest onSubmit={onSubmit} />;
    case Action.newFundsRequest:
      return <RequestNewFunds onSubmit={onSubmit} />;
    case Action.regAddress:
      return <RegisterFioHandle onSubmit={onSubmit} />;
    case Action.regDomain:
      return <RegisterFioDomain onSubmit={onSubmit} />;
    case Action.setDomainPublic:
      return <ChangeDomainVisibility onSubmit={onSubmit} />;
    case Action.recordObt:
      return <RecordObtData onSubmit={onSubmit} />;
    case Action.rejectFundsRequest:
      return <RejectFioRequest onSubmit={onSubmit} />;
    case Action.removeAllAddresses:
      return <RemoveAllPublicAddresses onSubmit={onSubmit} />;
    case Action.removeAddress:
      return <RemovePublicAddress onSubmit={onSubmit} />;
    case Action.renewDomain:
      return <RenewFioDomain onSubmit={onSubmit} />;
    case Action.stake:
      return <StakeFioTokens onSubmit={onSubmit} />;
    case Action.transferAddress:
      return <TransferFioHandle onSubmit={onSubmit} />;
    case Action.transferDomain:
      return <TransferFioDomain onSubmit={onSubmit} />;
    case Action.transferTokensKey:
      return <TransferFioTokens onSubmit={onSubmit} />;
    case Action.wrapDomain:
      return <WrapFioDomain onSubmit={onSubmit} />;
    case Action.wrapTokens:
      return <WrapFioTokens onSubmit={onSubmit} />;
    case Action.unstake:
      return <UnstakeFioTokens onSubmit={onSubmit} />;
    case DECRYPT_FIO_REQUEST_CONTENT_NAME:
      return <DecryptContentFioRequestForm onSubmit={onSubmit} />;
    case DECRYPT_OBT_DATA_CONTENT_NAME:
      return <DecryptContentObtDataForm onSubmit={onSubmit} />;
    case ENCRYPT_FIO_REQUEST_CONTENT_NAME:
      return <EncryptContentFioRequestForm onSubmit={onSubmit} />;
    case ENCRYPT_OBT_DATA_CONTENT_NAME:
      return <EncryptContentObtDataForm onSubmit={onSubmit} />;
    case CUSTOM_ACTION_NAME:
      return <CustomActionForm onSubmit={onSubmit} />;
    default:
      return null;
  }
};
