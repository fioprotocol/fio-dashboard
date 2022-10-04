import React, { useState } from 'react';

import { Table } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import classNames from 'classnames';

import { useHistory } from 'react-router';

import Loader from '../../../components/Loader/Loader';
import DetailsModal from './components/DetailsModal';

import usePagination from '../../../hooks/usePagination';
import { formatDateToLocale } from '../../../helpers/stringFormatters';
import apis from '../../../api';

import { ROUTES } from '../../../constants/routes';

import { PageProps } from './types';
import { WrapStatusWrapItem } from '../../../types';

import classes from './WrapStatus.module.scss';

export const parseActionStatus = (
  item: WrapStatusWrapItem,
): {
  badgeType: string;
  badgeText: string;
  isComplete: boolean;
} => {
  const TRANSACTION_OUT_OF_TIME_MILLISECONDS = 10 * 60 * 1000; // 10 minutes - time delay which proves that transaction wasn't completed successfully (oracle - 1m, wrap_status job - 1m, else - chains requests)

  let badgeType;
  let badgeText;
  const isTransactionIsOutOfTime = (date?: string) => {
    if (!date) return true;
    return (
      new Date().getTime() - new Date(date).getTime() >=
      TRANSACTION_OUT_OF_TIME_MILLISECONDS
    );
  };

  const isCompleteAction = (data: WrapStatusWrapItem) => {
    return (
      data?.confirmData &&
      (!Object.keys(data.confirmData).includes('isComplete') ||
        !!data.confirmData.isComplete)
    );
  };

  const isComplete = isCompleteAction(item);
  if (isComplete) {
    badgeType = 'primary';
    badgeText = 'Complete';
  } else {
    if (isTransactionIsOutOfTime(item?.data?.action_trace?.block_time)) {
      badgeType = 'danger';
      badgeText = 'Failed';
    } else {
      badgeType = 'secondary';
      badgeText = 'Pending';
    }
  }

  return {
    badgeType,
    badgeText,
    isComplete,
  };
};

const WrapStatus: React.FC<PageProps> = props => {
  const { loading, isWrap, isTokens, data, getData } = props;

  const history = useHistory();

  const [isWrapSelected, setIsWrapSelected] = useState<boolean>(isWrap);
  const [isTokensSelected, setIsTokensSelected] = useState<boolean>(isTokens);

  const [modalData, setModalData] = useState<WrapStatusWrapItem | null>(null);

  const { paginationComponent } = usePagination(getData);

  const openDetailsModal = (item: WrapStatusWrapItem) => setModalData(item);
  const closeDetailsModal = () => setModalData(null);

  const handleOpenLink = () => {
    if (isWrapSelected && isTokensSelected)
      history.push(ROUTES.WRAP_STATUS_WRAP_TOKENS);
    if (isWrapSelected && !isTokensSelected)
      history.push(ROUTES.WRAP_STATUS_WRAP_DOMAINS);
    if (!isWrapSelected && !isTokensSelected)
      history.push(ROUTES.WRAP_STATUS_UNWRAP_DOMAINS);
    if (!isWrapSelected && isTokensSelected)
      history.push(ROUTES.WRAP_STATUS_UNWRAP_TOKENS);
  };

  return (
    <>
      <div className={classes.tableContainer}>
        <div className="d-flex my-3">
          <select
            className={classNames(
              'custom-select custom-select-lg mr-3',
              classes.navSelect,
            )}
            defaultValue={isWrapSelected ? 0 : 1}
            onChange={e => setIsWrapSelected(!parseInt(e.target.value))}
          >
            <option value={0}>Wrap</option>
            <option value={1}>Unwrap</option>
          </select>

          <select
            className={classNames(
              'custom-select custom-select-lg mr-3',
              classes.navSelect,
            )}
            defaultValue={isTokensSelected ? 0 : 1}
            onChange={e => setIsTokensSelected(!parseInt(e.target.value))}
          >
            <option value={0}>Tokens</option>
            <option value={1}>Domains</option>
          </select>

          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={
              isWrap === isWrapSelected && isTokens === isTokensSelected
            }
            onClick={handleOpenLink}
          >
            Show
          </button>
        </div>

        <div>
          <h3>
            {isWrap ? 'Wrap' : 'Unwrap'} FIO {isTokens ? 'Tokens' : 'Domains'}
          </h3>
        </div>

        <Table className="table" striped={true}>
          <thead>
            <tr>
              <th scope="col">
                Transaction
                {isWrap ? ' Id' : ' Hash'}
              </th>
              <th scope="col">Address</th>
              <th scope="col">{!isTokens ? 'Domain' : 'Amount'}</th>
              {!isWrap ? <th scope="col">FIO Address</th> : null}
              <th scope="col">Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0
              ? data.map((listItem, i) => (
                  <tr key={listItem.transactionId || listItem.transactionHash}>
                    <th
                      className={classes.link}
                      onClick={openDetailsModal.bind(null, listItem)}
                    >
                      {listItem.transactionId || listItem.transactionHash}
                    </th>
                    <th>{listItem.address}</th>
                    <th>
                      {!isTokens
                        ? listItem.domain
                        : apis.fio
                            .sufToAmount(listItem.amount || 0)
                            .toFixed(2) + ' FIO'}
                    </th>
                    {!isWrap ? <th>{listItem.fioAddress}</th> : null}
                    <th>
                      {listItem.data.action_trace?.block_time
                        ? formatDateToLocale(
                            listItem.data.action_trace.block_time,
                          )
                        : null}
                      {listItem.confirmData?.length &&
                      listItem.confirmData[0].action_trace?.block_time
                        ? formatDateToLocale(
                            listItem.confirmData[0].action_trace.block_time,
                          )
                        : null}
                    </th>
                    <th>
                      <Badge
                        variant={parseActionStatus(listItem).badgeType}
                        // variant={
                        //   isCompleteAction(listItem) ? 'primary' : 'secondary'
                        // }
                      >
                        {parseActionStatus(listItem).badgeText}
                      </Badge>
                    </th>
                  </tr>
                ))
              : null}
          </tbody>
        </Table>

        {paginationComponent}

        {loading && <Loader />}
      </div>

      <DetailsModal
        itemData={modalData}
        onClose={closeDetailsModal}
        isWrap={isWrap}
        isTokens={isTokens}
      />
    </>
  );
};

export default WrapStatus;
