import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import FioTransactionItemContent from './FioTransactionItemContent';

import { DETAILED_ITEM_FIELDS } from '../constants';

import { TransactionItemProps, TransactionItemKeysProps } from '../types';

import classes from '../styles/TransactionFieldsList.module.scss';

type Props = {
  fieldsList: TransactionItemKeysProps[];
  transactionItem: TransactionItemProps;
};

const TransactionFieldsList: React.FC<Props> = props => {
  const { fieldsList, transactionItem } = props;
  return (
    <div className={classes.fieldsContainer}>
      {fieldsList.map(field => {
        const isShort =
          field === DETAILED_ITEM_FIELDS.type ||
          field === DETAILED_ITEM_FIELDS.date;

        const value = // @ts-ignore
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
    </div>
  );
};

export default TransactionFieldsList;
