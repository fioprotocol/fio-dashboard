import React, { useCallback } from 'react';
import { Button } from 'react-bootstrap';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import CopyTooltip from '../../../../components/CopyTooltip';

import { copyToClipboard } from '../../../../util/general';

import classes from '../../styles/WalletDetailsModal.module.scss';

const PrivateKeyDisplay: React.FC<{ value: string }> = ({
  value: privateKey,
}) => {
  const onCopy = useCallback(() => {
    copyToClipboard(privateKey);
  }, [privateKey]);

  return (
    <>
      <div className={classes.privateKeyLabel}>This is your private key</div>

      <Badge type={BADGE_TYPES.WHITE} show={true}>
        <div className={classes.publicAddressContainer}>
          <div className={classnames(classes.publicKey, 'sentry-mask')}>
            {privateKey}
          </div>
        </div>
      </Badge>

      <div className={classes.actionButtons}>
        <CopyTooltip>
          <Button onClick={onCopy} className={classes.iconContainer}>
            <ContentCopyIcon className={classes.icon} />
          </Button>
        </CopyTooltip>
      </div>
    </>
  );
};

export default PrivateKeyDisplay;
