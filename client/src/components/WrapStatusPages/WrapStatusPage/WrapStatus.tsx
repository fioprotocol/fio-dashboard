import React, { useState } from 'react';

import { DropdownButton, Table } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';

import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Loader from '../../../components/Loader/Loader';
import DetailsModal from './components/DetailsModal';

import usePagination from '../../../hooks/usePagination';
import { formatDateToLocale } from '../../../helpers/stringFormatters';
import apis from '../../../api';

import { ROUTES } from '../../../constants/routes';

import { PageProps } from './types';
import { WrapStatusWrapItem } from '../../../types';

import classes from './WrapStatus.module.scss';

const isCompleteAction = (data: WrapStatusWrapItem) => {
  return (
    data?.confirmData &&
    (!Object.keys(data.confirmData).includes('isComplete') ||
      !!data.confirmData.isComplete)
  );
};

const WrapStatus: React.FC<PageProps> = props => {
  const { loading, isWrap, isTokens, data, getData } = props;

  const [modalData, setModalData] = useState<WrapStatusWrapItem | null>(null);

  const { paginationComponent } = usePagination(getData);

  const openDetailsModal = (item: WrapStatusWrapItem) => setModalData(item);
  const closeDetailsModal = () => setModalData(null);

  return (
    <>
      <div className={classes.tableContainer}>
        <div className="d-flex my-3">
          <DropdownButton
            id="dropdown-nav-unwrapping"
            title="Wrapping"
            className={classes.navDropdown}
          >
            <div className="pl-4 py-2">
              <Link
                to={ROUTES.WRAP_STATUS_WRAP_TOKENS}
                className={classNames(
                  isWrap && isTokens ? classes.disabled : '',
                )}
              >
                Tokens
              </Link>
            </div>
            <div className="pl-4 py-2">
              <Link
                to={ROUTES.WRAP_STATUS_WRAP_DOMAINS}
                className={classNames(
                  isWrap && !isTokens ? classes.disabled : '',
                )}
              >
                Domains
              </Link>
            </div>
          </DropdownButton>

          <DropdownButton
            id="dropdown-nav-unwrapping"
            title="Unwrapping"
            className={classes.navDropdown}
          >
            <div className="pl-4 py-2">
              <Link
                to={ROUTES.WRAP_STATUS_UNWRAP_TOKENS}
                className={classNames(
                  !isWrap && isTokens ? classes.disabled : '',
                )}
              >
                Tokens
              </Link>
            </div>
            <div className="pl-4 py-2">
              <Link
                to={ROUTES.WRAP_STATUS_UNWRAP_DOMAINS}
                className={classNames(
                  !isWrap && !isTokens ? classes.disabled : '',
                )}
              >
                Domains
              </Link>
            </div>
          </DropdownButton>
        </div>

        <div>
          <h3>
            {isWrap ? 'Wrap' : 'Unwrap'} FIO {isTokens ? 'Tokens' : 'Domains'}{' '}
            actions list.
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
                        variant={
                          isCompleteAction(listItem) ? 'primary' : 'secondary'
                        }
                      >
                        {isCompleteAction(listItem) ? 'Complete' : 'Pending'}
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
        isComplete={isCompleteAction(modalData)}
      />
    </>
  );
};

export default WrapStatus;
