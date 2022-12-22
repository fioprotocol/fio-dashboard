import React, { useCallback } from 'react';
import classnames from 'classnames';
import CheckCircle from '@mui/icons-material/CheckCircle';

import { AnyObject } from '../../../types';

import classes from '../styles/AddToken.module.scss';

type Props = {
  currency: AnyObject;
  isSelected: boolean;
  onAddCryptocurrency: (currency: AnyObject) => void;
};

export const AddTokenPopularCryptocurrency: React.FC<Props> = props => {
  const { currency, isSelected, onAddCryptocurrency } = props;

  const handleAddCryptocurrency = useCallback(() => {
    if (isSelected) {
      return;
    }
    onAddCryptocurrency(currency);
  }, [currency, isSelected, onAddCryptocurrency]);

  return (
    <div
      className={classnames(
        classes.popularListItem,
        isSelected && classes.popularListItemSelected,
      )}
      onClick={handleAddCryptocurrency}
    >
      <div className={classes.popularListItemTitle}>
        <div className={classes.popularListItemTitleWrapper}>
          <div
            className={classnames(
              classes.popularListItemTitleLogo,
              classes.popularListItemTitleLogoToken,
              currency.tokenLogoClass,
            )}
          >
            <img src={currency.tokenLogo} alt={currency.title} />
          </div>
          <div
            className={classnames(
              classes.popularListItemTitleLogo,
              classes.popularListItemTitleLogoChain,
              currency.chainLogoClass,
            )}
          >
            <img src={currency.chainLogo} alt={currency.title} />
          </div>
          {currency.title}
        </div>
        <CheckCircle className={classes.popularListItemTitleCheckIcon} />
      </div>

      <div className={classes.popularListItemRow}>
        <span>Token Code:</span>
        {currency.tokenCode}
      </div>

      <div className={classes.popularListItemRow}>
        <span>Chain Code:</span>
        {currency.chainCode}
      </div>
    </div>
  );
};
