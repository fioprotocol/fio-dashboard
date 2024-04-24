import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import FioRecordFieldContent from './FioRecordFieldContent';

import {
  FIO_RECORD_DETAILED_FIELDS,
  FIO_RECORD_TYPES,
  FIO_RECORD_DETAILED_TYPE,
} from '../constants';

import { FioRecordViewDecrypted, FioRecordViewKeysProps } from '../types';

import classes from '../styles/FioRecordFieldsList.module.scss';

type Props = {
  fieldsList: FioRecordViewKeysProps[];
  fioRecordDecrypted: FioRecordViewDecrypted;
  fioRecordDetailedType: string;
  fioRecordType: string;
};

const FioRecordFieldsList: React.FC<Props> = props => {
  const {
    fieldsList,
    fioRecordDecrypted,
    fioRecordDetailedType,
    fioRecordType,
  } = props;
  const { fioRecord, fioDecryptedContent } = fioRecordDecrypted || {};

  return (
    <div className={classes.fieldsContainer}>
      {fieldsList.map(field => {
        const isDataType = field === FIO_RECORD_DETAILED_FIELDS.type;
        const isShort =
          (isDataType || field === FIO_RECORD_DETAILED_FIELDS.date) &&
          fieldsList.includes(FIO_RECORD_DETAILED_FIELDS.type) &&
          fieldsList.includes(FIO_RECORD_DETAILED_FIELDS.date);

        const value = () => {
          if (isDataType) return fioRecordDetailedType;

          if (fioRecord && field in fioRecord)
            return fioRecord[field as keyof typeof fioRecord] as string;

          if (fioDecryptedContent && field in fioDecryptedContent) {
            return fioDecryptedContent[
              field as keyof typeof fioDecryptedContent
            ];
          }

          return null;
        };

        if (value() == null) return null;

        const renderField = () => {
          if (
            fioRecordType === FIO_RECORD_TYPES.SENT &&
            field === FIO_RECORD_DETAILED_FIELDS.from &&
            fioRecordDetailedType === FIO_RECORD_DETAILED_TYPE.REQUEST
          )
            return 'requestor';

          if (
            fioRecordType === FIO_RECORD_TYPES.DATA &&
            field === FIO_RECORD_DETAILED_FIELDS.from &&
            fioRecordDetailedType === FIO_RECORD_DETAILED_TYPE.PAYMENT
          )
            return 'payer';

          if (field === FIO_RECORD_DETAILED_FIELDS.obtId) return 'ID';
          if (field === FIO_RECORD_DETAILED_FIELDS.chainCode) return 'Chain';
          if (field === FIO_RECORD_DETAILED_FIELDS.memo) return 'Memo';

          if (fioRecordDetailedType === FIO_RECORD_DETAILED_TYPE.RESULT) {
            if (field === FIO_RECORD_DETAILED_FIELDS.from)
              return 'Requesting FIO Handle';
            if (field === FIO_RECORD_DETAILED_FIELDS.to)
              return 'Request sent to FIO Handle';
            if (field === FIO_RECORD_DETAILED_FIELDS.amount)
              return 'Amount Requested';
            return field;
          }

          return field;
        };

        return (
          <div
            className={classnames(classes.container, isShort && classes.short)}
            key={field}
          >
            <Badge show={true} type={BADGE_TYPES.WHITE}>
              <div className={classes.badgeContainer}>
                <p className={classes.title}>{renderField()}</p>
                <p className={classes.content}>
                  <FioRecordFieldContent
                    value={value()}
                    field={field}
                    chain={fioDecryptedContent?.chainCode}
                    token={fioDecryptedContent?.tokenCode}
                  />
                </p>
              </div>
            </Badge>
          </div>
        );
      })}
    </div>
  );
};

export default FioRecordFieldsList;
