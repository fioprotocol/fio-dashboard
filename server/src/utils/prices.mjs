import X from '../services/Exception.mjs';

export const checkPrices = (prices, roe) => {
  const {
    addBundles: addBundlesPrice,
    address: addressPrice,
    domain: domainPrice,
    combo: comboPrice,
    renewDomain: renewDomainPrice,
  } = prices;

  const isEmptyPrices =
    !addBundlesPrice || !addressPrice || !domainPrice || !comboPrice || !renewDomainPrice;

  if (isEmptyPrices) {
    throw new X({
      code: 'ERROR',
      fields: {
        prices: 'PRICES_ARE_EMPTY',
      },
    });
  }

  if (!roe) {
    throw new X({
      code: 'ERROR',
      fields: {
        roe: 'ROE_IS_EMPTY',
      },
    });
  }
};
