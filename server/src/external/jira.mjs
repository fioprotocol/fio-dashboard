import superagent from 'superagent';

import logger from '../logger';

export const getJiraCandidates = async ({ publicKey }) => {
  const queryParams = {
    jql: publicKey ? `filter=10081 AND summary ~ "${publicKey}"` : 'filter=10080',
    maxResults: 1000,
    fields: '*all',
  };

  const url = 'https://fioprotocol.atlassian.net/rest/api/3/search/jql';

  try {
    const results = await superagent.get(url).query(queryParams);
    return results.body.issues;
  } catch (error) {
    logger.error('Get Jira candidates error', error);
    throw error;
  }
};
