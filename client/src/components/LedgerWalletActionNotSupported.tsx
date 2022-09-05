import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { showGenericErrorModal } from '../redux/modal/actions';

import { AnyObject } from '../types';

const LedgerWalletActionNotSupported: React.FC<{
  submitData: AnyObject | null;
  onCancel: () => void;
}> = props => {
  const { submitData, onCancel } = props;
  const dataIsSet = !!submitData;

  const dispatch = useDispatch();

  useEffect(() => {
    if (dataIsSet) {
      dispatch(
        showGenericErrorModal(
          "The Ledger Wallet does not currently support this action. We are working hard to add this capability to the Ledger's FIO App.",
          'Not supported',
          'Close',
        ),
      );
      onCancel();
    }
  }, [dataIsSet, dispatch, onCancel]);

  return null;
};

export default LedgerWalletActionNotSupported;
