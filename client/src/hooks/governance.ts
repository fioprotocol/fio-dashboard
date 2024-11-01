import { useCallback, useState } from 'react';
import superagent from 'superagent';

import { GET_JIRA_CANDIDATES_URL } from '../constants/governance';

import useEffectOnce from './general';
import { log } from '../util/general';

import twitterLogo from '../assets/images/candidates-social-icons/twitter.svg';
import linkedinLogo from '../assets/images/candidates-social-icons/linkedin.svg';
import webLogo from '../assets/images/candidates-social-icons/website.svg';
import noImageIconSrc from '../assets/images/no-photo.svg';

import { CandidateProps, JiraCandidates } from '../types/governance';

export const useGetCandidates = (): {
  loading: boolean;
  candidatesList: Array<CandidateProps>;
} => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [candidatesList, setCandidatesList] = useState<Array<CandidateProps>>(
    [],
  );

  const getCandidates = useCallback(async () => {
    try {
      toggleLoading(true);
      const results = await superagent.get(GET_JIRA_CANDIDATES_URL);
      const jiraCandidates: JiraCandidates = results.body?.issues;

      const candidates = jiraCandidates.map(candidate => {
        const id = candidate.key?.replace('FB-', '');
        const {
          customfield_10176,
          customfield_10177,
          customfield_10178,
          customfield_10179,
          customfield_10180,
          customfield_10181,
          customfield_10183,
          status,
          summary,
        } = candidate.fields || {};

        const links = [];

        if (customfield_10179) {
          links.push({
            name: 'Twitter',
            url: customfield_10179,
            logo: twitterLogo,
          });
        }

        if (customfield_10177) {
          links.push({
            name: 'LinkedIn',
            url: customfield_10177,
            logo: linkedinLogo,
          });
        }

        if (customfield_10181) {
          links.push({ name: 'Web', url: customfield_10181, logo: webLogo });
        }

        return {
          country: customfield_10176,
          id,
          image: customfield_10178 || noImageIconSrc,
          links,
          lastVoteCount: customfield_10183,
          name: summary,
          status: status.name,
          text: customfield_10180?.content[0]?.content[0]?.text,
          url: customfield_10181,
        };
      });

      setCandidatesList(candidates);
    } catch (error) {
      log.error(error);
    } finally {
      toggleLoading(false);
    }
  }, []);

  useEffectOnce(() => {
    getCandidates();
  }, []);

  return { loading, candidatesList };
};
