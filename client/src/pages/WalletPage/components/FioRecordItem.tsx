import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import FioRequestStatusBadge from '../../../components/Badges/FioRequestStatusBadge/FioRequestStatusBadge';

import CommonBadge from '../../../components/Badges/CommonBadge/CommonBadge';
import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';

import { commonFormatTime } from '../../../util/general';
import { transformFioRecord } from '../util';

import { CONTENT_TYPE } from '../constants';

import { FioRecord } from '../../../types';

import classes from '../styles/FioRecordItem.module.scss';

type Props = {
  fioRecord: FioRecord;
  fioRecordType: string;
  publicKey: string;
  onClick: (fioRecord: FioRecord) => void;
};

const renderSenderInfo = ({
  title,
  senderAddress,
}: {
  title: string | null;
  senderAddress: string;
}) => {
  if (!title) return null;

  return (
    <p className={classes.senderInfo}>
      {title}: <span className={classes.senderAddress}>{senderAddress}</span>
    </p>
  );
};

const FioRecordItem: React.FC<Props> = props => {
  const { fioRecord, onClick, fioRecordType, publicKey } = props;

  const {
    fioRecord: { fioTxType, from, to, status, date },
  } = transformFioRecord({
    fioRecordItem: { fioRecord, fioDecryptedContent: null },
    fioRecordType,
    publicKey,
  });

  const senderInfo = {
    title: CONTENT_TYPE[fioTxType].from
      ? CONTENT_TYPE[fioTxType].from
      : CONTENT_TYPE[fioTxType].to,
    senderAddress: CONTENT_TYPE[fioTxType].from ? from : to,
  };

  return (
    <div className={classes.badgeContainer} onClick={() => onClick(fioRecord)}>
      <Badge type={BADGE_TYPES.BORDERED} show={true}>
        <div className={classes.badgeItem}>
          <div className={classes.dateTypeContainer}>
            <div className={classes.fioDataTypeContainer}>
              <CommonBadge
                isBlue={CONTENT_TYPE[fioTxType].isBlue}
                isGreen={CONTENT_TYPE[fioTxType].isGreen}
              >
                <div className={classes.iconContainer}>
                  <FontAwesomeIcon
                    icon={CONTENT_TYPE[fioTxType].icon}
                    className={classes.icon}
                  />
                </div>
              </CommonBadge>
              <p className={classes.fioTxType}>{fioTxType}</p>
            </div>
            <div className={classes.date}>{commonFormatTime(date)}</div>
          </div>
          {renderSenderInfo(senderInfo)}
          {status && (
            <div className={classes.statusContainer}>
              <FioRequestStatusBadge status={status} />
            </div>
          )}
          <FontAwesomeIcon icon="chevron-right" className={classes.iconArrow} />
        </div>
      </Badge>
    </div>
  );
};

export default FioRecordItem;
