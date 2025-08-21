import { FC, useContext } from 'react';
import classnames from 'classnames';
import {
  Accordion,
  AccordionContext,
  AccordionToggleProps,
  useAccordionToggle,
} from 'react-bootstrap';
import ExpandMore from '@mui/icons-material/ExpandMore';

import Badge from '../../../../components/Badge/Badge';
import CartItem from '../../../../components/Cart/CartItem';

import { BADGE_TYPES } from '../../../../components/Badge/Badge';
import { DOMAIN_TYPE } from '../../../../constants/fio';

import MathOp from '../../../../util/math';

import apis from '../../../../api';

import { OrderItemDetailed } from '../../../../types';

import classes from './OrderItem.module.scss';

const DEFAULT_AMOUNT_OF_TRANSACTIONS_TO_SPLIT = 5;

const CustomToggle = ({
  eventKey,
  title,
  onClick,
}: AccordionToggleProps & { title: string }) => {
  const activeEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(eventKey, onClick);

  const isActive = activeEventKey === eventKey;

  const prefix = isActive ? 'Hide' : 'Show';

  return (
    <div className={classes.accordionItemContainer}>
      <h5 className={classes.accordionItemTitle} onClick={decoratedOnClick}>
        {`${prefix} ${title}`}
      </h5>
      <div className={classes.iconContainer}>
        <ExpandMore
          onClick={decoratedOnClick}
          className={classnames(
            classes.titleIcon,
            isActive && classes.isActiveIcon,
          )}
        />
      </div>
    </div>
  );
};

type Props = OrderItemDetailed & {
  isEditable?: boolean;
};

export const OrderItem: FC<Props> = props => {
  const {
    address,
    hasCustomDomain,
    domain,
    type,
    period,
    id,
    isFree,
    fee_collected,
    costUsdc,
    transaction_ids,
    isEditable,
  } = props;

  const item = {
    address,
    domain,
    type,
    period,
    costFio: fee_collected ? apis.fio.sufToAmount(fee_collected) : null,
    costUsdc,
    costNativeFio: fee_collected ? new MathOp(fee_collected).toString() : null,
    id,
    isFree,
    hasCustomDomain,
    domainType: hasCustomDomain
      ? DOMAIN_TYPE.CUSTOM
      : fee_collected
      ? DOMAIN_TYPE.PREMIUM
      : DOMAIN_TYPE.ALLOW_FREE,
  };

  const transactionIdsList =
    transaction_ids?.length > 0
      ? transaction_ids?.filter(transaction_id => !!transaction_id)
      : [];

  // Split transaction IDs into two arrays if more than DEFAULT_AMOUNT_OF_TRANSACTIONS_TO_SPLIT
  const defaultAmountOfTransactions = transactionIdsList.slice(
    0,
    DEFAULT_AMOUNT_OF_TRANSACTIONS_TO_SPLIT,
  );
  const remainingTransactions = transactionIdsList.slice(
    DEFAULT_AMOUNT_OF_TRANSACTIONS_TO_SPLIT,
  );

  const renderTransactionBadges = ({
    transactions,
    className,
  }: {
    transactions: string[];
    className?: string;
  }) => {
    return transactions.map(transaction_id => (
      <Badge
        key={transaction_id}
        type={BADGE_TYPES.SIMPLE}
        show={!!transaction_id}
        className={classnames('mt-3', className)}
      >
        <div className={classes.item}>
          <span className={classnames(classes.name, 'boldText')}>
            Transaction ID
          </span>
          <p className={classes.itemValue}>
            <a
              href={`${process.env.REACT_APP_FIO_BLOCKS_TX_URL}${transaction_id}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="boldText">{transaction_id}</span>
            </a>
          </p>
        </div>
      </Badge>
    ));
  };

  return (
    <>
      <CartItem item={item} isEditable={isEditable} />
      {renderTransactionBadges({ transactions: defaultAmountOfTransactions })}
      {remainingTransactions.length > 0 && (
        <Badge type={BADGE_TYPES.SIMPLE} show className={classes.accordion}>
          <Accordion className="w-100" defaultActiveKey="0">
            <CustomToggle
              eventKey="0"
              title={`${remainingTransactions.length} more transaction${
                remainingTransactions.length > 1 ? 's' : ''
              }`}
            ></CustomToggle>
            <Accordion.Collapse eventKey="0">
              <>
                {renderTransactionBadges({
                  transactions: remainingTransactions,
                  className: classes.accordionContent,
                })}
              </>
            </Accordion.Collapse>
          </Accordion>
        </Badge>
      )}
    </>
  );
};
