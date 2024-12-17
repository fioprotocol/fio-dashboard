import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import WalletAction from '../WalletAction/WalletAction';
import SubmitButton from '../common/SubmitButton/SubmitButton';
import { PurchaseMetamaskWallet } from './components/PurchaseMetamaskWallet';

import { setProcessing } from '../../redux/registrations/actions';
import { showGenericErrorModal } from '../../redux/modal/actions';

import {
  cartItems as cartItemsSelector,
  paymentWalletPublicKey as paymentWalletPublicKeySelector,
} from '../../redux/cart/selectors';
import {
  prices as pricesSelector,
  isProcessing as isProcessingSelector,
} from '../../redux/registrations/selectors';
import {
  fioDomains as fioDomainsSelector,
  fioWallets as fioWalletsSelector,
} from '../../redux/fio/selectors';
import { refProfileInfo as refProfileInfoSelector } from '../../redux/refProfile/selectors';

import PurchaseEdgeWallet from './components/PurchaseEdgeWallet';
import PurchaseLedgerWallet from './components/PurchaseLedgerWallet';
import Processing from '../common/TransactionProcessing';

import {
  ANALYTICS_EVENT_ACTIONS,
  CONFIRM_PIN_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../constants/common';
import {
  PAYMENT_OPTIONS,
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../constants/purchase';

import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';
import { sleep } from '../../utils';
import {
  cartHasOnlyFreeItems,
  groupCartItemsByPaymentWallet,
} from '../../util/cart';
import api from '../../api';
import {
  GEETESET_SCRIPT_LOADING_ERROR,
  initCaptcha,
  verifyCaptcha,
} from '../../helpers/captcha';
import { log } from '../../util/general';

// Loads captcha files, DO NOT REMOVE
import '../../helpers/gt-sdk';

import {
  PurchaseValues,
  PurchaseNowTypes,
  GroupedPurchaseValues,
} from './types';
import { AnyType, RegistrationResult, VerifyParams } from '../../types';

const MIN_WAIT_TIME = 3000;

type CaptchaResult = { success: boolean; verifyParams: VerifyParams };

export const PurchaseNow: FC<PurchaseNowTypes> = props => {
  const { onFinish, disabled = false } = props;

  const cartItems = useSelector(cartItemsSelector);
  const isProcessing = useSelector(isProcessingSelector);
  const paymentWalletPublicKey = useSelector(paymentWalletPublicKeySelector);
  const prices = useSelector(pricesSelector);
  const refProfileInfo = useSelector(refProfileInfoSelector);

  const [isWaiting, setWaiting] = useState(false);
  const [submitData, setSubmitData] = useState<PurchaseValues | null>(null);
  const t0 = performance.now();
  const [captchaResolving, toggleCaptchaResolving] = useState<boolean>(false);
  const [captchaResult, setCaptchaResult] = useState<CaptchaResult | null>(
    null,
  );

  const dispatch = useDispatch();

  const setProcessingDispatched = useCallback(
    (isSetProcessing: boolean) => {
      dispatch(setProcessing(isSetProcessing));
    },
    [dispatch],
  );

  const waitFn = useCallback(
    async (
      fn: (results: RegistrationResult) => void,
      results: RegistrationResult,
    ) => {
      const t1 = performance.now();

      if (t1 - t0 < MIN_WAIT_TIME) {
        await sleep(MIN_WAIT_TIME - (t1 - t0));
      }
      fn(results);
    },
    [t0],
  );

  const checkCaptcha = useCallback(async () => {
    try {
      toggleCaptchaResolving(true);

      const data = await api.fioReg.initCaptcha();
      const captchaObj = await initCaptcha(data);
      const verifyCaptchaResult = await verifyCaptcha(captchaObj);

      setCaptchaResult(verifyCaptchaResult);
    } catch (error) {
      log.error('Check Captcha error', error);

      if (error === GEETESET_SCRIPT_LOADING_ERROR) {
        const message =
          'Cannot load captcha. If you are using incognito mode in the browser, please check permissions and enable loading third-party scripts. And try again.';
        const title = 'Captcha load fail';
        const buttonText = 'Close';

        dispatch(showGenericErrorModal(message, title, buttonText));
      } else if (typeof error === 'undefined' || error === 'undefined') {
        log.info('Skip captcha error');
      } else {
        dispatch(showGenericErrorModal());
      }
    } finally {
      toggleCaptchaResolving(false);
      setWaiting(false);
    }
  }, [dispatch]);

  const onProcessingEnd = useCallback(
    (results: RegistrationResult) => {
      results.paymentOption = PAYMENT_OPTIONS.FIO;
      setWaiting(false);
      setSubmitData(null);
      waitFn(onFinish, results);
    },
    [onFinish, waitFn],
  );

  const execRegistration = useCallback(
    captchaVerifyParams => {
      setProcessingDispatched(true);
      onProcessingEnd({
        errors: [],
        registered: [],
        partial: [],
        paymentProvider: PAYMENT_PROVIDER.FIO,
        providerTxStatus: PURCHASE_RESULTS_STATUS.PAYMENT_PENDING,
        captcha: captchaVerifyParams,
      });
    },
    [setProcessingDispatched, onProcessingEnd],
  );

  useEffect(() => {
    if (captchaResult) {
      const { success, verifyParams } = captchaResult;

      if (success && isWaiting) {
        execRegistration(verifyParams);
        setCaptchaResult(null);
      }

      if (success === false) {
        setProcessingDispatched(false);
        setWaiting(false);
      }
    }
  }, [
    captchaResult,
    isWaiting,
    execRegistration,
    onProcessingEnd,
    setProcessingDispatched,
  ]);

  const purchase = () => {
    fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.PURCHASE_STARTED,
      getCartItemsDataForAnalytics(cartItems),
    );
    setWaiting(true);
    const cartHasFreeItemsOnly = cartHasOnlyFreeItems(cartItems);

    if (cartHasFreeItemsOnly) {
      checkCaptcha();
      return;
    }

    setSubmitData({
      cartItems,
      prices,
      refProfileInfo,
    });
    return;
  };

  const onCancel = () => {
    setSubmitData(null);
    setWaiting(false);
    setProcessingDispatched(false);
  };

  const {
    signInValuesGroup,
    onSuccess,
    groupedPurchaseValues,
  } = useMultipleWalletAction({
    fioWallet: paymentWalletPublicKey,
    submitData,
    onCollectedSuccess: onProcessingEnd,
  });

  const handlePartOfSubmitDataSuccess = (data: AnyType) => {
    if (groupedPurchaseValues.length > 1) {
      setProcessing(false);
    }
    onSuccess(data);
  };

  return (
    <>
      <WalletAction
        analyticsData={submitData}
        fioWallet={signInValuesGroup?.signInFioWallet}
        groupedPurchaseValues={groupedPurchaseValues}
        ownerFioPublicKey={paymentWalletPublicKey}
        onCancel={onCancel}
        onSuccess={handlePartOfSubmitDataSuccess}
        processing={isProcessing}
        setProcessing={setProcessingDispatched}
        action={CONFIRM_PIN_ACTIONS.PURCHASE}
        FioActionWallet={PurchaseEdgeWallet}
        MetamaskActionWallet={PurchaseMetamaskWallet}
        LedgerActionWallet={PurchaseLedgerWallet}
      />
      <SubmitButton
        onClick={purchase}
        disabled={captchaResolving || disabled}
        loading={isWaiting || captchaResolving}
        text="Purchase Now"
      />
      {captchaResult && isProcessing && (
        <Processing isProcessing={isProcessing} />
      )}
    </>
  );
};

const initialRegistrationResult: RegistrationResult = {
  errors: [],
  registered: [],
  partial: [],
  paymentProvider: PAYMENT_PROVIDER.FIO,
  providerTxStatus: PURCHASE_RESULTS_STATUS.PAYMENT_PENDING,
};

const WALLET_TYPE_SIGN_IN_ORDER = [
  WALLET_CREATED_FROM.EDGE,
  WALLET_CREATED_FROM.METAMASK,
  WALLET_CREATED_FROM.LEDGER,
  WALLET_CREATED_FROM.WITHOUT_REGISTRATION,
];

type MultipleWalletActionHookProps = {
  fioWallet: string;
  submitData?: PurchaseValues;
  onCollectedSuccess?: (results: RegistrationResult) => void;
};

const useMultipleWalletAction = ({
  fioWallet,
  submitData,
  onCollectedSuccess,
}: MultipleWalletActionHookProps) => {
  const onCollectedSuccessRef = useRef(onCollectedSuccess);
  onCollectedSuccessRef.current = onCollectedSuccess;

  const fioWallets = useSelector(fioWalletsSelector);
  const userDomains = useSelector(fioDomainsSelector);

  const [result, setResult] = useState<RegistrationResult>(
    initialRegistrationResult,
  );
  const [groupedPurchaseValues, setGroupedPurchaseValues] = useState<
    GroupedPurchaseValues[]
  >([]);

  useEffect(() => {
    if (!submitData) {
      setResult(initialRegistrationResult);
      setGroupedPurchaseValues([]);
      return;
    }

    const { cartItems } = submitData;

    const { groups: groupedCartItems } = groupCartItemsByPaymentWallet(
      fioWallet,
      cartItems,
      fioWallets,
      userDomains,
    );

    const groupedPurchaseValues = groupedCartItems.map(
      ({ signInFioWallet, cartItems }) => ({
        signInFioWallet,
        submitData: {
          ...submitData,
          cartItems: cartItems.map(cartItem => ({
            ...cartItem,
            signInFioWallet,
          })),
        },
      }),
    );

    groupedPurchaseValues.sort((g1, g2) => {
      const g1Priority = WALLET_TYPE_SIGN_IN_ORDER.indexOf(
        g1.signInFioWallet.from,
      );
      const g2Priority = WALLET_TYPE_SIGN_IN_ORDER.indexOf(
        g2.signInFioWallet.from,
      );
      return g1Priority - g2Priority;
    });

    setResult(initialRegistrationResult);
    setGroupedPurchaseValues(groupedPurchaseValues);
  }, [fioWallet, submitData, fioWallets, userDomains]);

  useEffect(() => {
    if (groupedPurchaseValues.length === 0 && result.registered.length > 0) {
      onCollectedSuccessRef.current?.(result);
    }
  }, [groupedPurchaseValues, result]);

  const onSuccess = (data: RegistrationResult) => {
    const registeredCartItems = data.registered.map(item => item.cartItemId);
    setResult(result => ({
      ...result,
      registered: [...result.registered, ...data.registered],
    }));
    setGroupedPurchaseValues(groupedPurchaseValues =>
      groupedPurchaseValues
        .map(group => ({
          ...group,
          submitData: {
            ...group.submitData,
            cartItems: group.submitData.cartItems.filter(
              cartItem => !registeredCartItems.includes(cartItem.id),
            ),
          },
        }))
        .filter(group => group.submitData.cartItems.length > 0),
    );
  };

  const [signInValuesGroup] = groupedPurchaseValues;

  return { onSuccess, signInValuesGroup, groupedPurchaseValues };
};
