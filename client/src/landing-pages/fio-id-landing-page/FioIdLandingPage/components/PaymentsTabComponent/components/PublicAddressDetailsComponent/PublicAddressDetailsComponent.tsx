import React, { useCallback } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QRCode from 'qrcode.react';

import CopyTooltip from '../../../../../../../components/CopyTooltip';
import InfoBadge from '../../../../../../../components/InfoBadge/InfoBadge';
import Badge, {
  BADGE_TYPES,
} from '../../../../../../../components/Badge/Badge';

import { PublicAddressItem } from '../../PaymentsTabComponentContext';
import { ChainComponent } from '../ChainComponent';

import { copyToClipboard } from '../../../../../../../util/general';

import classes from './PublicAddressDetailsComponent.module.scss';

type Props = { fch: string } & PublicAddressItem;

export const PublicAddressDetailsComponent: React.FC<Props> = props => {
  const {
    chainCodeName,
    fch,
    iconSrc,
    publicAddress,
    tokenCode,
    tokenCodeName,
  } = props;

  const onCopy = useCallback(() => {
    void copyToClipboard(publicAddress);
  }, [publicAddress]);

  return (
    <div className={classes.container}>
      <ChainComponent
        chainCodeName={chainCodeName}
        hasBigImage
        iconSrc={iconSrc}
        tokenCodeName={tokenCodeName}
        tokenCode={tokenCode}
      />
      <InfoBadge
        message={
          tokenCode ? (
            <span>
              You’re sending {tokenCodeName} ({tokenCode}) on the&nbsp;
              {chainCodeName} chain.&nbsp;
              <span className="boldText">
                Please make sure this is correct.
              </span>
            </span>
          ) : (
            <span>You can send any {chainCodeName} token to this address.</span>
          )
        }
        show={chainCodeName !== tokenCodeName}
        title="Chain"
        type={BADGE_TYPES.INFO}
        iconOnTop
      />
      <p className={classes.fch}>
        FIO Handle: <span>{fch}</span>
      </p>
      <div className={classes.qr}>
        <QRCode value={publicAddress} />
      </div>
      <p className={classes.mappedText}>Mapped Address</p>
      <Badge show type={BADGE_TYPES.WHITE} className={classes.pubAddressBadge}>
        <p className={classes.publicAddress}>{publicAddress}</p>
        <CopyTooltip>
          <div className={classes.iconContainer} onClick={onCopy}>
            <ContentCopyIcon className={classes.icon} />
          </div>
        </CopyTooltip>
      </Badge>
    </div>
  );
};
