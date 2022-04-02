import { FioHistoryNodeAction } from '../types';

export default class FioHistory {
  historyNodeUrls: string[] = [process.env.REACT_APP_HISTORY_NODE_URL || ''];
  historyNodeActions = {
    getActions: 'get_actions',
  };
  async requestHistory(
    nodeIndex: number,
    params: {
      account_name: string;
      pos: number;
      offset: number;
    },
    uri: string = this.historyNodeActions.getActions,
  ): Promise<{
    actions?: FioHistoryNodeAction[];
    error?: { noNodeForIndex: boolean };
  }> {
    if (!this.historyNodeUrls[nodeIndex])
      return { error: { noNodeForIndex: true } };

    const apiUrl = this.historyNodeUrls[nodeIndex];
    const result = await fetch(`${apiUrl}history/${uri || ''}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    return result.json();
  }
}
