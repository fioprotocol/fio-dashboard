import React, { useState, useCallback } from 'react';

import { Button, Table } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import classNames from 'classnames';
import DownloadIcon from '@mui/icons-material/Download';
import DatePicker from 'react-datepicker';
import { ExportToCsv } from 'export-to-csv';

import { useHistory } from 'react-router';

import Loader from '../../../components/Loader/Loader';
import DetailsModal from './components/DetailsModal';
import CustomDropdown from '../../CustomDropdown';

import usePagination from '../../../hooks/usePagination';
import { formatDateToLocale } from '../../../helpers/stringFormatters';
import apis from '../../../landing-pages/wrap-status-landing-page/api';

import { log } from '../../../util/general';

import { ROUTES } from '../../../constants/routes';
import {
  WRAP_TYPE_FILTER_OPTIONS,
  WRAP_ASSETS_FILTER_OPTIONS,
  WRAP_DATE_FILTER_OPTIONS,
  WRAP_STATUS_CONTENT,
  WRAP_DATE_FILTER_NAMES,
} from './constants';

import { PageProps } from './types';
import { WrapStatusWrapItem } from '../../../types';
import { WrapStatusListItemsResponse } from '../../../api/responses';

import classes from './WrapStatus.module.scss';
import 'react-datepicker/dist/react-datepicker.css';

const WRAP_FILTERS_NAME = {
  WRAP: 'wrap',
  UNWRAP: 'unwrap',
  TOKENS: 'tokens',
  DOMAINS: 'domains',
  BURNED: 'burned',
};

