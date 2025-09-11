import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { createHmac, randomBytes } from 'crypto-browserify';
import {
  signNonce,
  signTransaction,
  decryptContent,
  encryptContent,
  getPublicKey,
} from '@fioprotocol/fio-sdk-lite';
import { Ecc } from '@fioprotocol/fiojs';
import { Account, Action, ContentType } from '@fioprotocol/fiosdk';

import { DecryptedContent } from '@fioprotocol/fio-sdk-lite/dist/types';

import FioApi, { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';
import { apiClient } from '../../../api';

import { FIO_CHAIN_CODE } from '../../../constants/fio';
import { DEFAULT_BUNDLE_SET_VALUE } from '../../../constants/common';
import {
  CUSTOM_ACTION_NAME,
  DECRYPT_FIO_REQUEST_CONTENT_NAME,
  DECRYPT_OBT_DATA_CONTENT_NAME,
  ENCRYPT_FIO_REQUEST_CONTENT_NAME,
  ENCRYPT_OBT_DATA_CONTENT_NAME,
} from '../FioWalletSnapComponent/constants';

import { log } from '../../../util/general';
import { AnyType } from '../../../types';

const BASE_URL = 'https://test.fio.eosusa.io';

const fioCorsFixfetch = window.fetch;
window.fioCorsFixfetch = async (
  uri: RequestInfo | URL,
  opts: RequestInit = {},
) => {
  // @ts-ignore todo: fix headers['Content-Type'] type usage
  if (opts.headers && opts.headers['Content-Type']) {
    // @ts-ignore
    delete opts.headers['Content-Type'];
  }
  try {
    return await fioCorsFixfetch(uri, { ...opts });
  } catch (err) {
    //
  }
};

const fioApi = new FioApi(apiClient);
fioApi.setApiUrls([`${BASE_URL}/v1/`]);

fioApi.setTpid(process.env.REACT_APP_DEFAULT_TPID);

const DEFAULT_ORACLE_FEE_AMOUNT = '150000000000';
const canceledRegexp = /transaction canceled|decrypt fio data canceled/i;

type UseContextProps = {
  activeAction: string;
  decryptedContent: DecryptedContent;
  decryptedError: Error | null;
  encryptedContent: string;
  encryptedError: Error | null;
  executedTxn: AnyType;
  executedTxnError: Error | null;
  executedTxnLoading: boolean;
  fioActionFormParams: AnyType;
  isSignatureVerified: boolean;
  nonce: string;
  signature: string;
  signatureError: Error;
  signedTxn: AnyType;
  signedTxnLoading: boolean;
  signedTxnError: Error | null;
  publicKey: string | null;
  onActionChange: (value: string) => void;
  onDecryptContent: () => void;
  onEncryptContent: () => void;
  onExecuteTxn: () => void;
  onPrivateKeyChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSignTxn: () => void;
  onSubmitActionForm: (values: AnyType) => void;
  onSubmitSecret: (values: { secret: string }) => void;
  signNonceByLib: () => void;
};

export const useContext = (): UseContextProps => {
  const [nonce, setNonce] = useState<string>(null);
  const [signature, setSignature] = useState<string>(null);
  const [signatureError, setSignatureError] = useState<Error>(null);
  const [isSignatureVerified, setIsSignatureVerified] = useState<
    boolean | null
  >(null);

  const [signedTxnLoading, toggleSignedTxnLoading] = useState<boolean>(false);
  const [signedTxn, setSignedTxn] = useState<AnyType | null>(null);
  const [signedTxnError, setSignedTxnError] = useState<Error | null>(null);

  const [
    decryptedContent,
    setDecryptedContent,
  ] = useState<DecryptedContent | null>(null);
  const [decryptedError, setDecryptedError] = useState<Error | null>(null);

  const [encryptedContent, setEncryptedContent] = useState<string | null>(null);
  const [encryptedError, setEncryptedError] = useState<Error | null>(null);

  const [executedTxn, setExecutedTxn] = useState<AnyType | null>(null);
  const [executedTxnError, setExecutedTxnError] = useState<Error | null>(null);
  const [executedTxnLoading, toggleExecutedTxnLoading] = useState<boolean>(
    false,
  );

  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [
    fioActionFormParams,
    setFioActionFormParams,
  ] = useState<AnyType | null>(null);

  const [privateKey, setPrivateKey] = useState<string>(null);
  const [publicKey, setPublicKey] = useState<string>(null);

  const clearDecryptResults = useCallback(() => {
    setDecryptedError(null);
    setDecryptedContent(null);
  }, []);

  const clearEncryptResults = useCallback(() => {
    setEncryptedError(null);
    setEncryptedContent(null);
  }, []);

  const clearSignTx = useCallback(() => {
    setSignedTxn(null);
    setSignedTxnError(null);
  }, []);

  const onActionChange = useCallback(
    (value: string) => {
      clearSignTx();
      clearDecryptResults();
      clearEncryptResults();
      setActiveAction(value);
    },
    [clearDecryptResults, clearEncryptResults, clearSignTx],
  );

  const verifySignature = useCallback(
    async ({ signature, nonce }: { signature: string; nonce: string }) => {
      const isVerified = await Ecc.verify(signature, nonce, publicKey);
      setIsSignatureVerified(isVerified);
    },
    [publicKey],
  );

  const signNonceByLib = useCallback(async () => {
    try {
      const signature = signNonce({ nonce, privateKey });
      setSignature(signature);
      verifySignature({ signature, nonce });
    } catch (error) {
      log.error(error);
      setSignatureError(error);
    }
  }, [nonce, privateKey, verifySignature]);

  const onSubmitSecret = useCallback((values: { secret: string }) => {
    const stringToHash = randomBytes(8).toString('hex');

    const generatedNonce = createHmac('sha256', values.secret)
      .update(stringToHash)
      .digest('hex');

    setNonce(generatedNonce);
  }, []);

  const onSubmitActionForm = useCallback(
    (values: AnyType) => {
      setFioActionFormParams(values);
      setExecutedTxn(null);
      setExecutedTxnError(null);
      clearSignTx();
      clearDecryptResults();
      clearEncryptResults();
    },
    [clearDecryptResults, clearEncryptResults, clearSignTx],
  );

  const signSnapTxn = useCallback(async (params: AnyType) => {
    try {
      setSignedTxnError(null);
      toggleSignedTxnLoading(true);
      log.info(params);
      const signedTxn = await signTransaction(params);

      setSignedTxn(JSON.parse(signedTxn));
    } catch (error) {
      log.error('Sign transaction error:', error);
      setSignedTxnError(error);
    } finally {
      toggleSignedTxnLoading(false);
    }
  }, []);

  const onSignTxn = useCallback(async () => {
    let params: {
      apiUrl: string;
      actionParams: Array<{
        actor?: string;
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
          max_fee: string;
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
      }>;
      privateKey: string;
    } = {
      apiUrl: BASE_URL,
      actionParams: [
        {
          action: activeAction,
          account: Account.address,
          data: {
            tpid: process.env.REACT_APP_DEFAULT_TPID || '',
            max_fee: DEFAULT_ACTION_FEE_AMOUNT,
          },
        },
      ],
      privateKey,
    };

    switch (activeAction) {
      case Action.addBundledTransactions:
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          fio_address: fioActionFormParams.fioHandle,
          bundle_sets: DEFAULT_BUNDLE_SET_VALUE,
        };
        break;
      case Action.addNft:
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
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
      case Action.addPublicAddresses:
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
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
      case Action.cancelFundsRequest:
        params.actionParams[0].account = Account.reqObt;
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          fio_request_id: fioActionFormParams.fioRequestId,
        };
        break;
      case Action.recordObt: {
        const payeePublicKey = await fioApi.getFioPublicAddress(
          fioActionFormParams.payeeFioHandle,
        );
        params.actionParams[0].account = Account.reqObt;
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
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
        params.actionParams[0].contentType = ContentType.recordObtDataContent;
        break;
      }
      case Action.regAddress:
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          fio_address: fioActionFormParams.fioHandle,
          owner_fio_public_key: publicKey,
        };
        break;
      case Action.regDomain:
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          fio_domain: fioActionFormParams.fioDomain,
          owner_fio_public_key: publicKey,
        };
        break;
      case Action.newFundsRequest:
        {
          params.actionParams[0].account = Account.reqObt;
          params.actionParams[0].data = {
            ...params.actionParams[0].data,
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
          params.actionParams[0].contentType = ContentType.newFundsContent;
          const payerFioPublicKey = await fioApi.getFioPublicAddress(
            fioActionFormParams.payerFioHandle,
          );
          params.actionParams[0].payerFioPublicKey =
            payerFioPublicKey.public_address;
        }
        break;
      case Action.setDomainPublic:
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          fio_domain: fioActionFormParams.fioDomain,
          is_public: Number(fioActionFormParams.isPublic),
        };
        break;
      case Action.rejectFundsRequest:
        params.actionParams[0].account = Account.reqObt;
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          fio_request_id: fioActionFormParams.fioRequestId,
        };
        break;
      case Action.removeAllAddresses:
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          fio_address: fioActionFormParams.fioHandle,
        };
        break;
      case Action.removeAddress:
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
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
      case Action.renewDomain:
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          fio_domain: fioActionFormParams.fioDomain,
        };
        break;
      case Action.stake:
        params.actionParams[0].account = Account.staking;
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          fio_address: fioActionFormParams.fioHandle,
          amount: fioApi.amountToSUF(fioActionFormParams.amount),
          tpid: 'dashboard@fiotestnet',
        };
        break;
      case Action.transferAddress:
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          fio_address: fioActionFormParams.fioHandle,
          new_owner_fio_public_key: fioActionFormParams.newOwnerPublicKey,
        };
        break;
      case Action.transferDomain:
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          fio_domain: fioActionFormParams.fioDomain,
          new_owner_fio_public_key: fioActionFormParams.newOwnerPublicKey,
        };
        break;
      case Action.transferTokensKey:
        params.actionParams[0].account = Account.token;
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          amount: fioApi.amountToSUF(fioActionFormParams.amount),
          payee_public_key: fioActionFormParams.payeeFioPublicKey,
        };
        break;
      case Action.unstake:
        params.actionParams[0].account = Account.staking;
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          fio_address: fioActionFormParams.fioHandle,
          amount: fioApi.amountToSUF(fioActionFormParams.amount),
          tpid: 'dashboard@fiotestnet',
        };
        break;
      case Action.wrapDomain:
        params.actionParams[0].account = Account.oracle;
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          fio_domain: fioActionFormParams.fioDomain,
          chain_code: fioActionFormParams.chainCode,
          public_address: fioActionFormParams.publicAddress,
          max_oracle_fee: DEFAULT_ORACLE_FEE_AMOUNT,
        };
        break;
      case Action.wrapTokens:
        params.actionParams[0].account = Account.oracle;
        params.actionParams[0].data = {
          ...params.actionParams[0].data,
          amount: fioApi.amountToSUF(fioActionFormParams.amount),
          chain_code: fioActionFormParams.chainCode,
          public_address: fioActionFormParams.publicAddress,
          max_oracle_fee: DEFAULT_ORACLE_FEE_AMOUNT,
        };
        break;
      case CUSTOM_ACTION_NAME: {
        const customParams = JSON.parse(fioActionFormParams.customAction);
        params = {
          apiUrl: BASE_URL,
          ...customParams,
        };
        break;
      }
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
    fioActionFormParams?.customAction,
    fioActionFormParams?.fioDomain,
    fioActionFormParams?.fioHandle,
    fioActionFormParams?.fioRequestId,
    fioActionFormParams?.hash,
    fioActionFormParams?.isPublic,
    fioActionFormParams?.memo,
    fioActionFormParams?.newOwnerPublicKey,
    fioActionFormParams?.obtId,
    fioActionFormParams?.offLineUrl,
    fioActionFormParams?.offlineUrl,
    fioActionFormParams?.payeeFioHandle,
    fioActionFormParams?.payeeFioPublicKey,
    fioActionFormParams?.payeeTokenPublicAddress,
    fioActionFormParams?.payerFioHandle,
    fioActionFormParams?.publicAddress,
    fioActionFormParams?.tokenCode,
    fioActionFormParams?.tokenId,
    fioActionFormParams?.url,
    privateKey,
    publicKey,
    signSnapTxn,
  ]);

  const decryptRequestContent = useCallback(
    async (params: {
      content: string;
      encryptionPublicKey: string;
      fioContentType: string;
      privateKey: string;
    }) => {
      try {
        const decryptedContent = decryptContent(params);
        setDecryptedContent(decryptedContent);
      } catch (error) {
        log.error(error);
        setDecryptedError(error);
      }
    },
    [],
  );

  const encryptRequestContent = useCallback(
    async (params: {
      content: {
        amount: string;
        status: string;
        payee_public_address: string;
        payer_public_address?: string;
        chain_code: string;
        token_code: string;
        obt_id?: string;
        memo: string | null;
        hash: string | null;
        offline_url: string | null;
      };
      encryptionPublicKey: string;
      fioContentType: string;
      privateKey: string;
    }) => {
      try {
        const encryptedContent = encryptContent(params);
        setEncryptedContent(encryptedContent);
      } catch (error) {
        log.error(error);
        setEncryptedError(error);
      }
    },
    [],
  );

  const onDecryptContent = useCallback(() => {
    const params: {
      content: string;
      encryptionPublicKey: string;
      fioContentType: string;
      privateKey: string;
    } = {
      content: fioActionFormParams.content,
      encryptionPublicKey: fioActionFormParams.encryptionPublicKey,
      fioContentType: '',
      privateKey,
    };

    clearDecryptResults();

    switch (activeAction) {
      case DECRYPT_FIO_REQUEST_CONTENT_NAME:
        params.fioContentType = ContentType.newFundsContent;
        break;
      case DECRYPT_OBT_DATA_CONTENT_NAME:
        params.fioContentType = ContentType.recordObtDataContent;
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
    privateKey,
  ]);

  const onEncryptContent = useCallback(() => {
    const params: {
      content: {
        amount: string;
        status: string;
        payee_public_address: string;
        payer_public_address?: string;
        chain_code: string;
        token_code: string;
        obt_id?: string;
        memo: string | null;
        hash: string | null;
        offline_url: string | null;
      };
      encryptionPublicKey: string;
      fioContentType: string;
      privateKey: string;
    } = {
      content: {
        amount: fioActionFormParams.amount,
        status: 'sent_to_blockchain',
        payee_public_address: fioActionFormParams.encryptionPublicKey,
        chain_code: FIO_CHAIN_CODE,
        token_code: FIO_CHAIN_CODE,
        memo: fioActionFormParams.memo || null,
        hash: fioActionFormParams.hash || null,
        offline_url: fioActionFormParams.offlineUrl || null,
        payer_public_address: publicKey,
      },
      encryptionPublicKey: fioActionFormParams.encryptionPublicKey,
      fioContentType: '',
      privateKey,
    };

    clearEncryptResults();

    switch (activeAction) {
      case ENCRYPT_FIO_REQUEST_CONTENT_NAME:
        params.fioContentType = ContentType.newFundsContent;
        break;
      case ENCRYPT_OBT_DATA_CONTENT_NAME:
        params.fioContentType = ContentType.recordObtDataContent;
        params.content.obt_id = fioActionFormParams.obtId;
        break;
      default:
        break;
    }

    encryptRequestContent(params);
  }, [
    activeAction,
    clearEncryptResults,
    encryptRequestContent,
    fioActionFormParams?.amount,
    fioActionFormParams?.encryptionPublicKey,
    fioActionFormParams?.hash,
    fioActionFormParams?.memo,
    fioActionFormParams?.obtId,
    fioActionFormParams?.offlineUrl,
    privateKey,
    publicKey,
  ]);

  const executeFioAction = useCallback(async () => {
    try {
      setExecutedTxnError(null);
      toggleExecutedTxnLoading(true);

      const signedTxns: {
        successed: AnyType[];
        failed: { error: string; id: string }[];
      } = signedTxn;

      const pushTransactionResult = async (
        signedTxn: AnyType,
      ): Promise<AnyType> => {
        // todo: DASH-1242 add apis.fio.checkUrls()
        const pushResult = await fetch(
          `${BASE_URL}/v1/chain/push_transaction`,
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
          const errorMessage =
            (jsonResult.message as string) || 'Something went wrong';

          if (jsonResult.fields) {
            // Handle specific error structure with "fields" array
            const fieldErrors = jsonResult.fields.map((field: AnyType) => ({
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
        return jsonResult;
      };

      const results = await Promise.allSettled(
        signedTxns.successed.map(pushTransactionResult),
      );

      const successedResults: AnyType[] = [];
      const erroredResults: Error[] = [];

      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value !== null) {
          if ('transaction_id' in result.value) {
            successedResults.push(result.value);
          }
        } else if (result.status === 'rejected') {
          if (typeof result.reason === 'string') {
            log.error(`Transaction failed: ${result.reason}`);
            if (
              signedTxns.successed.length === 1 ||
              canceledRegexp.test(result.reason)
            ) {
              throw new Error(result.reason);
            }
          } else {
            erroredResults.push(result.reason);
          }
        }
      });

      const res =
        successedResults.length === 1 ? successedResults[0] : successedResults;

      if (
        (!res || (res && Array.isArray(res) && !res.length)) &&
        erroredResults.length
      ) {
        throw new Error(erroredResults[0].message);
      }
      setExecutedTxn(res);
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

  const onPrivateKeyChange = useCallback(event => {
    setPrivateKey(event.target.value);
  }, []);

  useEffect(() => {
    if (privateKey) {
      const publicKey = getPublicKey({ privateKey });
      setPublicKey(publicKey);
    } else {
      setPublicKey(null);
    }
  }, [privateKey]);

  return {
    activeAction,
    decryptedContent,
    decryptedError,
    encryptedContent,
    encryptedError,
    executedTxn,
    executedTxnError,
    executedTxnLoading,
    fioActionFormParams,
    isSignatureVerified,
    nonce,
    signature,
    signatureError,
    signedTxn,
    signedTxnLoading,
    signedTxnError,
    publicKey,
    onActionChange,
    onDecryptContent,
    onEncryptContent,
    onExecuteTxn,
    onPrivateKeyChange,
    onSignTxn,
    onSubmitActionForm,
    onSubmitSecret,
    signNonceByLib,
  };
};
