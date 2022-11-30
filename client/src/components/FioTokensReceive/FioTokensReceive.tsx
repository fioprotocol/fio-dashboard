import React from 'react';
import QRCode from 'qrcode.react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Badge from '../../components/Badge/Badge';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import { DataValue } from './components/DataValue';

import { BADGE_TYPES } from '../Badge/Badge';
import { ROUTES } from '../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { FioAddressDoublet, FioWalletDoublet } from '../../types';

import classes from './FioTokensReceive.module.scss';

type Props = {
  fioWallet: FioWalletDoublet;
  fioCryptoHandles: FioAddressDoublet[];
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  noVerticalMargin?: boolean;
};

export const FioTokensReceive: React.FC<Props> = props => {
  const {
    fioWallet,
    fioCryptoHandles,
    title,
    subtitle,
    onBack,
    noVerticalMargin,
  } = props;

  return (
    <PseudoModalContainer
      title={title}
      middleWidth
      onBack={onBack}
      noVerticalMargin={noVerticalMargin}
    >
      {subtitle && <p className={classes.subtitle}>{subtitle}</p>}
      <p className={classes.text}>
        You can get FIO Tokens by sending them to a public address or FIO Crypto
        Handle from another wallet, sending a FIO Request for tokens to another
        FIO-enabled wallet, or getting them from one of your partners.
      </p>

      <p className={classes.subtitle}>Send FIO Tokens</p>
      <p className={classes.text}>
        Send FIO Tokens to your wallet by QR code capture or copying your public
        address / FIO Crypto Handle to an external wallet.
      </p>

      <div className={classes.walletDetails}>
        <div className={classes.qrCode}>
          <QRCode value={fioWallet.publicKey} size={96} />
        </div>
        <div>
          <Badge type={BADGE_TYPES.WHITE} show>
            <div className={classes.dataContainer}>
              <div className={classes.title}>Public Address</div>
              <DataValue value={fioWallet.publicKey} />
            </div>
          </Badge>

          {fioCryptoHandles.length > 0 && (
            <Badge type={BADGE_TYPES.WHITE} show>
              <div className={classes.dataContainer}>
                <div className={classes.title}>
                  Associated FIO Crypto Handles
                </div>
                {fioCryptoHandles.map(({ name }) => (
                  <div key={name} className={classes.dataContainerValue}>
                    <DataValue value={name} />
                  </div>
                ))}
              </div>
            </Badge>
          )}
        </div>
      </div>

      <hr className={classes.divider} />

      <p className={classes.subtitle}>Send FIO Request</p>

      <p className={classes.text}>
        Send a FIO Request for FIO Tokens to another FIO-enabled wallet.
      </p>

      <Link
        to={{
          pathname: ROUTES.FIO_TOKENS_REQUEST,
          search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}`,
        }}
        className={classes.actionButton}
      >
        <Button>
          <FontAwesomeIcon icon="arrow-down" />
          FIO Request
        </Button>
      </Link>

      <hr className={classes.divider} />

      <p className={classes.subtitle}>Need FIO Tokens?</p>

      <p className={classes.text}>
        FIO tokens are used to pay fees for certain transaction types such as
        FIO Domain and Crypto Handle registrations or adding bundles.
      </p>

      <p className={classnames(classes.text, classes.textMedium)}>
        Get FIO Token from one of our partners today.
      </p>

      <Link
        to={{
          pathname: ROUTES.FIO_TOKENS_GET,
        }}
        className={classes.actionButton}
      >
        <Button>
          <FontAwesomeIcon icon="shopping-cart" />
          Get FIO Tokens
        </Button>
      </Link>
    </PseudoModalContainer>
  );
};
