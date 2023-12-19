import { useCallback, useState } from 'react';

import { MetamaskSnapProps } from '../utils/MetamaskSnapContext';
import { log } from '../../../util/general';
import {
  ACTIONS,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';
import { DEFAULT_BUNDLE_SET_VALUE } from '../../../constants/common';
import FioApi, { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';

type UseContextProps = {
  activeAction: string;
  executedTxn: any;
  executedTxnError: Error | null;
  executedTxnLoading: boolean;
  fioActionFormParams: any;
  onActionChange: (value: string) => void;
  onConnectClick: () => void;
  onExecuteTxn: () => void;
  onSignTxn: () => void;
  onSubmitActionForm: (values: any) => void;
};

export const useContext = (
  metamaskSnapContext: MetamaskSnapProps,
): UseContextProps => {
  const {
    publicKey,
    signedTxn,
    clearSignTx,
    handleConnectClick,
    signSnapTxn,
  } = metamaskSnapContext;

  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [executedTxn, setExecutedTxn] = useState<any | null>(null);
  const [executedTxnLoading, toggleExecutedTxnLoading] = useState<boolean>(
    false,
  );
  const [executedTxnError, setExecutedTxnError] = useState<Error | null>(null);
  const [fioActionFormParams, setFioActionFormParams] = useState<any | null>(
    null,
  );

  const onActionChange = useCallback((value: string) => {
    setActiveAction(value);
  }, []);

  const onConnectClick = useCallback(() => {
    handleConnectClick();
  }, [handleConnectClick]);

  const executeFioAction = useCallback(async () => {
    try {
      setExecutedTxnError(null);
      toggleExecutedTxnLoading(true);

      const pushResult = await fetch(
        'https://fiotestnet.blockpane.com/v1/chain/push_transaction',
        {
          body: JSON.stringify(signedTxn),
          method: 'POST',
        },
      );

      if (
        pushResult.status === 400 ||
        pushResult.status === 403 ||
        pushResult.status === 500
      ) {
        const jsonResult = await pushResult.json();
        const errorMessage = jsonResult.message || 'Something went wrong';

        if (jsonResult.fields) {
          // Handle specific error structure with "fields" array
          const fieldErrors = jsonResult.fields.map((field: any) => ({
            name: field.name,
            value: field.value,
            error: field.error,
          }));

          throw new Error(`${errorMessage}: ${JSON.stringify(fieldErrors)}`);
        } else if (jsonResult.error && jsonResult.error.what) {
          throw new Error(jsonResult.error.what);
        } else {
          throw new Error(errorMessage);
        }
      }

      const jsonResult = await pushResult.json();
      setExecutedTxn(jsonResult);
    } catch (error) {
      log.error(error);
      setExecutedTxnError(error);
    } finally {
      toggleExecutedTxnLoading(false);
    }
  }, [signedTxn]);

  const onExecuteTxn = useCallback(() => {
    executeFioAction();
  }, [executeFioAction]);

  const onSignTxn = useCallback(() => {
    const params: {
      actor?: string;
      apiUrl: string;
      contract?: string;
      action?: string;
      data?: any;
    } = {
      apiUrl: 'https://fiotestnet.blockpane.com',
      action: activeAction,
      contract: FIO_CONTRACT_ACCOUNT_NAMES.fioAddress,
      data: {
        tpid: process.env.REACT_APP_DEFAULT_TPID || '',
        max_fee: DEFAULT_ACTION_FEE_AMOUNT,
      },
    };

    switch (activeAction) {
      case TRANSACTION_ACTION_NAMES[ACTIONS.addBundledTransactions]:
        params.data = {
          ...params.data,
          fio_address: fioActionFormParams.fioHandle,
          bundle_sets: DEFAULT_BUNDLE_SET_VALUE,
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.addNft]:
        params.data = {
          ...params.data,
          fio_address: fioActionFormParams.fioHandle,
          nfts: [
            {
              chain_code: fioActionFormParams.chainCode,
              contract_address: fioActionFormParams.contractAddress,
              token_id: fioActionFormParams.tokenId,
              url: fioActionFormParams.url,
              hash: fioActionFormParams.hash,
              metadata: fioActionFormParams.creatorUrl
                ? JSON.stringify(fioActionFormParams.creatorUrl)
                : '',
            },
          ],
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.addPublicAddress]:
        params.data = {
          ...params.data,
          fio_address: fioActionFormParams.fioHandle,
          public_addresses: [
            {
              chain_code: fioActionFormParams.chainCode,
              token_code: fioActionFormParams.tokenCode,
              public_address: fioActionFormParams.publicAddress,
            },
          ],
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.cancelFundsRequest]:
        params.contract = FIO_CONTRACT_ACCOUNT_NAMES.fioRecordObt;
        params.data = {
          ...params.data,
          fio_request_id: fioActionFormParams.fioRequestId
            ? Number(fioActionFormParams.fioRequestId)
            : null,
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.registerFioAddress]:
        params.data = {
          ...params.data,
          fio_address: fioActionFormParams.fioHandle,
          owner_fio_public_key: publicKey,
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.registerFioDomain]:
        params.data = {
          ...params.data,
          fio_domain: fioActionFormParams.fioDomain,
          owner_fio_public_key: publicKey,
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.requestFunds]:
        params.contract = FIO_CONTRACT_ACCOUNT_NAMES.fioRecordObt;
        params.data = {
          ...params.data,
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.setFioDomainVisibility]:
        params.data = {
          ...params.data,
          fio_domain: fioActionFormParams.fioDomain,
          is_public: Number(fioActionFormParams.isPublic),
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.removeAllPublicAddresses]:
        params.data = {
          ...params.data,
          fio_address: fioActionFormParams.fioHandle,
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.removePublicAddresses]:
        params.data = {
          ...params.data,
          fio_address: fioActionFormParams.fioHandle,
          public_addresses: [
            {
              chain_code: fioActionFormParams.chainCode,
              token_code: fioActionFormParams.tokenCode,
              public_address: fioActionFormParams.publicAddress,
            },
          ],
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.renewFioDomain]:
        params.data = {
          ...params.data,
          fio_domain: fioActionFormParams.fioDomain,
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.stakeFioTokens]:
        params.contract = FIO_CONTRACT_ACCOUNT_NAMES.fioStaking;
        params.data = {
          ...params.data,
          fio_address: fioActionFormParams.fioHandle,
          amount: new FioApi()
            .amountToSUF(Number(fioActionFormParams.amount))
            .toString(),
          tpid: 'dashboard@fiotestnet',
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.transferFioAddress]:
        params.data = {
          ...params.data,
          fio_address: fioActionFormParams.fioHandle,
          new_owner_fio_public_key: fioActionFormParams.newOwnerPublicKey,
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.transferFioDomain]:
        params.data = {
          ...params.data,
          fio_domain: fioActionFormParams.fioDomain,
          new_owner_fio_public_key: fioActionFormParams.newOwnerPublicKey,
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.unStakeFioTokens]:
        params.contract = FIO_CONTRACT_ACCOUNT_NAMES.fioStaking;
        params.data = {
          ...params.data,
          fio_address: fioActionFormParams.fioHandle,
          amount: new FioApi()
            .amountToSUF(Number(fioActionFormParams.amount))
            .toString(),
          tpid: 'dashboard@fiotestnet',
        };
        break;
      default:
        break;
    }

    signSnapTxn(params);
  }, [
    activeAction,
    fioActionFormParams?.amount,
    fioActionFormParams?.chainCode,
    fioActionFormParams?.contractAddress,
    fioActionFormParams?.creatorUrl,
    fioActionFormParams?.fioDomain,
    fioActionFormParams?.fioHandle,
    fioActionFormParams?.fioRequestId,
    fioActionFormParams?.hash,
    fioActionFormParams?.isPublic,
    fioActionFormParams?.newOwnerPublicKey,
    fioActionFormParams?.publicAddress,
    fioActionFormParams?.tokenCode,
    fioActionFormParams?.tokenId,
    fioActionFormParams?.url,
    publicKey,
    signSnapTxn,
  ]);

  const onSubmitActionForm = useCallback(
    (values: any) => {
      setFioActionFormParams(values);
      setExecutedTxn(null);
      setExecutedTxnError(null);
      clearSignTx();
    },
    [clearSignTx],
  );

  return {
    activeAction,
    executedTxn,
    executedTxnError,
    executedTxnLoading,
    fioActionFormParams,
    onActionChange,
    onConnectClick,
    onExecuteTxn,
    onSignTxn,
    onSubmitActionForm,
  };
};
