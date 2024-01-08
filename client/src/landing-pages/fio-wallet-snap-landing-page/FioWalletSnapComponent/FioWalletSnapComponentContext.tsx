import { useCallback, useState } from 'react';

import { createHmac, randomBytes } from 'crypto-browserify';

import { MetamaskSnapProps } from '../utils/MetamaskSnapContext';
import { log } from '../../../util/general';
import {
  ACTIONS,
  FIO_CHAIN_CODE,
  FIO_CONTENT_TYPES,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';
import { DEFAULT_BUNDLE_SET_VALUE } from '../../../constants/common';
import {
  CUSTOM_ACTION_NAME,
  DECRYPT_FIO_REQUEST_CONTENT_NAME,
  DECRYPT_OBT_DATA_CONTENT_NAME,
} from './constants';
import FioApi, { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';

const DEFAULT_ORACLE_FEE_AMOUNT = '150000000000';

type UseContextProps = {
  activeAction: string;
  executedTxn: any;
  executedTxnError: Error | null;
  executedTxnLoading: boolean;
  fioActionFormParams: any;
  nonce: string | null;
  signature: string;
  onActionChange: (value: string) => void;
  onConnectClick: () => void;
  onExecuteTxn: () => void;
  onDecryptContent: () => void;
  onSignTxn: () => void;
  onSubmitActionForm: (values: any) => void;
  onSubmitSecret: (values: { secret: string }) => void;
  signNonce: () => void;
};

export const useContext = (
  metamaskSnapContext: MetamaskSnapProps,
): UseContextProps => {
  const {
    publicKey,
    signedTxn,
    signature,
    clearDecryptResults,
    clearSignTx,
    clearSignNonceResults,
    decryptRequestContent,
    handleConnectClick,
    signSnapTxn,
    signNonceSnap,
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
  const [nonce, setNonce] = useState<string | null>(null);

  const onActionChange = useCallback(
    (value: string) => {
      clearSignTx();
      clearDecryptResults();
      setActiveAction(value);
    },
    [clearDecryptResults, clearSignTx],
  );

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

  const onSignTxn = useCallback(async () => {
    let params: {
      actor?: string;
      apiUrl: string;
      account?: string;
      action?: string;
      contentType?: string;
      content?: string;
      data?: {
        amount?: string;
        bundle_sets?: number;
        chain_code?: string;
        content?: {
          payer_public_address?: string;
          payee_public_address: string;
          amount: string;
          chain_code: string;
          token_code: string;
          status?: string;
          obt_id?: string;
          memo: string | null;
          hash: string | null;
          offline_url: string | null;
        };
        fio_address?: string;
        fio_domain?: string;
        fio_request_id?: string;
        is_public?: number;
        max_fee: number;
        max_oracle_fee?: string;
        nfts?: {
          chain_code: string;
          contract_address: string;
          token_id: string;
          url?: string;
          hash?: string;
          metadata?: string;
        }[];
        new_owner_fio_public_key?: string;
        owner_fio_public_key?: string;
        payer_fio_address?: string;
        payee_fio_address?: string;
        payee_public_key?: string;
        public_addresses?: {
          chain_code: string;
          token_code: string;
          public_address: string;
        }[];
        public_address?: string;
        tpid: string;
      };
      encryptionPublicKey?: string;
      payerFioPublicKey?: string;
    } = {
      apiUrl: 'https://fiotestnet.blockpane.com',
      action: activeAction,
      account: FIO_CONTRACT_ACCOUNT_NAMES.fioAddress,
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
        params.account = FIO_CONTRACT_ACCOUNT_NAMES.fioRecordObt;
        params.data = {
          ...params.data,
          fio_request_id: fioActionFormParams.fioRequestId,
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.recordObtData]: {
        const payeePublicKey = await new FioApi().getFioPublicAddress(
          fioActionFormParams.payeeFioHandle,
        );
        params.account = FIO_CONTRACT_ACCOUNT_NAMES.fioRecordObt;
        params.data = {
          ...params.data,
          content: {
            payer_public_address: publicKey,
            payee_public_address: payeePublicKey.public_address,
            amount: fioActionFormParams.amount,
            chain_code: FIO_CHAIN_CODE,
            token_code: FIO_CHAIN_CODE,
            status: 'sent_to_blockchain',
            obt_id: fioActionFormParams.obtId,
            memo: fioActionFormParams.memo || null,
            hash: fioActionFormParams.hash || null,
            offline_url: fioActionFormParams.offLineUrl || null,
          },
          payer_fio_address: fioActionFormParams.payerFioHandle,
          payee_fio_address: fioActionFormParams.payeeFioHandle,
          fio_request_id: fioActionFormParams.fioRequestId || '',
        };
        params.contentType = FIO_CONTENT_TYPES.RECORD_OBT_DATA;
        break;
      }
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
        {
          params.account = FIO_CONTRACT_ACCOUNT_NAMES.fioRecordObt;
          params.data = {
            ...params.data,
            payer_fio_address: fioActionFormParams.payerFioHandle,
            payee_fio_address: fioActionFormParams.payeeFioHandle,
            content: {
              amount: fioActionFormParams.amount,
              payee_public_address:
                fioActionFormParams.payeeTokenPublicAddress || publicKey,
              chain_code: FIO_CHAIN_CODE,
              token_code: FIO_CHAIN_CODE,
              memo: fioActionFormParams.memo || null,
              hash: fioActionFormParams.hash || null,
              offline_url: fioActionFormParams.offlineUrl || null,
            },
          };
          params.contentType = FIO_CONTENT_TYPES.NEW_FUNDS;
          const payerFioPublicKey = await new FioApi().getFioPublicAddress(
            fioActionFormParams.payerFioHandle,
          );
          params.payerFioPublicKey = payerFioPublicKey.public_address;
        }
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.setFioDomainVisibility]:
        params.data = {
          ...params.data,
          fio_domain: fioActionFormParams.fioDomain,
          is_public: Number(fioActionFormParams.isPublic),
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.rejectFundsRequest]:
        params.account = FIO_CONTRACT_ACCOUNT_NAMES.fioRecordObt;
        params.data = {
          ...params.data,
          fio_request_id: fioActionFormParams.fioRequestId,
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
        params.account = FIO_CONTRACT_ACCOUNT_NAMES.fioStaking;
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
      case TRANSACTION_ACTION_NAMES[ACTIONS.transferTokens]:
        params.account = FIO_CONTRACT_ACCOUNT_NAMES.fioToken;
        params.data = {
          ...params.data,
          amount: new FioApi()
            .amountToSUF(Number(fioActionFormParams.amount))
            .toString(),
          payee_public_key: fioActionFormParams.payeeFioPublicKey,
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.unStakeFioTokens]:
        params.account = FIO_CONTRACT_ACCOUNT_NAMES.fioStaking;
        params.data = {
          ...params.data,
          fio_address: fioActionFormParams.fioHandle,
          amount: new FioApi()
            .amountToSUF(Number(fioActionFormParams.amount))
            .toString(),
          tpid: 'dashboard@fiotestnet',
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.wrapFioDomain]:
        params.account = FIO_CONTRACT_ACCOUNT_NAMES.fioOracle;
        params.data = {
          ...params.data,
          fio_domain: fioActionFormParams.fioDomain,
          chain_code: fioActionFormParams.chainCode,
          public_address: fioActionFormParams.publicAddress,
          max_oracle_fee: DEFAULT_ORACLE_FEE_AMOUNT,
        };
        break;
      case TRANSACTION_ACTION_NAMES[ACTIONS.wrapFioTokens]:
        params.account = FIO_CONTRACT_ACCOUNT_NAMES.fioOracle;
        params.data = {
          ...params.data,
          amount: new FioApi()
            .amountToSUF(Number(fioActionFormParams.amount))
            .toString(),
          chain_code: fioActionFormParams.chainCode,
          public_address: fioActionFormParams.publicAddress,
          max_oracle_fee: DEFAULT_ORACLE_FEE_AMOUNT,
        };
        break;
      case CUSTOM_ACTION_NAME: {
        const customParams = JSON.parse(fioActionFormParams.customAction);
        params = {
          apiUrl: 'https://fiotestnet.blockpane.com',
          ...customParams,
        };
        break;
      }
      default:
        break;
    }

    signSnapTxn(params);
  }, [activeAction, fioActionFormParams, publicKey, signSnapTxn]);

  const onSubmitActionForm = useCallback(
    (values: any) => {
      setFioActionFormParams(values);
      setExecutedTxn(null);
      setExecutedTxnError(null);
      clearSignTx();
      clearDecryptResults();
    },
    [clearDecryptResults, clearSignTx],
  );

  const onSubmitSecret = useCallback(
    (values: { secret: string }) => {
      const stringToHash = randomBytes(8).toString('hex');

      const generatedNonce = createHmac('sha256', values.secret)
        .update(stringToHash)
        .digest('hex');

      setNonce(generatedNonce);
      clearSignNonceResults();
    },
    [clearSignNonceResults],
  );

  const signNonce = useCallback(() => {
    if (!nonce) return;
    signNonceSnap({ nonce });
  }, [nonce, signNonceSnap]);

  const onDecryptContent = useCallback(() => {
    const params: {
      content: string;
      encryptionPublicKey: string;
      contentType: string;
    } = {
      content: fioActionFormParams.content,
      encryptionPublicKey: fioActionFormParams.encryptionPublicKey,
      contentType: '',
    };

    clearDecryptResults();

    switch (activeAction) {
      case DECRYPT_FIO_REQUEST_CONTENT_NAME:
        params.contentType = FIO_CONTENT_TYPES.NEW_FUNDS;
        break;
      case DECRYPT_OBT_DATA_CONTENT_NAME:
        params.contentType = FIO_CONTENT_TYPES.RECORD_OBT_DATA;
        break;
      default:
        break;
    }

    decryptRequestContent(params);
  }, [
    activeAction,
    clearDecryptResults,
    decryptRequestContent,
    fioActionFormParams?.content,
    fioActionFormParams?.encryptionPublicKey,
  ]);

  return {
    activeAction,
    executedTxn,
    executedTxnError,
    executedTxnLoading,
    fioActionFormParams,
    nonce,
    signature,
    onActionChange,
    onConnectClick,
    onDecryptContent,
    onExecuteTxn,
    onSignTxn,
    onSubmitActionForm,
    onSubmitSecret,
    signNonce,
  };
};
