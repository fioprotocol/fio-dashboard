import { useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { useHistory } from 'react-router-dom';

import { ExportToCsv } from 'export-to-csv';

import apis from '../../../landing-pages/wrap-status-landing-page/api';

import { ROUTES } from '../../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../../constants/queryParams';
import useQuery from '../../../hooks/useQuery';

import {
  OPERATION_TYPES,
  ASSET_TYPES,
  WRAP_DATE_FILTER_NAMES,
  WRAP_STATUS_CONTENT,
  EXPORT_ALL_CHAINS,
  OperationType,
  AssetType,
  ChainCode,
} from './constants';

import {
  getSupportedChains,
  getDefaultChain,
  isChainSelectionEnabled,
  getRouteKeyFromParams,
  getChainOptions,
  getPageTitle,
} from './utils';

import { log } from '../../../util/general';

import usePagination from '../../../hooks/usePagination';

import { WrapStatusWrapItem } from '../../../types';
import { WrapStatusListItemsResponse } from '../../../api/responses';

import { PageProps } from './types';

// Page params state type
type PageParamsState = {
  operationType: OperationType;
  assetType: AssetType;
  chainCode: ChainCode | null;
};

// Date filter state type
type DateFilterState = {
  createdAt: string | null;
  dateRange: { startDate: number; endDate: number } | null;
};

// Filters state type (includes all view filters including chain)
type FiltersState = DateFilterState & {
  chain: string | null;
};

// Export filters state type
type ExportFiltersState = {
  operationType: OperationType;
  assetType: AssetType;
  chainCode: ChainCode | string; // string for 'All' option
  createdAt: string | null;
  dateRange: { startDate: number; endDate: number } | null;
};

type WrapStatusContextProps = {
  // Current page state
  pageParams: PageParamsState;
  // Selected params for navigation (may differ from current page)
  selectedParams: PageParamsState;
  // Selected date filter for navigation
  selectedDateFilter: DateFilterState;
  // Applied filters (currently active on the view)
  appliedFilters: FiltersState;
  // Export section state
  exportFilters: ExportFiltersState;
  isExportAccordionOpen: boolean;
  isExportingCsv: boolean;
  // Chain options
  chainOptions: { id: string; name: string }[];
  isChainDisabled: boolean;
  exportChainOptions: { id: string; name: string }[];
  // Date picker state
  startDate: Date;
  endDate: Date;
  showDatePicker: boolean;
  // Modal state
  modalData: WrapStatusWrapItem | null;
  // Pagination
  paginationComponent: ReactNode;
  // Page title
  pageTitle: string;
  // Navigation is disabled when selected params match current page and filters
  isNavigationDisabled: boolean;
  // Actions
  handleOpenLink: () => void;
  closeDatePicker: () => void;
  closeDetailsModal: () => void;
  handleChangeOperationType: (value: string) => void;
  handleChangeAssetType: (value: string) => void;
  handleChangeChainCode: (value: string) => void;
  handleChangeDateFilter: (value: string) => void;
  handleExportWrapData: () => Promise<void>;
  openDetailsModal: (item: WrapStatusWrapItem) => void;
  setDateRange: (dateRange: [Date, Date]) => void;
  setFilterWithDateRange: () => void;
  toggleExportAccordion: () => void;
  // Export filters actions
  handleChangeExportOperationType: (value: string) => void;
  handleChangeExportAssetType: (value: string) => void;
  handleChangeExportChainCode: (value: string) => void;
  handleChangeExportDateFilter: (value: string) => void;
  setExportFilterWithDateRange: () => void;
  exportStartDate: Date;
  exportEndDate: Date;
  showExportDatePicker: boolean;
  closeExportDatePicker: () => void;
  setExportDateRange: (dateRange: [Date, Date]) => void;
};

export const useContext = (props: PageProps): WrapStatusContextProps => {
  const {
    operationType,
    assetType,
    chainCode: defaultChainCode,
    getData,
  } = props;

  const history = useHistory();
  const queryParams = useQuery();

  // Get chain from URL or use default for the current operation/asset
  const getValidChainCode = useCallback((): ChainCode | null => {
    const chainFromUrl = queryParams.get(QUERY_PARAMS_NAMES.CHAIN);
    const supportedChains = getSupportedChains({ operationType, assetType });

    if (chainFromUrl) {
      const upperChain = chainFromUrl.toUpperCase() as ChainCode;
      if (supportedChains.includes(upperChain)) {
        return upperChain;
      }
    }
    return defaultChainCode || getDefaultChain({ operationType, assetType });
  }, [queryParams, operationType, assetType, defaultChainCode]);

  const validChainCode = getValidChainCode();

  // Current page params from props and URL
  const currentPageParams: PageParamsState = useMemo(
    () => ({
      operationType,
      assetType,
      chainCode: validChainCode,
    }),
    [operationType, assetType, validChainCode],
  );

  // Selected params state (for navigation selection)
  const [selectedParams, setSelectedParams] = useState<PageParamsState>(
    currentPageParams,
  );

  // Only sync selected params when operation/asset type changes (page navigation)
  // Don't sync on location.search changes to preserve user's dropdown selections
  useEffect(() => {
    const newChainCode = getValidChainCode();
    setSelectedParams({
      operationType,
      assetType,
      chainCode: newChainCode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operationType, assetType]);

  // Modal state
  const [modalData, setModalData] = useState<WrapStatusWrapItem | null>(null);

  // Date filter states
  // Selected date filter (for navigation - what user is selecting)
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilterState>(
    {
      createdAt: null,
      dateRange: null,
    },
  );
  // Applied date filter (for comparison - what was last applied as preset/range)
  const [appliedDateFilter, setAppliedDateFilter] = useState<DateFilterState>({
    createdAt: null,
    dateRange: null,
  });
  // Applied filters for API (converted dates and chain for actual API calls)
  const [appliedFilters, setAppliedFilters] = useState<FiltersState>({
    createdAt: null,
    dateRange: null,
    chain: validChainCode,
  });
  const [dateRange, setDateRange] = useState<[Date, Date]>([null, null]);
  const [showDatePicker, toggleShowDatePicker] = useState<boolean>(false);

  // Export section state
  const [isExportAccordionOpen, setIsExportAccordionOpen] = useState<boolean>(
    false,
  );
  const [isExportingCsv, toggleIsExportingCsv] = useState<boolean>(false);
  const [exportFilters, setExportFilters] = useState<ExportFiltersState>({
    operationType: currentPageParams.operationType,
    assetType: currentPageParams.assetType,
    chainCode: currentPageParams.chainCode || EXPORT_ALL_CHAINS,
    createdAt: null,
    dateRange: null,
  });
  const [exportDateRange, setExportDateRange] = useState<[Date, Date]>([
    null,
    null,
  ]);
  const [showExportDatePicker, toggleShowExportDatePicker] = useState<boolean>(
    false,
  );

  const [startDate, endDate] = dateRange;
  const [exportStartDate, exportEndDate] = exportDateRange;

  // Pass applied filters to pagination - this triggers data refetch when filters change
  const { paginationComponent } = usePagination(getData, 25, appliedFilters);

  // Computed values
  const supportedChains = useMemo(() => getSupportedChains(selectedParams), [
    selectedParams,
  ]);

  const chainOptions = useMemo(
    () => getChainOptions({ chains: supportedChains }),
    [supportedChains],
  );

  const isChainDisabled = useMemo(
    () => !isChainSelectionEnabled(selectedParams),
    [selectedParams],
  );

  const exportSupportedChains = useMemo(
    () => getSupportedChains(exportFilters),
    [exportFilters],
  );

  const exportChainOptions = useMemo(
    () => getChainOptions({ chains: exportSupportedChains, includeAll: true }),
    [exportSupportedChains],
  );

  const pageTitle = useMemo(() => getPageTitle(currentPageParams), [
    currentPageParams,
  ]);

  const isNavigationDisabled = useMemo(() => {
    const paramsMatch =
      currentPageParams.operationType === selectedParams.operationType &&
      currentPageParams.assetType === selectedParams.assetType &&
      currentPageParams.chainCode === selectedParams.chainCode;

    const dateFilterMatch =
      selectedDateFilter.createdAt === appliedDateFilter.createdAt &&
      selectedDateFilter.dateRange?.startDate ===
        appliedDateFilter.dateRange?.startDate &&
      selectedDateFilter.dateRange?.endDate ===
        appliedDateFilter.dateRange?.endDate;

    return paramsMatch && dateFilterMatch;
  }, [
    currentPageParams,
    selectedParams,
    selectedDateFilter,
    appliedDateFilter,
  ]);

  // Modal actions
  const openDetailsModal = (item: WrapStatusWrapItem) => setModalData(item);
  const closeDetailsModal = () => setModalData(null);

  // Date picker actions
  const openDatePicker = useCallback(() => {
    toggleShowDatePicker(true);
  }, []);

  const closeDatePicker = useCallback(() => {
    // When closing, if dates were set via "Set" button, they're already in selectedDateFilter
    // Just close the picker and clear the temporary dateRange state
    toggleShowDatePicker(false);
    setDateRange([null, null]);
  }, []);

  const openExportDatePicker = useCallback(() => {
    toggleShowExportDatePicker(true);
  }, []);

  const closeExportDatePicker = useCallback(() => {
    toggleShowExportDatePicker(false);
    setExportFilters(filters => ({
      ...filters,
      createdAt: null,
      dateRange: null,
    }));
  }, []);

  // Export accordion toggle
  const toggleExportAccordion = useCallback(() => {
    setIsExportAccordionOpen(prev => !prev);
  }, []);

  // Navigation param change handlers
  const handleChangeOperationType = useCallback(
    (value: string) => {
      const newOperationType = value as OperationType;
      let newAssetType = selectedParams.assetType;

      // Burned operation only supports domains
      if (newOperationType === OPERATION_TYPES.BURNED) {
        newAssetType = ASSET_TYPES.DOMAINS;
      }

      const newChainCode = getDefaultChain({
        operationType: newOperationType,
        assetType: newAssetType,
      });

      setSelectedParams({
        operationType: newOperationType,
        assetType: newAssetType,
        chainCode: newChainCode,
      });
    },
    [selectedParams.assetType],
  );

  const handleChangeAssetType = useCallback(
    (value: string) => {
      const newAssetType = value as AssetType;
      const newChainCode = getDefaultChain({
        operationType: selectedParams.operationType,
        assetType: newAssetType,
      });

      setSelectedParams(prev => ({
        ...prev,
        assetType: newAssetType,
        chainCode: newChainCode,
      }));
    },
    [selectedParams.operationType],
  );

  const handleChangeChainCode = useCallback((value: string) => {
    setSelectedParams(prev => ({
      ...prev,
      chainCode: value as ChainCode,
    }));
  }, []);

  // Filter change handlers
  const handleChangeDateFilter = useCallback(
    (newValue: string) => {
      if (newValue === 'custom') {
        openDatePicker();
      } else {
        setSelectedDateFilter({
          createdAt: newValue || null,
          dateRange: null,
        });
      }
    },
    [openDatePicker],
  );

  const setFilterWithDateRange = useCallback(() => {
    // Update selectedDateFilter with the date range (so "Show" button works)
    // but keep the picker open - dropdown will update when picker is closed
    if (startDate && endDate) {
      setSelectedDateFilter({
        createdAt: null,
        dateRange: {
          startDate: startDate.setHours(0, 0, 0, 0),
          endDate: endDate.setHours(23, 59, 59, 999),
        },
      });
      // Keep picker open - user can still adjust dates or click "Close"
    }
  }, [startDate, endDate]);

  // Export filter change handlers
  const handleChangeExportOperationType = useCallback(
    (value: string) => {
      const newOperationType = value as OperationType;
      let newAssetType = exportFilters.assetType;

      // Burned operation only supports domains
      if (newOperationType === OPERATION_TYPES.BURNED) {
        newAssetType = ASSET_TYPES.DOMAINS;
      }

      const chains = getSupportedChains({
        operationType: newOperationType,
        assetType: newAssetType,
      });
      const newChainCode =
        chains.length > 1 ? EXPORT_ALL_CHAINS : chains[0] || EXPORT_ALL_CHAINS;

      setExportFilters(prev => ({
        ...prev,
        operationType: newOperationType,
        assetType: newAssetType,
        chainCode: newChainCode,
      }));
    },
    [exportFilters.assetType],
  );

  const handleChangeExportAssetType = useCallback(
    (value: string) => {
      const newAssetType = value as AssetType;
      const chains = getSupportedChains({
        operationType: exportFilters.operationType,
        assetType: newAssetType,
      });
      const newChainCode =
        chains.length > 1 ? EXPORT_ALL_CHAINS : chains[0] || EXPORT_ALL_CHAINS;

      setExportFilters(prev => ({
        ...prev,
        assetType: newAssetType,
        chainCode: newChainCode,
      }));
    },
    [exportFilters.operationType],
  );

  const handleChangeExportChainCode = useCallback((value: string) => {
    setExportFilters(prev => ({
      ...prev,
      chainCode: value,
    }));
  }, []);

  const handleChangeExportDateFilter = useCallback(
    (newValue: string) => {
      if (newValue === 'custom') {
        openExportDatePicker();
      } else {
        setExportFilters(filters => ({
          ...filters,
          createdAt: newValue || null,
          dateRange: null,
        }));
      }
    },
    [openExportDatePicker],
  );

  const setExportFilterWithDateRange = useCallback(() => {
    if (exportStartDate && exportEndDate) {
      setExportFilters(filters => ({
        ...filters,
        createdAt: null,
        dateRange: {
          startDate: exportStartDate.setHours(0, 0, 0, 0),
          endDate: exportEndDate.setHours(23, 59, 59, 999),
        },
      }));
    }
  }, [exportStartDate, exportEndDate]);

  // Convert date filter preset to actual date string for API
  const convertDateFilterForApi = useCallback((dateFilter: DateFilterState): {
    createdAt: string | null;
    dateRange: { startDate: number; endDate: number } | null;
  } => {
    const { createdAt, dateRange } = dateFilter;

    if (dateRange) {
      return { createdAt: null, dateRange };
    }

    if (!createdAt) {
      return { createdAt: null, dateRange: null };
    }

    let convertedDate: string | null = null;

    switch (createdAt) {
      case WRAP_DATE_FILTER_NAMES.TODAY:
        convertedDate = new Date().toUTCString();
        break;
      case WRAP_DATE_FILTER_NAMES.YESTERDAY:
        convertedDate = new Date(
          new Date(new Date().setHours(0, 0, 0, 0)).setDate(
            new Date().getDate() - 1,
          ),
        ).toUTCString();
        break;
      case WRAP_DATE_FILTER_NAMES.LAST7DAYS:
        convertedDate = new Date(
          new Date(new Date().setHours(0, 0, 0, 0)).setDate(
            new Date().getDate() - 7,
          ),
        ).toUTCString();
        break;
      case WRAP_DATE_FILTER_NAMES.LASTMONTH:
        convertedDate = new Date(
          new Date(new Date().setHours(0, 0, 0, 0)).setMonth(
            new Date().getMonth() - 1,
          ),
        ).toUTCString();
        break;
      case WRAP_DATE_FILTER_NAMES.LASTHALFOFYEAR:
        convertedDate = new Date(
          new Date(new Date().setHours(0, 0, 0, 0)).setMonth(
            new Date().getMonth() - 6,
          ),
        ).toUTCString();
        break;
      default:
        break;
    }

    return { createdAt: convertedDate, dateRange: null };
  }, []);

  // Navigation action
  const handleOpenLink = useCallback(() => {
    // Save the original selection for comparison
    setAppliedDateFilter({ ...selectedDateFilter });

    // Convert and apply the selected date filter for API (include chain)
    const convertedFilters = convertDateFilterForApi(selectedDateFilter);
    setAppliedFilters({
      ...convertedFilters,
      chain: selectedParams.chainCode,
    });

    // Build URL with chain parameter
    const routeKey = getRouteKeyFromParams(selectedParams);
    if (routeKey && ROUTES[routeKey]) {
      const newQueryParams = new URLSearchParams();
      if (selectedParams.chainCode) {
        newQueryParams.set(QUERY_PARAMS_NAMES.CHAIN, selectedParams.chainCode);
      }

      const currentRouteKey = getRouteKeyFromParams(currentPageParams);
      const searchString = newQueryParams.toString();
      const newPath = `${ROUTES[routeKey]}${
        searchString ? `?${searchString}` : ''
      }`;

      if (
        routeKey !== currentRouteKey ||
        selectedParams.chainCode !== currentPageParams.chainCode
      ) {
        history.push(newPath);
      }
    }
  }, [
    selectedParams,
    selectedDateFilter,
    currentPageParams,
    history,
    convertDateFilterForApi,
  ]);

  // Export data handler
  const handleExportWrapData = useCallback(async () => {
    toggleIsExportingCsv(true);

    const {
      operationType,
      assetType,
      chainCode,
      createdAt,
      dateRange,
    } = exportFilters;

    const dateFilters: {
      createdAt: string | null;
      dateRange: { startDate: number; endDate: number } | null;
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

    // Determine which chains to export
    const chainsToExport: (ChainCode | null)[] =
      chainCode === EXPORT_ALL_CHAINS
        ? getSupportedChains({ operationType, assetType })
        : [chainCode as ChainCode];

    const allWrapData: WrapStatusWrapItem[] = [];
    const MAX_LIMIT_PER_REQUEST = 50; // Match server MAX_LIMIT

    // Helper function to fetch all pages for a given chain
    const fetchAllDataForChain = async (
      chain: ChainCode | null,
    ): Promise<WrapStatusWrapItem[]> => {
      const chainData: WrapStatusWrapItem[] = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        let wrapData: Partial<WrapStatusListItemsResponse> = {};

        try {
          if (operationType === OPERATION_TYPES.WRAP) {
            if (assetType === ASSET_TYPES.TOKENS) {
              wrapData = await apis.wrapStatus.getWrapStatusPageData({
                action: OPERATION_TYPES.WRAP,
                assetType: ASSET_TYPES.TOKENS,
                chain,
                limit: MAX_LIMIT_PER_REQUEST,
                offset,
                filters: dateFilters,
              });
            } else {
              wrapData = await apis.wrapStatus.getWrapStatusPageData({
                action: OPERATION_TYPES.WRAP,
                assetType: ASSET_TYPES.DOMAINS,
                chain,
                limit: MAX_LIMIT_PER_REQUEST,
                offset,
                filters: dateFilters,
              });
            }
          } else if (operationType === OPERATION_TYPES.UNWRAP) {
            if (assetType === ASSET_TYPES.TOKENS) {
              wrapData = await apis.wrapStatus.getWrapStatusPageData({
                action: OPERATION_TYPES.UNWRAP,
                assetType: ASSET_TYPES.TOKENS,
                chain,
                limit: MAX_LIMIT_PER_REQUEST,
                offset,
                filters: dateFilters,
              });
            } else {
              wrapData = await apis.wrapStatus.getWrapStatusPageData({
                action: OPERATION_TYPES.UNWRAP,
                assetType: ASSET_TYPES.DOMAINS,
                chain,
                limit: MAX_LIMIT_PER_REQUEST,
                offset,
                filters: dateFilters,
              });
            }
          } else if (operationType === OPERATION_TYPES.BURNED) {
            wrapData = await apis.wrapStatus.getWrapStatusPageData({
              action: OPERATION_TYPES.BURNED,
              assetType: ASSET_TYPES.DOMAINS,
              chain,
              limit: MAX_LIMIT_PER_REQUEST,
              offset,
              filters: dateFilters,
            });
          }

          if (wrapData.list && wrapData.list.length > 0) {
            // API already filters by chain, so no need for client-side filtering
            // Just add all items returned by the API
            chainData.push(...wrapData.list);

            // Check if there's more data to fetch
            const totalFetched = offset + wrapData.list.length;
            const maxCount = wrapData.maxCount || 0;
            hasMore =
              totalFetched < maxCount &&
              wrapData.list.length === MAX_LIMIT_PER_REQUEST;
            offset += MAX_LIMIT_PER_REQUEST;
          } else {
            log.info(`No more data for chain ${chain} at offset ${offset}`);
            hasMore = false;
          }
        } catch (err) {
          log.error(err);
          hasMore = false;
        }
      }

      return chainData;
    };

    // Fetch data for each chain
    log.info('Starting export');

    for (const chain of chainsToExport) {
      try {
        log.info(`Fetching data for chain: ${chain}`);
        const chainData = await fetchAllDataForChain(chain);
        log.info(`Fetched ${chainData.length} items for chain: ${chain}`);
        allWrapData.push(...chainData);
      } catch (err) {
        log.error(`Error fetching data for chain ${chain}:`, err);
      }
    }

    // If exporting all chains and got no data, try fetching without chain filter
    if (
      chainCode === EXPORT_ALL_CHAINS &&
      allWrapData.length === 0 &&
      chainsToExport.length > 0
    ) {
      log.info(
        'No data found for individual chains, trying without chain filter',
      );
      try {
        const allChainsData = await fetchAllDataForChain(null);
        log.info(`Fetched ${allChainsData.length} items without chain filter`);
        allWrapData.push(...allChainsData);
      } catch (err) {
        log.error('Error fetching data without chain filter:', err);
      }
    }

    log.info(`Total data fetched: ${allWrapData.length} items`);

    const currentDate = new Date();
    const chainLabel = chainCode === EXPORT_ALL_CHAINS ? 'All' : chainCode;

    const burnHeaders = [
      '#',
      'TransactionId',
      'Chain',
      'Domain',
      'Status',
      'First transaction',
      'Last transaction',
    ];

    const headers = [
      '#',
      'TransactionId',
      'Chain',
      'From',
      'To',
      assetType === ASSET_TYPES.TOKENS ? 'Amount' : 'Domain',
      'Status',
      'First transaction',
      'Last transaction',
    ];

    const preparedWrapDataListToCsv: Record<string, string | number>[] = [];

    let index = 0;
    for (const wrapItem of allWrapData) {
      const {
        amount,
        approvals,
        blockTimestamp,
        chain,
        domain,
        from,
        status,
        to,
        transactionId,
      } = wrapItem;

      // Build object with keys matching headers exactly and in the same order
      const wrapObjectToCsv: Record<string, string | number> = {};

      if (operationType === OPERATION_TYPES.BURNED) {
        // Burned headers: '#', 'TransactionId', 'Chain', 'Domain', 'Status', 'First transaction', 'Last transaction'
        wrapObjectToCsv['#'] = index + 1;
        wrapObjectToCsv.TransactionId = transactionId || '';
        wrapObjectToCsv.Chain = chain || '';
        wrapObjectToCsv.Domain = domain || '';
        wrapObjectToCsv.Status =
          WRAP_STATUS_CONTENT[status]?.text || status || '';
        wrapObjectToCsv['First transaction'] = blockTimestamp || '';
        wrapObjectToCsv['Last transaction'] = approvals?.blockTimeStamp || '';
      } else {
        // Regular headers: '#', 'TransactionId', 'Chain', 'From', 'To', 'Amount'/'Domain', 'Status', 'First transaction', 'Last transaction'
        wrapObjectToCsv['#'] = index + 1;
        wrapObjectToCsv.TransactionId = transactionId || '';
        wrapObjectToCsv.Chain = chain || '';
        wrapObjectToCsv.From = from || '';
        wrapObjectToCsv.To = to || '';
        if (assetType === ASSET_TYPES.TOKENS) {
          wrapObjectToCsv.Amount = amount || '';
        } else {
          wrapObjectToCsv.Domain = domain || '';
        }
        wrapObjectToCsv.Status =
          WRAP_STATUS_CONTENT[status]?.text || status || '';
        wrapObjectToCsv['First transaction'] = blockTimestamp || '';
        wrapObjectToCsv['Last transaction'] = approvals?.blockTimeStamp || '';
      }

      preparedWrapDataListToCsv.push(wrapObjectToCsv);

      index++;
    }

    try {
      if (preparedWrapDataListToCsv.length > 0) {
        const filename = `${operationType}-${assetType}-${chainLabel}_Total-${
          preparedWrapDataListToCsv.length
        }_${currentDate.getFullYear()}-${currentDate.getMonth() +
          1}-${currentDate.getDate()}_${currentDate.getHours()}-${currentDate.getMinutes()}`;
        const csvHeaders =
          operationType === OPERATION_TYPES.BURNED ? burnHeaders : headers;

        const csvExporter = new ExportToCsv({
          showLabels: true,
          filename,
          headers: csvHeaders,
        });

        csvExporter.generateCsv(preparedWrapDataListToCsv);
      } else {
        log.info('No data to export');
      }
    } catch (err) {
      log.error('Error generating CSV:', err);
    } finally {
      toggleIsExportingCsv(false);
    }
  }, [exportFilters]);

  return {
    // Current page state
    pageParams: currentPageParams,
    // Selected params for navigation
    selectedParams,
    // Selected date filter for navigation
    selectedDateFilter,
    // Applied filters
    appliedFilters,
    // Export section state
    exportFilters,
    isExportAccordionOpen,
    isExportingCsv,
    // Chain options
    chainOptions,
    isChainDisabled,
    exportChainOptions,
    // Date picker state
    startDate,
    endDate,
    showDatePicker,
    // Modal state
    modalData,
    // Pagination
    paginationComponent,
    // Page title
    pageTitle,
    // Navigation disabled state
    isNavigationDisabled,
    // Actions
    handleOpenLink,
    closeDatePicker,
    closeDetailsModal,
    handleChangeOperationType,
    handleChangeAssetType,
    handleChangeChainCode,
    handleChangeDateFilter,
    handleExportWrapData,
    openDetailsModal,
    setDateRange,
    setFilterWithDateRange,
    toggleExportAccordion,
    // Export filters actions
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
  };
};
