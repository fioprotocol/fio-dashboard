import React, { useCallback, useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';

import useQuery from './useQuery';

import { AnyObject } from '../types';
import useEffectOnce from './general';

export const DEFAULT_LIMIT = 25;

const LIMIT_QUERY_PARAMETER_NAME = 'limit';
const OFFSET_QUERY_PARAMETER_NAME = 'offset';

export default function usePagination(
  getItemsList: (
    limit?: number,
    offset?: number,
  ) => Promise<
    {
      data: {
        maxCount: number;
      };
    } & AnyObject
  >,
  maxItemsPerPage: number = DEFAULT_LIMIT, // this param will be useful for query initialization in case limit is empty in query, otherwise param from query will be in prior
): {
  paginationComponent: React.Component;
  refresh: () =>
    | Promise<
        {
          data: {
            maxCount: number;
          };
        } & AnyObject
      >
    | undefined;
} {
  const history = useHistory();
  const queryParams = useQuery();

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
      return await getItemsList(limit, offset);
    }
    return;
  };

  useEffect(() => {
    const getItems = async () => {
      const result = await getItemsList(limit, offset);
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
  }, [getItemsList, limit, offset, queryParams]);

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

  useEffect(() => {
    const paginationItems = [];
    for (
      let pageNumber = 1;
      pageNumber <= (itemsCount > limit ? itemsCount / limit : 1);
      pageNumber++
    ) {
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
    }
    setPaginationComponent(<Pagination>{paginationItems}</Pagination>);
  }, [activePage, handleChangeOffset, itemsCount, limit]);

  return { paginationComponent, refresh: refreshData };
}
