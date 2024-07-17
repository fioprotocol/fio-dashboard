import React from 'react';

import { WALLET_CREATED_FROM } from '../../constants/common';

import { FioWalletDoublet } from '../../types';
import { AnyObject } from '../../types';
import { GroupedPurchaseValues, PurchaseValues } from '../PurchaseNow/types';

type WalletTypeActionProps = {
  allowDisconnectAll?: boolean;
  analyticsData?: PurchaseValues;
  ownerFioPublicKey?: string;
  groupedPurchaseValues?: GroupedPurchaseValues[];
  fioWallet: FioWalletDoublet;
  onSuccess: (data: AnyObject) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: AnyObject | null;
  processing: boolean;
  action: string;
  fee?: number;
  oracleFee?: number;
  fioWalletEdgeId?: string;
  edgeAccountLogoutBefore?: boolean;
  createContact?: (name: string) => void;
  contactsList?: string[];
};

type Props = WalletTypeActionProps & {
  FioActionWallet: React.FC<AnyObject>;
  LedgerActionWallet: React.FC<AnyObject>;
  MetamaskActionWallet?: React.FC<AnyObject>;
};

const WalletAction: React.FC<Props> = props => {
  const {
    fioWallet,
    FioActionWallet,
    LedgerActionWallet,
    MetamaskActionWallet,
    ...rest
  } = props;

  if (!fioWallet || !fioWallet.publicKey) return null;

  if (fioWallet.from === WALLET_CREATED_FROM.EDGE)
    return <FioActionWallet fioWallet={fioWallet} {...rest} />;

  if (fioWallet.from === WALLET_CREATED_FROM.LEDGER)
    return <LedgerActionWallet fioWallet={fioWallet} {...rest} />;

  if (fioWallet.from === WALLET_CREATED_FROM.METAMASK && MetamaskActionWallet)
    return <MetamaskActionWallet fioWallet={fioWallet} {...rest} />;

  return null;
};

export default WalletAction;