const WrapStatus: React.FC<PageProps> = props => {
  const { loading, isBurned, isWrap, isTokens, data, getData } = props;

  const history = useHistory();

  const [isWrapSelected, setIsWrapSelected] = useState<boolean>(isWrap);
  const [isTokensSelected, setIsTokensSelected] = useState<boolean>(isTokens);
  const [isBurnedDomainsSelected, setIsBurnedDomainsSelected] = useState<
    boolean
  >(isBurned);

  const [modalData, setModalData] = useState<WrapStatusWrapItem | null>(null);
  const [filters, setFilters] = useState<{
    asset: string | null;
    createdAt: string | null;
    dateRange: { startDate: number; endDate: number } | null;
    type: string | null;
  }>({
    createdAt: null,
    dateRange: null,
    type: isWrapSelected
      ? WRAP_FILTERS_NAME.WRAP
      : isBurnedDomainsSelected
      ? WRAP_FILTERS_NAME.BURNED
      : WRAP_FILTERS_NAME.UNWRAP,
    asset: isTokensSelected
      ? WRAP_FILTERS_NAME.TOKENS
      : WRAP_FILTERS_NAME.DOMAINS,
  });
  const [dateRange, setDateRange] = useState<[Date, Date]>([null, null]);
  const [showDatePicker, toggleShowDatePicker] = useState<boolean>(false);
  const [isExportingCsv, toggleIsExportingCsv] = useState<boolean>(false);

  const [startDate, endDate] = dateRange;

  const { paginationComponent } = usePagination(getData);

  const openDetailsModal = (item: WrapStatusWrapItem) => setModalData(item);
  const closeDetailsModal = () => setModalData(null);

  const openDatePicker = useCallback(() => {
    toggleShowDatePicker(true);
  }, []);

  const closeDatePicker = useCallback(() => {
    toggleShowDatePicker(false);
    setFilters(filters => ({
      ...filters,
      createdAt: null,
      dateRange: null,
    }));
  }, []);

  const handleChangeTypeFilter = useCallback((newValue: string) => {
    setFilters(filters => ({
      ...filters,
      type: newValue,
    }));
  }, []);
  const handleChangeAssetsFilter = useCallback((newValue: string) => {
    setFilters(filters => ({
      ...filters,
      asset: newValue,
    }));
  }, []);

  const setFilterWithDateRange = useCallback(() => {
    setFilters(filters => ({
      ...filters,
      createdAt: null,
      dateRange: {
        startDate: startDate.setHours(0, 0, 0, 0),
        endDate: endDate.setHours(23, 59, 59, 999),
      },
    }));
  }, [startDate, endDate]);

  const handleChangeDateFilter = useCallback(
    (newValue: string) => {
      if (newValue === 'custom') {
        openDatePicker();
      } else {
        setFilters(filters => ({
          ...filters,
          createdAt: newValue,
          dateRange: null,
        }));
      }
    },
    [openDatePicker],
  );

  const handleExportWrapData = useCallback(async () => {
    toggleIsExportingCsv(true);
    const { createdAt, dateRange, type, asset } = filters;
    let wrapData: Partial<WrapStatusListItemsResponse> = {};

    const dateFilters: {
      createdAt: string | null;
      dateRange: { startDate: number; endDate: number };
    } = {
      createdAt: null,
      dateRange,
    };

    if (createdAt) {
      switch (createdAt) {
        case WRAP_DATE_FILTER_NAMES.TODAY:
          dateFilters.createdAt = new Date().toUTCString();
          break;
        case WRAP_DATE_FILTER_NAMES.YESTERDAY:
          dateFilters.createdAt = new Date(
            new Date(new Date().setHours(0, 0, 0, 0)).setDate(
              new Date().getDate() - 1,
            ),
          ).toUTCString();
          break;
        case WRAP_DATE_FILTER_NAMES.LAST7DAYS:
          dateFilters.createdAt = new Date(
            new Date(new Date().setHours(0, 0, 0, 0)).setDate(
              new Date().getDate() - 7,
            ),
          ).toUTCString();
          break;
        case WRAP_DATE_FILTER_NAMES.LASTMONTH:
          dateFilters.createdAt = new Date(
            new Date(new Date().setHours(0, 0, 0, 0)).setMonth(
              new Date().getMonth() - 1,
            ),
          ).toUTCString();
          break;
        case WRAP_DATE_FILTER_NAMES.LASTHALFOFYEAR:
          dateFilters.createdAt = new Date(
            new Date(new Date().setHours(0, 0, 0, 0)).setMonth(
              new Date().getMonth() - 6,
            ),
          ).toUTCString();
          break;
        default:
          break;
      }
    }

    if (type === WRAP_FILTERS_NAME.WRAP) {
      if (asset === WRAP_FILTERS_NAME.TOKENS) {
        wrapData = await apis.wrapStatus.wrapTokensList({
          filters: dateFilters,
        });
      }
      if (asset === WRAP_FILTERS_NAME.DOMAINS) {
        wrapData = await apis.wrapStatus.wrapDomainsList({
          filters: dateFilters,
        });
      }
    }

    if (type === WRAP_FILTERS_NAME.UNWRAP) {
      if (asset === WRAP_FILTERS_NAME.TOKENS) {
        wrapData = await apis.wrapStatus.unwrapTokensList({
          filters: dateFilters,
        });
      }
      if (asset === WRAP_FILTERS_NAME.DOMAINS) {
        wrapData = await apis.wrapStatus.unwrapDomainsList({
          filters: dateFilters,
        });
      }
    }

    if (type === WRAP_FILTERS_NAME.BURNED) {
      wrapData = await apis.wrapStatus.getBurnedDomainsList({
        filters: dateFilters,
      });
    }

    const preparedWrapDataListToCsv: {
      number: number;
      transactionId: string;
      from?: string;
      to?: string;
      amount?: string;
      domain?: string;
      status?: string;
      firstTransaction?: string;
      lastTransaction?: string;
    }[] = [];

    let index = 0;
    for (const wrapItem of wrapData.list) {
      const {
        amount,
        approvals,
        blockTimestamp,
        domain,
        from,
        status,
        to,
        transactionId,
      } = wrapItem;

      const wrapObjectToCsv: {
        number: number;
        transactionId: string;
        from?: string;
        to?: string;
        amount?: string;
        domain?: string;
        status?: string;
        firstTransaction?: string;
        lastTransaction?: string;
      } = {
        number: index + 1,
        transactionId,
      };

      if (asset === WRAP_FILTERS_NAME.TOKENS) {
        wrapObjectToCsv.amount = amount;
      }

      if (asset === WRAP_FILTERS_NAME.DOMAINS) {
        wrapObjectToCsv.domain = domain;
      }

      if (from) {
        wrapObjectToCsv.from = from;
      }
      if (to) {
        wrapObjectToCsv.to = to;
      }

      wrapObjectToCsv.status = WRAP_STATUS_CONTENT[status].text;
      wrapObjectToCsv.firstTransaction = blockTimestamp;
      wrapObjectToCsv.lastTransaction = approvals.blockTimeStamp;

      preparedWrapDataListToCsv.push(wrapObjectToCsv);

      index++;
    }

    const currentDate = new Date();

    const burnHeaders = [
      '#',
      'TransactionId',
      'Domain',
      'Status',
      'Fitst transaction',
      'Last transaction',
    ];

    const headers = [
      '#',
      'TransactionId',
      'From',
      'To',
      asset === WRAP_FILTERS_NAME.TOKENS ? 'Amount' : 'Domain',
      'Status',
      'Fitst transaction',
      'Last transaction',
    ];

    try {
      new ExportToCsv({
        showLabels: true,
        filename: `${type}-${asset}_Total-${
          wrapData.maxCount
        }_${currentDate.getFullYear()}-${currentDate.getMonth() +
          1}-${currentDate.getDate()}_${currentDate.getHours()}-${currentDate.getMinutes()}`,
        headers: isBurned ? burnHeaders : headers,
      }).generateCsv(preparedWrapDataListToCsv);
    } catch (err) {
      log.error(err);
    }

    toggleIsExportingCsv(false);
  }, [filters, isBurned]);

  const handleOpenLink = () => {
    if (isWrapSelected && isTokensSelected && !isBurnedDomainsSelected)
      history.push(ROUTES.WRAP_STATUS_WRAP_TOKENS);
    if (isWrapSelected && !isTokensSelected && !isBurnedDomainsSelected)
      history.push(ROUTES.WRAP_STATUS_WRAP_DOMAINS);
    if (!isWrapSelected && !isTokensSelected && !isBurnedDomainsSelected)
      history.push(ROUTES.WRAP_STATUS_UNWRAP_DOMAINS);
    if (!isWrapSelected && isTokensSelected && !isBurnedDomainsSelected)
      history.push(ROUTES.WRAP_STATUS_UNWRAP_TOKENS);
    if (!isWrapSelected && !isTokensSelected && isBurnedDomainsSelected) {
      history.push(ROUTES.WRAP_STATUS_BURNED_DOMAINS);
    }
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
            defaultValue={isWrapSelected ? 0 : isBurnedDomainsSelected ? 2 : 1}
            onChange={e => {
              if (e.target?.value === '2') {
                setIsBurnedDomainsSelected(true);
                setIsWrapSelected(false);
                setIsTokensSelected(false);
              } else {
                setIsWrapSelected(!parseInt(e.target.value));
                setIsBurnedDomainsSelected(false);
              }
            }}
          >
            <option value={0}>Wrap</option>
            <option value={1}>Unwrap</option>
            <option value={2}>Burned</option>
          </select>

          <select
            className={classNames(
              'custom-select custom-select-lg mr-3',
              classes.navSelect,
            )}
            defaultValue={isTokensSelected ? 0 : 1}
            onChange={e => setIsTokensSelected(!parseInt(e.target.value))}
          >
            {!isBurnedDomainsSelected && <option value={0}>Tokens</option>}
            <option value={1}>Domains</option>
          </select>

          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={
              isWrap === isWrapSelected &&
              isTokens === isTokensSelected &&
              isBurned === isBurnedDomainsSelected
            }
            onClick={handleOpenLink}
          >
            Show
          </button>
        </div>

        <div className={classes.filterContainer}>
          <div className="mr-4">
            <Button
              onClick={handleExportWrapData}
              disabled={isExportingCsv}
              className="d-flex flex-direction-row align-items-center"
            >
              <DownloadIcon className="mr-2" />{' '}
              {isExportingCsv ? (
                <>
                  <span className="mr-3">Exporting...</span>
                  <Loader isWhite hasInheritFontSize hasSmallSize />
                </>
              ) : (
                'Export'
              )}
            </Button>
          </div>
          <div className="d-flex">
            <div className="d-flex align-items-center mr-2">
              Filter Type:&nbsp;
              <CustomDropdown
                value={filters.type}
                options={WRAP_TYPE_FILTER_OPTIONS}
                onChange={handleChangeTypeFilter}
                isDark
                withoutMarginBottom
                fitContentWidth
                isSmall
                placeholder={
                  isWrapSelected
                    ? 'WRAP'
                    : isBurnedDomainsSelected
                    ? 'BURNED'
                    : 'UNWRAP'
                }
              />
            </div>
            <div className="d-flex align-items-center mr-2">
              Filter Assets:&nbsp;
              <CustomDropdown
                value={filters.asset ? filters.asset.toString() : ''}
                options={WRAP_ASSETS_FILTER_OPTIONS}
                onChange={handleChangeAssetsFilter}
                isDark
                withoutMarginBottom
                fitContentWidth
                isSmall
                placeholder={isTokensSelected ? 'TOKENS' : 'DOMAINS'}
              />
            </div>
            <div className="d-flex align-items-center">
              Filter Date:&nbsp;
              {showDatePicker ? (
                <div className={classes.datePickerContainer}>
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={update => {
                      setDateRange(update);
                    }}
                    isClearable={true}
                  />
                  <Button
                    className="btn btn-primary ml-2 mr-2"
                    onClick={setFilterWithDateRange}
                  >
                    Set Date
                  </Button>
                  <Button className="btn btn-danger" onClick={closeDatePicker}>
                    Close
                  </Button>
                </div>
              ) : (
                <CustomDropdown
                  value={filters.createdAt}
                  options={WRAP_DATE_FILTER_OPTIONS}
                  onChange={handleChangeDateFilter}
                  isDark
                  withoutMarginBottom
                  fitContentWidth
                  isSmall
                  placeholder="All"
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <h3>
            {isWrap ? 'Wrap ' : isBurned ? 'Burned ' : 'Unwrap '}
            {isTokens ? `${isWrap ? '' : 'w'}FIO` : 'FIO Domains'}
          </h3>
        </div>

        <Table className="table" striped={true}>
          <thead>
            <tr>
              <th scope="col">Transaction</th>
              {!isBurned && <th scope="col">From</th>}
              {!isBurned && <th scope="col">To</th>}
              <th scope="col">{!isTokens ? 'Domain' : 'Amount'}</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0
              ? data.map((wrapItem, i) => (
                  <tr key={wrapItem.transactionId}>
                    <th
                      className={classes.link}
                      onClick={openDetailsModal.bind(null, wrapItem)}
                    >
                      {wrapItem.transactionId}
                    </th>
                    {wrapItem.from && <th>{wrapItem.from}</th>}
                    {wrapItem.to && <th>{wrapItem.to}</th>}
                    <th>
                      {wrapItem.domain
                        ? wrapItem.domain
                        : wrapItem.amount
                        ? apis.fio.sufToAmount(wrapItem.amount || 0) + ' FIO'
                        : 'N/A'}
                    </th>
                    <th>
                      {wrapItem.blockTimestamp
                        ? formatDateToLocale(wrapItem.blockTimestamp)
                        : null}
                    </th>
                    <th>
                      <Badge
                        variant={WRAP_STATUS_CONTENT[wrapItem?.status]?.type}
                      >
                        {WRAP_STATUS_CONTENT[wrapItem?.status]?.text}
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
        isBurned={isBurned}
      />
    </>
  );
};

export default WrapStatus;
