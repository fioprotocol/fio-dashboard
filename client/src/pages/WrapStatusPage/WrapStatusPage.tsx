import React, { useEffect, useState } from 'react';

import { DropdownButton, Table } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';

import { Link, useHistory, useParams } from 'react-router-dom';
import classNames from 'classnames';

import Loader from '../../components/Loader/Loader';
import DetailsModal from './components/DetailsModal';

import usePagination from '../../hooks/usePagination';
import { formatDateToLocale } from '../../helpers/stringFormatters';
import { putParamsToUrl } from '../../utils';
import apis from '../../api';

import { ROUTES } from '../../constants/routes';

import { PageProps } from './types';
import { WrapStatusWrapItem } from '../../types';

import classes from './WrapStatusPage.module.scss';

const PAGE_NAMES = {
  WRAP_TOKENS: 'wrapTokens',
  UNWRAP_TOKENS: 'unwrapTokens',
  WRAP_DOMAINS: 'wrapDomains',
  UNWRAP_DOMAINS: 'unwrapDomains',
};

const isCompleteAction = (data: WrapStatusWrapItem) => {
  return (
    data?.confirmData &&
    (!Object.keys(data.confirmData).includes('isComplete') ||
      !!data.confirmData.isComplete)
  );
};

// todo: move switch logic to index.ts or create four different pages
const WrapStatusPage: React.FC<PageProps> = props => {
  const {
    loading,
    wrapTokensList,
    wrapDomainsList,
    unwrapDomainsList,
    unwrapTokensList,
    getWrapTokensList,
    getWrapDomainsList,
    getUnwrapTokensList,
    getUnwrapDomainsList,
  } = props;

  const history = useHistory();
  const { name: pageName }: { name: string } = useParams();

  const [modalData, setModalData] = useState<WrapStatusWrapItem | null>(null);

  const { paginationComponent } = usePagination(
    (() => {
      let resultGetter;
      switch (pageName) {
        case PAGE_NAMES.WRAP_TOKENS:
          resultGetter = getWrapTokensList;
          break;
        case PAGE_NAMES.WRAP_DOMAINS:
          resultGetter = getWrapDomainsList;
          break;
        case PAGE_NAMES.UNWRAP_TOKENS:
          resultGetter = getUnwrapTokensList;
          break;
        case PAGE_NAMES.UNWRAP_DOMAINS:
          resultGetter = getUnwrapDomainsList;
          break;
        default:
          resultGetter = null;
      }
      return resultGetter;
    })(),
  );

  const openDetailsModal = (item: WrapStatusWrapItem) => setModalData(item);
  const closeDetailsModal = () => setModalData(null);

  useEffect(() => {
    if (!pageName || !Object.values(PAGE_NAMES).includes(pageName))
      history.push(
        putParamsToUrl(ROUTES.WRAP_STATUS, {
          name: PAGE_NAMES.WRAP_TOKENS,
        }),
      );
  }, [history, pageName]);

  const data = (() => {
    let result;
    switch (pageName) {
      case PAGE_NAMES.WRAP_TOKENS:
        result = wrapTokensList;
        break;
      case PAGE_NAMES.WRAP_DOMAINS:
        result = wrapDomainsList;
        break;
      case PAGE_NAMES.UNWRAP_TOKENS:
        result = unwrapTokensList;
        break;
      case PAGE_NAMES.UNWRAP_DOMAINS:
        result = unwrapDomainsList;
        break;
      default:
        result = null;
    }
    return result;
  })();

  const isWrap =
    pageName === PAGE_NAMES.WRAP_DOMAINS || pageName === PAGE_NAMES.WRAP_TOKENS;
  const isTokens =
    pageName === PAGE_NAMES.UNWRAP_TOKENS ||
    pageName === PAGE_NAMES.WRAP_TOKENS;

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
                to={putParamsToUrl(ROUTES.WRAP_STATUS, {
                  name: PAGE_NAMES.WRAP_TOKENS,
                })}
                className={classNames(
                  PAGE_NAMES.WRAP_TOKENS === pageName ? classes.disabled : '',
                )}
              >
                Tokens
              </Link>
            </div>
            <div className="pl-4 py-2">
              <Link
                to={putParamsToUrl(ROUTES.WRAP_STATUS, {
                  name: PAGE_NAMES.WRAP_DOMAINS,
                })}
                className={classNames(
                  PAGE_NAMES.WRAP_DOMAINS === pageName ? classes.disabled : '',
                )}
              >
                Domains
              </Link>
            </div>
          </DropdownButton>
          {(pageName === PAGE_NAMES.WRAP_TOKENS ||
            pageName === PAGE_NAMES.WRAP_DOMAINS) && (
            <div className={classes.navActive} />
          )}

          <DropdownButton
            id="dropdown-nav-unwrapping"
            title="Unwrapping"
            className={classes.navDropdown}
          >
            <div className="pl-4 py-2">
              <Link
                to={putParamsToUrl(ROUTES.WRAP_STATUS, {
                  name: PAGE_NAMES.UNWRAP_TOKENS,
                })}
                className={classNames(
                  PAGE_NAMES.UNWRAP_TOKENS === pageName ? classes.disabled : '',
                )}
              >
                Tokens
              </Link>
            </div>
            <div className="pl-4 py-2">
              <Link
                to={putParamsToUrl(ROUTES.WRAP_STATUS, {
                  name: PAGE_NAMES.UNWRAP_DOMAINS,
                })}
                className={classNames(
                  PAGE_NAMES.UNWRAP_DOMAINS === pageName
                    ? classes.disabled
                    : '',
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
                      {listItem.confirmData?.timestamp
                        ? formatDateToLocale(listItem.confirmData.timestamp)
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

export default WrapStatusPage;
