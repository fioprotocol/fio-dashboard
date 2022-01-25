import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import TransactionActionButtons from './TransactionActionButtons';
import FioTransactionItemContent from './FioTransactionItemContent';

import { TRANSACTION_ITEM_TYPES, DETAILED_ITEM_FIELDS } from '../constants';
import { FIO_REQUEST_STATUS_TYPES } from '../../../constants/fio';

import { TransactionItemProps, TransactionItemKeysProps } from '../types';

import classes from '../styles/TransactionDetailedItem.module.scss';

type Props = {
  fieldsList: TransactionItemKeysProps[];
  transactionItem: TransactionItemProps;
  type: string;
};

const TransactionDetailedItem: React.FC<Props> = props => {
  const { fieldsList, transactionItem, type } = props;

  if (!transactionItem) return null;

  return (
    <div className={classes.fieldsContainer}>
      {fieldsList.map(field => {
        const isShort =
          field === DETAILED_ITEM_FIELDS.type ||
          field === DETAILED_ITEM_FIELDS.date;

        const value =
          // todo: fix ts issues
          // @ts-ignore
          transactionItem[field] != null
            ? // @ts-ignore
              transactionItem[field]
            : // @ts-ignore
              transactionItem.content[field];

        if (value == null) return null;

        return (
          <div
            className={classnames(classes.container, isShort && classes.short)}
            key={field}
          >
            <Badge show={true} type={BADGE_TYPES.WHITE}>
              <div className={classes.badgeContainer}>
                <p className={classes.title}>{field}</p>
                <p className={classes.content}>
                  <FioTransactionItemContent
                    value={value}
                    field={field}
                    chain={transactionItem.content.chain}
                  />
                </p>
              </div>
            </Badge>
          </div>
        );
      })}
      {transactionItem.status === FIO_REQUEST_STATUS_TYPES.PENDING &&
        type === TRANSACTION_ITEM_TYPES.RECEIVED && (
          <TransactionActionButtons fioRequest={transactionItem} />
        )}
    </div>
  );
};

export default TransactionDetailedItem;
