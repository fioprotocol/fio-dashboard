import React from 'react';

import { WALLET_CREATED_FROM } from '../../constants/common';

import { FioWalletDoublet } from '../../types';
import { AnyObject } from '../../types';
import Processing from '../common/TransactionProcessing';
import { GroupedPurchaseValues, PurchaseValues } from '../PurchaseNow/types';
import { BeforeSubmitValues } from '../../pages/CheckoutPage/types';
import { GroupedBeforeSubmitValues } from '../../pages/CheckoutPage/components/BeforeSubmitWalletConfirm';

type WalletTypeActionProps = {
  allowDisconnectAll?: boolean;
  analyticsData?: PurchaseValues | BeforeSubmitValues;
  ownerFioPublicKey?: string;
  groupedPurchaseValues?: GroupedPurchaseValues[];
  groupedBeforeSubmitValues?: GroupedBeforeSubmitValues[];
  fioWallet?: FioWalletDoublet;
  onSuccess: (data: AnyObject) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData?: AnyObject | null;
  processing: boolean;
  action: string;
  fee?: string;
  oracleFee?: string;
  fioWalletEdgeId?: string;
  edgeAccountLogoutBefore?: boolean;
  createContact?: (name: string) => void;
  contactsList?: string[];
};

type Props = WalletTypeActionProps & {
  FioActionWallet?: React.FC<AnyObject>;
  LedgerActionWallet?: React.FC<AnyObject>;
  MetamaskActionWallet?: React.FC<AnyObject>;
};

const WalletAction: React.FC<Props> = props => {
  const {
    FioActionWallet,
    LedgerActionWallet,
    MetamaskActionWallet,
    ...rest
  } = props;

  const createdFrom = rest.fioWallet?.from;

  if (!createdFrom) return <Processing isProcessing={rest.processing} />;

  if (createdFrom === WALLET_CREATED_FROM.EDGE && FioActionWallet)
    return <FioActionWallet {...rest} />;

  if (createdFrom === WALLET_CREATED_FROM.LEDGER && LedgerActionWallet)
    return <LedgerActionWallet {...rest} />;

  if (createdFrom === WALLET_CREATED_FROM.METAMASK && MetamaskActionWallet)
    return <MetamaskActionWallet {...rest} />;

  return null;
};

export default WalletAction;
