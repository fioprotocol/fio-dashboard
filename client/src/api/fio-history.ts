import { convertObjToString, fetchWithRateLimit } from '../util/general';
import { DEFAULT_HISTORY_ITEMS_LIMIT } from '../constants/fio';

import { AnyObject } from '../types';
import { FioHistoryV2NodeActionResponse } from '../types/fio';
import { DEFAULT_MAX_RETRIES } from '../constants/common';

export default class FioHistory {
  historyNodeUrls: string[] = [];
  historyNodeActions = {
    getActions: 'get_actions',
  };
  setHistoryNodeUrls(historyUrls: string[]): void {
    this.historyNodeUrls = historyUrls;
  }

  async requestHistoryV2({
    apiUrl,
    uri,
  }: {
    apiUrl: string;
    uri: string;
  }): Promise<AnyObject> {
    const result = await fetchWithRateLimit({
      url: `${apiUrl}history/${uri}`,
      maxRetries: DEFAULT_MAX_RETRIES,
    });

    return await result.json();
  }

  // Skip parameter could fail with value more than 10000 - FIO History server will return Elastic search error.
  async getHistoryV2Actions({
    nodeIndex,
    params,
  }: {
    nodeIndex: number;
    // See all params here https://fio.cryptolions.io/v2/docs/static/index.html#/history/get_v2_history_get_actions
    params: {
      account: string;
      after?: string;
      before?: string;
      checkLib?: boolean;
      filter?: string;
      hot_only?: boolean;
      limit?: number;
      noBinary?: boolean;
      simple?: boolean;
      skip?: number;
      sort?: string | number;
      track?: boolean;
    };
  }): Promise<
    Partial<
      {
        error?: { noNodeForIndex: boolean };
      } & FioHistoryV2NodeActionResponse
    >
  > {
    if (!this.historyNodeUrls[nodeIndex])
      return { error: { noNodeForIndex: true } };

    const actionParams = {
      ...params,
    };

    if (!('simple' in params)) {
      actionParams.simple = false;
    }
    if (!('noBinary' in params)) {
      actionParams.noBinary = true;
    }
    if (!('sort' in params)) {
      actionParams.sort = 'desc';
    }
    if (!('limit' in params)) {
      actionParams.limit = DEFAULT_HISTORY_ITEMS_LIMIT;
    }

    const queryString = new URLSearchParams(
      convertObjToString(actionParams),
    ).toString();
    const uri = `${this.historyNodeActions.getActions}?${queryString}`;

    const apiUrl = this.historyNodeUrls[nodeIndex];
    const result = await this.requestHistoryV2({ apiUrl, uri });

    return result;
  }
}
