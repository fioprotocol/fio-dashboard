import React from 'react';

import { Button, Table, Accordion, Card } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DatePicker from 'react-datepicker';

import Loader from '../../../components/Loader/Loader';
import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';
import DetailsModal from './components/DetailsModal';
import CustomDropdown from '../../CustomDropdown';

import { formatDateToLocale } from '../../../helpers/stringFormatters';

import { renderFioPriceFromSuf } from '../../../util/fio';

import {
  OPERATION_TYPES,
  ASSET_TYPES,
  WRAP_TYPE_FILTER_OPTIONS,
  WRAP_ASSETS_FILTER_OPTIONS,
  WRAP_DATE_FILTER_OPTIONS,
  WRAP_STATUS_CONTENT,
} from './constants';

import { PageProps } from './types';

import { useContext } from './WrapStatusContext';

import classes from './WrapStatus.module.scss';
import 'react-datepicker/dist/react-datepicker.css';

const WrapStatus: React.FC<PageProps> = props => {
  const { loading, data, operationType, assetType } = props;

  const {
    selectedParams,
    selectedDateFilter,
    exportFilters,
    isExportAccordionOpen,
    isExportingCsv,
    chainOptions,
    isChainDisabled,
    exportChainOptions,
    modalData,
    paginationComponent,
    startDate,
    endDate,
    showDatePicker,
    pageTitle,
    isNavigationDisabled,
    closeDatePicker,
    closeDetailsModal,
    handleChangeOperationType,
    handleChangeAssetType,
    handleChangeChainCode,
    handleChangeDateFilter,
    handleExportWrapData,
    handleOpenLink,
    openDetailsModal,
    setDateRange,
    setFilterWithDateRange,
    toggleExportAccordion,
    handleChangeExportOperationType,
    handleChangeExportAssetType,
    handleChangeExportChainCode,
    handleChangeExportDateFilter,
    setExportFilterWithDateRange,
    exportStartDate,
    exportEndDate,
    showExportDatePicker,
    closeExportDatePicker,
    setExportDateRange,
  } = useContext(props);

  const isBurned = operationType === OPERATION_TYPES.BURNED;
  const isTokens = assetType === ASSET_TYPES.TOKENS;
  const hasNoData = !loading && (!data || data.length === 0);

  // Filter asset options based on operation type (burned only supports domains)
  const assetOptions =
    selectedParams.operationType === OPERATION_TYPES.BURNED
      ? WRAP_ASSETS_FILTER_OPTIONS.filter(opt => opt.id === ASSET_TYPES.DOMAINS)
      : WRAP_ASSETS_FILTER_OPTIONS;

  const exportAssetOptions =
    exportFilters.operationType === OPERATION_TYPES.BURNED
      ? WRAP_ASSETS_FILTER_OPTIONS.filter(opt => opt.id === ASSET_TYPES.DOMAINS)
      : WRAP_ASSETS_FILTER_OPTIONS;

  return (
    <div className={classes.wrapStatusPage}>
      <div className={classes.tableContainer}>
        {/* Navigation Section */}
        <div className={classes.navigationSection}>
          <h5 className={classes.sectionTitle}>View Data</h5>
          <div className={classes.navigationControls}>
            <div className={classes.dropdownGroup}>
              <label className={classes.dropdownLabel}>Action:</label>
              <CustomDropdown
                value={selectedParams.operationType}
                options={WRAP_TYPE_FILTER_OPTIONS}
                onChange={handleChangeOperationType}
                isDark
                withoutMarginBottom
                fitContentWidth
                isSmall
              />
            </div>

            <div className={classes.dropdownGroup}>
              <label className={classes.dropdownLabel}>Asset:</label>
              <CustomDropdown
                value={selectedParams.assetType}
                options={assetOptions}
                onChange={handleChangeAssetType}
                isDark
                withoutMarginBottom
                fitContentWidth
                isSmall
              />
            </div>

            <div className={classes.dropdownGroup}>
              <label className={classes.dropdownLabel}>Chain:</label>
              <CustomDropdown
                value={selectedParams.chainCode || ''}
                options={chainOptions}
                onChange={handleChangeChainCode}
                isDark
                withoutMarginBottom
                fitContentWidth
                isSmall
                disabled={isChainDisabled}
              />
            </div>

            <div className={classes.dropdownGroup}>
              <label className={classes.dropdownLabel}>Date:</label>
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
                    size="sm"
                    onClick={setFilterWithDateRange}
                  >
                    Set
                  </Button>
                  <Button
                    className="btn btn-danger"
                    size="sm"
                    onClick={closeDatePicker}
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <CustomDropdown
                  value={
                    selectedDateFilter.dateRange
                      ? 'custom'
                      : selectedDateFilter.createdAt
                  }
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

            <Button
              type="button"
              variant="primary"
              disabled={isNavigationDisabled}
              onClick={handleOpenLink}
            >
              Show
            </Button>
          </div>
        </div>

        {/* Export Accordion Section */}
        <Accordion className={classes.exportAccordion}>
          <Card className={classes.exportCard}>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="0"
              onClick={toggleExportAccordion}
              className={classes.exportHeader}
            >
              <div className={classes.exportHeaderContent}>
                <DownloadIcon className={classes.exportIcon} />
                <span>Export Data to CSV</span>
                {isExportAccordionOpen ? (
                  <ExpandLessIcon className={classes.expandIcon} />
                ) : (
                  <ExpandMoreIcon className={classes.expandIcon} />
                )}
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body className={classes.exportBody}>
                <div className={classes.exportControls}>
                  <div className={classes.exportFiltersRow}>
                    <div className={classes.dropdownGroup}>
                      <label className={classes.dropdownLabel}>Action:</label>
                      <CustomDropdown
                        value={exportFilters.operationType}
                        options={WRAP_TYPE_FILTER_OPTIONS}
                        onChange={handleChangeExportOperationType}
                        isDark
                        withoutMarginBottom
                        fitContentWidth
                        isSmall
                      />
                    </div>

                    <div className={classes.dropdownGroup}>
                      <label className={classes.dropdownLabel}>Asset:</label>
                      <CustomDropdown
                        value={exportFilters.assetType}
                        options={exportAssetOptions}
                        onChange={handleChangeExportAssetType}
                        isDark
                        withoutMarginBottom
                        fitContentWidth
                        isSmall
                      />
                    </div>

                    <div className={classes.dropdownGroup}>
                      <label className={classes.dropdownLabel}>Chain:</label>
                      <CustomDropdown
                        value={exportFilters.chainCode}
                        options={exportChainOptions}
                        onChange={handleChangeExportChainCode}
                        isDark
                        withoutMarginBottom
                        fitContentWidth
                        isSmall
                      />
                    </div>

                    <div className={classes.dropdownGroup}>
                      <label className={classes.dropdownLabel}>Date:</label>
                      {showExportDatePicker ? (
                        <div className={classes.datePickerContainer}>
                          <DatePicker
                            selectsRange={true}
                            startDate={exportStartDate}
                            endDate={exportEndDate}
                            onChange={update => {
                              setExportDateRange(update);
                            }}
                            isClearable={true}
                          />
                          <Button
                            className="btn btn-primary ml-2 mr-2"
                            size="sm"
                            onClick={setExportFilterWithDateRange}
                          >
                            Set
                          </Button>
                          <Button
                            className="btn btn-danger"
                            size="sm"
                            onClick={closeExportDatePicker}
                          >
                            Close
                          </Button>
                        </div>
                      ) : (
                        <CustomDropdown
                          value={exportFilters.createdAt}
                          options={WRAP_DATE_FILTER_OPTIONS}
                          onChange={handleChangeExportDateFilter}
                          isDark
                          withoutMarginBottom
                          fitContentWidth
                          isSmall
                          placeholder="All"
                        />
                      )}
                    </div>
                  </div>

                  <div className={classes.exportButtonContainer}>
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
                        'Export CSV'
                      )}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>

        {/* Page Title */}
        <div className={classes.titleContainer}>
          <h3>{pageTitle}</h3>
        </div>

        {/* Data Table */}
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
            {data?.length
              ? data.map(wrapItem => (
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
                        ? renderFioPriceFromSuf(wrapItem.amount || 0) + ' FIO'
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

        {hasNoData && (
          <InfoBadge
            title="No Data"
            message="There are no actions for the selected filters."
          />
        )}

        {paginationComponent}

        {loading && <Loader />}
      </div>

      <DetailsModal
        itemData={modalData}
        onClose={closeDetailsModal}
        operationType={operationType}
        assetType={assetType}
        chainCode={selectedParams.chainCode}
      />
    </div>
  );
};

export default WrapStatus;
