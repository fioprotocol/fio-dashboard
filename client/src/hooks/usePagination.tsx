import {
  Component,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import Range from 'lodash/range';

import useQuery from './useQuery';

import useEffectOnce from './general';
import MathOp from '../util/math';

import { AnyObject } from '../types';

export const DEFAULT_LIMIT = 25;
export const DEFAULT_OFFSET = 0;

const LIMIT_QUERY_PARAMETER_NAME = 'limit';
const OFFSET_QUERY_PARAMETER_NAME = 'offset';
const PAGE_ITEMS_RENDER_AMOUNT = 13;
const PAGE_ITEMS_RENDER_CORNER_AMOUNT = 2;
const PAGE_ITEMS_RENDER_MIDDLE_AMOUNT = 5;
const PAGE_ITEMS_RENDER_HALF_MIDDLE_AMOUNT = new MathOp(
  PAGE_ITEMS_RENDER_MIDDLE_AMOUNT,
)
  .div(2)
  .round(0, 0)
  .toNumber();

export default function usePagination(
  getItemsList: (
    limit?: number,
    offset?: number,
    filters?: AnyObject,
  ) => Promise<
    {
      data: {
        maxCount: number;
      };
    } & AnyObject
  >,
  maxItemsPerPage: number = DEFAULT_LIMIT, // this param will be useful for query initialization in case limit is empty in query, otherwise param from query will be in prior
  filters?: AnyObject,
): {
  paginationComponent: Component;
  refresh: () =>
    | Promise<
        {
          data: {
            maxCount: number;
          };
        } & AnyObject
      >
    | undefined;
  range: number[];
} {
  const history = useHistory();
  const queryParams = useQuery();

  const location = useLocation();
  const locationPathname = useRef(location.pathname);

  const handleChangeOffset = useCallback(
    (offsetValue: string) => {
      queryParams.set(OFFSET_QUERY_PARAMETER_NAME, offsetValue);
      history.push({ search: queryParams.toString() });
    },
    [history, queryParams],
  );

  const limit =
    parseFloat(queryParams.get(LIMIT_QUERY_PARAMETER_NAME)) || maxItemsPerPage;
  const offset = parseFloat(queryParams.get(OFFSET_QUERY_PARAMETER_NAME)) || 0;

  const [activePage, setActivePage] = useState(null);
  const [itemsCount, setItemsCount] = useState(0);
  const [paginationComponent, setPaginationComponent] = useState(null);

  const refreshData = async () => {
    if (
      queryParams.get(LIMIT_QUERY_PARAMETER_NAME) &&
      queryParams.get(OFFSET_QUERY_PARAMETER_NAME)
    ) {
      return await getItemsList(limit, offset, filters);
    }
    return;
  };

  useEffect(() => {
    handleChangeOffset('0');
    // handleChangeOffset refresh on each offset change, need to update only on filters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    const getItems = async () => {
      const result = await getItemsList(limit, offset, filters);
      const maxCount = result.data?.maxCount || 0;
      setItemsCount(maxCount);
      setActivePage(
        maxCount > offset ? (offset - (offset % limit)) / limit + 1 : 1,
      );
    };

    if (
      queryParams.get(LIMIT_QUERY_PARAMETER_NAME) &&
      queryParams.get(OFFSET_QUERY_PARAMETER_NAME)
    )
      getItems();
  }, [getItemsList, limit, offset, filters, queryParams]);

  // initialize (redirect) url query, if no params present in it
  useEffectOnce(() => {
    const limit = queryParams.get(LIMIT_QUERY_PARAMETER_NAME);
    const offset = queryParams.get(OFFSET_QUERY_PARAMETER_NAME);
    if (!limit || !offset) {
      queryParams.set(
        LIMIT_QUERY_PARAMETER_NAME,
        limit || maxItemsPerPage + '',
      );
      queryParams.set(OFFSET_QUERY_PARAMETER_NAME, offset || '0');
      history.push({ search: queryParams.toString() });
    }
  }, []);

  // reload page, when location pathname has been changed, but component wasn't removed from DOM (page with dynamic parameter in url)
  useEffect(() => {
    if (location.pathname !== locationPathname.current) {
      // history push do not work properly so use full reload
      document.location.reload();
    }
  }, [location]);

  useEffect(() => {
    const paginationItems: ReactNode[] = [];
    const pages = new MathOp(itemsCount)
      .div(limit)
      .round(0, 3)
      .toNumber();

    const addPage = (pageNumber: number) => {
      paginationItems.push(
        <Pagination.Item
          key={pageNumber}
          active={pageNumber === activePage}
          onClick={() => {
            if (!(pageNumber === activePage)) {
              handleChangeOffset((pageNumber - 1) * limit + '');
            }
          }}
        >
          {pageNumber}
        </Pagination.Item>,
      );
    };

    if (pages < PAGE_ITEMS_RENDER_AMOUNT) {
      for (
        let pageNumber = 1;
        pageNumber <= (itemsCount > limit ? pages : 1);
        pageNumber++
      ) {
        addPage(pageNumber);
      }
    } else {
      for (
        let pageStart = 1;
        pageStart <= PAGE_ITEMS_RENDER_CORNER_AMOUNT;
        pageStart++
      ) {
        addPage(pageStart);
      }
      let middleStart = activePage - PAGE_ITEMS_RENDER_HALF_MIDDLE_AMOUNT;
      let addStartDelimiter = true;
      let addEndDelimiter = true;
      if (
        activePage <=
        PAGE_ITEMS_RENDER_CORNER_AMOUNT +
          PAGE_ITEMS_RENDER_HALF_MIDDLE_AMOUNT +
          1
      ) {
        addStartDelimiter = false;
        middleStart = PAGE_ITEMS_RENDER_CORNER_AMOUNT + 1;
      }
      if (
        activePage >=
        pages -
          (PAGE_ITEMS_RENDER_CORNER_AMOUNT +
            PAGE_ITEMS_RENDER_HALF_MIDDLE_AMOUNT)
      ) {
        addEndDelimiter = false;
        middleStart =
          pages -
          PAGE_ITEMS_RENDER_CORNER_AMOUNT -
          PAGE_ITEMS_RENDER_MIDDLE_AMOUNT +
          1;
      }
      if (addStartDelimiter) {
        paginationItems.push(
          <div className="mr-3 ml-3" key="startdelimeter">
            ...
          </div>,
        );
      }
      for (
        let pageMiddle = middleStart;
        pageMiddle < middleStart + PAGE_ITEMS_RENDER_MIDDLE_AMOUNT;
        pageMiddle++
      ) {
        addPage(pageMiddle);
      }
      if (addEndDelimiter) {
        paginationItems.push(
          <div className="mr-3 ml-3" key="enddelimeter">
            ...
          </div>,
        );
      }
      for (
        let pageEnd = pages - PAGE_ITEMS_RENDER_CORNER_AMOUNT + 1;
        pageEnd <= pages;
        pageEnd++
      ) {
        addPage(pageEnd);
      }
    }

    setPaginationComponent(<Pagination>{paginationItems}</Pagination>);
  }, [activePage, handleChangeOffset, itemsCount, limit]);

  const getRange = useMemo(() => {
    const start = activePage * limit + 1 - limit;
    const end =
      activePage * limit > itemsCount ? itemsCount : activePage * limit;

    return Range(start, end + 1);
  }, [activePage, itemsCount, limit]);

  return { paginationComponent, refresh: refreshData, range: getRange };
}
