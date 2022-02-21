import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import { useCheckIfDesktop } from '../../screenType';
import CheckoutPurchaseContainer from '../../components/CheckoutPurchaseContainer';
import { RenderCheckout } from '../../components/CheckoutPurchaseContainer/CheckoutPurchaseComponents';
import '../../helpers/gt-sdk';
import { ROUTES } from '../../constants/routes';
import { totalCost, handleFreeAddressCart } from '../../utils';
import { useWalletBalances } from '../../util/hooks';

const CheckoutPage = props => {
  const {
    loading,
    fioWallets,
    refreshBalance,
    cartItems,
    history,
    paymentWalletPublicKey,
    isAuthenticated,
    setWallet,
    domains,
    hasFreeAddress,
    recalculate,
    prices,
    isProcessing,
  } = props;

  const isDesktop = useCheckIfDesktop();

  useEffect(() => {
    if (!isEmpty(fioWallets)) {
      for (const fioWallet of fioWallets) {
        if (fioWallet.publicKey) {
          refreshBalance(fioWallet.publicKey);
        }
      }
      if (!paymentWalletPublicKey && fioWallets.length === 1) {
        setWallet(fioWallets[0].publicKey);
      }
    }
  }, []);

  const isFree =
    !isEmpty(cartItems) &&
    cartItems.length === 1 &&
    !hasFreeAddress &&
    cartItems[0].allowFree;

  const { total: walletBalancesTotal } = useWalletBalances(
    paymentWalletPublicKey,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (
      !loading &&
      !isFree &&
      walletBalancesTotal.nativeFio < totalCost(cartItems).costFio
    ) {
      history.push(ROUTES.CART);
    }
  }, [walletBalancesTotal.nativeFio]);

  useEffect(() => {
    !isProcessing &&
      handleFreeAddressCart({
        domains,
        recalculate,
        cartItems,
        prices,
        hasFreeAddress,
      });
  }, [domains, hasFreeAddress, prices]);

  const onClose = () => {
    history.push(ROUTES.CART);
  };

  return (
    <PseudoModalContainer title="Make Purchase" onClose={onClose}>
      <CheckoutPurchaseContainer isCheckout>
        <RenderCheckout
          cart={cartItems}
          isDesktop={isDesktop}
          walletBalances={walletBalancesTotal}
        />
      </CheckoutPurchaseContainer>
    </PseudoModalContainer>
  );
};

export default CheckoutPage;
