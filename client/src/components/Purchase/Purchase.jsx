import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import apis from '../../api/index';

import PurchaseNow from '../PurchaseNow';
import Processing from './Processing';
import { currentScreenType } from '../../screenType';
import { SCREEN_TYPE } from '../../constants/screen';
import { ROUTES } from '../../constants/routes';
import classes from './Purchase.module.scss';
import { isDomain } from '../../utils';

import { RenderChekout, RenderPurchase } from './PurchaseComponents';

const Purchase = props => {
  const {
    isCheckout,
    isPurchase,
    cart,
    currentWallet,
    history,
    isFree,
    recalculate,
    registrationResult: results,
    fioWallets,
    refreshBalance,
    setWallet,
    setRegistration,
    prices,
    getPrices,
    domains,
  } = props;

  const [isProcessing, setProcessing] = useState(false);
  const [errItems, setErrItems] = useState([]);
  const [regItems, setRegItems] = useState([]);

  const hasErrors = !isEmpty(errItems);

  const setResults = (results, isRecalcCart) => {
    const registered = [];
    const errored = [];

    const {
      fio: { address: addressCostFio, domain: domainCostFio },
      usdt: { address: addressCostUsdc, domain: domainCostUsdc },
    } = prices;

    if (!isEmpty(results.errors)) {
      for (const item of results.errors) {
        const { fioName, error, isFree } = item;

        const retObj = {
          id: fioName,
        };

        if (!isDomain(fioName)) {
          const name = fioName.split('@');
          const addressName = name[0];
          const domainName = name[1];

          retObj['address'] = addressName;
          retObj['domain'] = domainName;
          retObj['error'] = error;

          if (isFree) {
            retObj['isFree'] = isFree;
          } else {
            const { free } =
              domains.find(item => item.domain === domainName) || {};
            if (!free) {
              retObj['costFio'] = addressCostFio + domainCostFio;
              retObj['costUsdc'] = addressCostUsdc + domainCostUsdc;
            } else {
              retObj['costFio'] = addressCostFio;
              retObj['costUsdc'] = addressCostUsdc;
            }
          }
        } else {
          retObj['domain'] = fioName;
          retObj['costFio'] = domainCostFio;
          retObj['costUsdc'] = domainCostUsdc;
        }

        errored.push(retObj);
      }
    }

    if (!isEmpty(results.registered)) {
      for (const item of results.registered) {
        const { fioName, isFree, fee_collected } = item;

        const retObj = {
          id: fioName,
        };

        if (!isDomain(fioName)) {
          const name = fioName.split('@');
          const addressName = name[0];
          const domainName = name[1];

          retObj['address'] = addressName;
          retObj['domain'] = domainName;

          if (isFree) {
            retObj['isFree'] = isFree;
          } else {
            retObj['costFio'] = apis.fio.sufToAmount(fee_collected);
            retObj['costUsdc'] =
              (apis.fio.sufToAmount(fee_collected) * addressCostUsdc) /
              addressCostFio;
          }
        } else {
          retObj['domain'] = fioName;
          retObj['costFio'] = apis.fio.sufToAmount(fee_collected);
          retObj['costUsdc'] =
            (apis.fio.sufToAmount(fee_collected) * domainCostUsdc) /
            domainCostFio;
        }

        registered.push(retObj);
      }
    }

    isRecalcCart && recalculate(errored);
    setRegItems(registered);
    setErrItems(errored);
  };

  useEffect(async () => {
    if (!isEmpty(results)) {
      setResults(results);
    }
    return () => {
      setRegItems([]);
      setErrItems([]);
    };
  }, [results]);

  useEffect(() => {
    getPrices();
    return () => {
      if (isPurchase) {
        setRegistration({});
      }
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(fioWallets) && isCheckout) {
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

  const onClose = () => {
    setRegistration({});
    history.push(ROUTES.DASHBOARD);
  };

  const onFinish = results => {
    setResults(results, true);

    setProcessing(false);
    history.push(ROUTES.PURCHASE);
  };

  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;

  return (
    <div
      className={classnames(classes.container, hasErrors && classes.hasErrors)}
    >
      {isCheckout && (
        <RenderChekout
          cart={cart}
          isDesktop={isDesktop}
          isFree={isFree}
          currentWallet={currentWallet}
        />
      )}
      {isPurchase && (
        <RenderPurchase
          hasErrors={hasErrors}
          regItems={regItems}
          errItems={errItems}
        />
      )}
      {isCheckout || (isPurchase && hasErrors) ? (
        <PurchaseNow
          onFinish={onFinish}
          setProcessing={setProcessing}
          isRetry={isPurchase && hasErrors}
        />
      ) : (
        <Button onClick={onClose} className={classes.button}>
          Close
        </Button>
      )}
      <Processing isProcessing={isProcessing} />
    </div>
  );
};

export default withRouter(Purchase);
