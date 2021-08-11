import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import { useCheckIfDesktop } from '../../screenType';
import CheckoutPurchaseContainer from '../../components/CheckoutPurchaseContainer';
import { RenderCheckout } from '../../components/CheckoutPurchaseContainer/CheckoutPurchaseComponents';
import '../../helpers/gt-sdk';
import { ROUTES } from '../../constants/routes';
import { totalCost, handleFreeAddressCart } from '../../utils';

const CheckoutPage = props => {
  const {
    loading,
    fioWallets,
    refreshBalance,
    cartItems,
    history,
    paymentWalletId,
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
      if (!currentWallet && fioWallets.length === 1) {
        setWallet(fioWallets[0].id);
      }
    }
  }, []);

  const currentWallet =
    paymentWalletId &&
    !isEmpty(fioWallets) &&
    fioWallets.find(item => item.id === paymentWalletId);

  const isFree =
    !isEmpty(cartItems) &&
    cartItems.length === 1 &&
    !hasFreeAddress &&
    cartItems[0].allowFree;

  useEffect(() => {
    if (!isAuthenticated) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (
      !loading &&
      !isEmpty(fioWallets) &&
      !isFree &&
      currentWallet &&
      currentWallet.balance !== null &&
      currentWallet.balance < totalCost(cartItems).costFio
    ) {
      history.push(ROUTES.CART);
    }
  }, [fioWallets]);

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
          currentWallet={currentWallet}
        />
      </CheckoutPurchaseContainer>
    </PseudoModalContainer>
  );
};

export default CheckoutPage;
