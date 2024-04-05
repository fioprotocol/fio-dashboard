import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import ActionContainer from '../../../components/LinkTokenList/ActionContainer';
import Modal from '../../../components/Modal/Modal';
import { AddTokenBadge } from './AddTokenBadge';
import { AddTokenPopularCryptocurrency } from './AddTokenPopularCryptocurrency';
import { AddTokenCryptocurrencyForm } from './AddTokenCryptocurrencyForm';

import { ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION } from '../../../constants/fio';
import { CONTAINER_NAMES } from '../../../components/LinkTokenList/constants';

import { genericTokenId } from '../../../util/fio';

import { FormValues, AddTokenFormProps } from '../types';
import { AnyObject, PublicAddressDoublet } from '../../../types';

import classes from '../styles/AddToken.module.scss';

import bitcoinSrc from '../../../assets/images/coin/bitcoin.svg';
import binanceSrc from '../../../assets/images/coin/binance.svg';
import binanceDarkSrc from '../../../assets/images/coin/binance-dark.svg';
import ethereumSrc from '../../../assets/images/coin/ethereum.svg';
import tetherSrc from '../../../assets/images/coin/tether.svg';
import { tokensIcons } from '../../../constants/tokensIcons';

const POPULAR_CURRENCIES: AnyObject[] = [
  {
    key: 1,
    title: 'Bitcoin',
    chainCode: 'BTC',
    tokenCode: 'BTC',
    tokenLogo: bitcoinSrc,
    tokenLogoClass: classes.popularListItemLogoBTC,
    chainLogo: bitcoinSrc,
    chainLogoClass: classes.popularListItemLogoBTC,
  },
  {
    key: 2,
    title: 'Binance',
    chainCode: 'BSC',
    tokenCode: 'BNB',
    tokenLogo: binanceSrc,
    tokenLogoClass: classes.popularListItemLogoBSC,
    chainLogo: binanceDarkSrc,
    chainLogoClass: classes.popularListItemLogoBSC,
  },
  {
    key: 3,
    title: 'Ethereum',
    chainCode: 'ETH',
    tokenCode: 'ETH',
    tokenLogo: ethereumSrc,
    tokenLogoClass: classes.popularListItemLogoETH,
    chainLogo: ethereumSrc,
    chainLogoClass: classes.popularListItemLogoETH,
  },
  {
    key: 4,
    title: 'USDT',
    chainCode: 'ETH',
    tokenCode: 'USDT',
    tokenLogo: tetherSrc,
    tokenLogoClass: classes.popularListItemLogoUSDT,
    chainLogo: ethereumSrc,
    chainLogoClass: classes.popularListItemLogoETH,
  },
  {
    key: 5,
    title: 'USDC',
    chainCode: 'ETH',
    tokenCode: 'USDC',
    tokenLogo: tokensIcons.ETH_USDC,
    tokenLogoClass: classes.popularListItemLogoUSDC,
    chainLogo: ethereumSrc,
    chainLogoClass: classes.popularListItemLogoETH,
  },
];

type NewCryptocurrency = PublicAddressDoublet & { isCustom: boolean };

export const AddTokenForm: React.FC<AddTokenFormProps> = props => {
  const {
    formProps: {
      handleSubmit,
      form: {
        mutators: { push, remove },
      },
      values,
      valid,
    },
    changeBundleCost,
    validateToken,
    publicAddresses,
  } = props;
  const [newCryptocurrency, setNewCryptocurrency] = useState<NewCryptocurrency>(
    null,
  );

  const tokens = useMemo<FormValues['tokens']>(
    () => (values?.tokens?.length ? values.tokens : []),
    [values?.tokens],
  );

  const addTokenRow = useCallback(
    (data: PublicAddressDoublet = null) => {
      push('tokens', data);
      setNewCryptocurrency(null);
    },
    [push],
  );

  const removeTokenRow = useCallback(
    (index: number) => {
      remove('tokens', index);
    },
    [remove],
  );

  const isPopularCryptocurrencySelected = useCallback(
    (currency: PublicAddressDoublet) => {
      return !![...tokens, ...publicAddresses]
        .filter(Boolean)
        .find(
          token =>
            token?.tokenCode === currency.tokenCode &&
            token?.chainCode === currency.chainCode,
        );
    },
    [tokens, publicAddresses],
  );

  const onAddPopularCurrency = useCallback(
    (cryptocurrency: PublicAddressDoublet) => {
      if (isPopularCryptocurrencySelected(cryptocurrency)) {
        return;
      }
      setNewCryptocurrency({
        isCustom: false,
        tokenCode: cryptocurrency.tokenCode,
        chainCode: cryptocurrency.chainCode,
        publicAddress: '',
      });
    },
    [isPopularCryptocurrencySelected],
  );

  const onAddCustomCurrency = useCallback(() => {
    setNewCryptocurrency({
      isCustom: true,
      tokenCode: '',
      chainCode: '',
      publicAddress: '',
    });
  }, []);

  const closeModalClose = useCallback(() => {
    setNewCryptocurrency(null);
  }, []);

  useEffect(
    () =>
      changeBundleCost(
        Math.ceil(tokens.length / ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION),
      ),
    [changeBundleCost, tokens.length],
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit}>
      <ActionContainer
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onActionButtonClick={handleSubmit}
        isDisabled={!valid}
        containerName={CONTAINER_NAMES.ADD}
        {...props}
      >
        <p className={classes.text}>
          Choose from the most popular cryptocurrencies or add a custom
          cryptocurrency on any available chain.
        </p>
        <h5 className={classnames(classes.subtitle, classes.hasMargin)}>
          Add Popular Cryptocurrencies
        </h5>
        <div className={classes.popularList}>
          {POPULAR_CURRENCIES.map(currency => (
            <AddTokenPopularCryptocurrency
              key={currency.key}
              currency={currency}
              isSelected={isPopularCryptocurrencySelected(currency)}
              onAddCryptocurrency={onAddPopularCurrency}
            />
          ))}
        </div>

        <h5 className={classnames(classes.subtitle, classes.hasMargin)}>
          Add Custom Cryptocurrency
        </h5>
        <div>
          <Button
            className={classes.addCustomButton}
            onClick={onAddCustomCurrency}
          >
            <AddCircleIcon className={classes.icon} />
            Add
          </Button>
        </div>
        <h5 className={classes.subtitle}>FIO Handle Linking Information</h5>
        {tokens.map((token, index) => (
          <AddTokenBadge
            token={token}
            index={index}
            onRemove={removeTokenRow}
            key={genericTokenId(
              token?.chainCode,
              token?.tokenCode,
              token?.publicAddress,
            )}
          />
        ))}
        <Modal
          show={!!newCryptocurrency}
          onClose={closeModalClose}
          hideCloseButton={false}
          closeButton
          isSimple
          hasDefaultCloseColor
          isWide
        >
          <AddTokenCryptocurrencyForm
            onSubmit={addTokenRow}
            initialValues={newCryptocurrency}
            validate={validateToken}
          />
        </Modal>
      </ActionContainer>
    </form>
  );
};
