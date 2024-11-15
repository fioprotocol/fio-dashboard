import { useCallback, useEffect, useState } from 'react';
import superagent from 'superagent';
import { useHistory } from 'react-router';

import shuffle from 'lodash/shuffle';

import { useSelector } from 'react-redux';

import {
  GET_JIRA_CANDIDATES_URL,
  GET_BLOCK_PRODUCERS_URL,
} from '../constants/governance';
import { FIO_CHAIN_ID } from '../constants/fio';
import { ROUTES } from '../constants/routes';

import apis from '../api';
import config from '../config';
import useEffectOnce from './general';
import { log } from '../util/general';

import {
  fioWallets as fioWalletsSelector,
  isFioWalletsBalanceLoading,
} from '../redux/fio/selectors';

import { siteSetings } from '../redux/settings/selectors';

import telegramLogo from '../assets/images/social-network-governance/telegram.svg';
import twitterLogo from '../assets/images/social-network-governance/twitter.svg';
import linkedinLogo from '../assets/images/social-network-governance/linkedin.svg';
import webLogo from '../assets/images/social-network-governance/website.svg';
import noImageIconSrc from '../assets/images/no-photo.svg';
import noBpIconSrc from '../assets/images/no-bp-image.svg';
import noBpIconDarkSrc from '../assets/images/no-bp-image-dark.svg';

import {
  BlockProducersItemProps,
  BlockProducersResult,
  CandidateProps,
  CandidatesVotes,
  JiraCandidates,
  OverviewWallet,
  WalletsFioRequest,
} from '../types/governance';
import { DetailedProxy } from '../types';
import { VARS_KEYS } from '../constants/vars';

const getJiraCandidatesUrl = (publicKey?: string) => {
  if (!publicKey) {
    return GET_JIRA_CANDIDATES_URL;
  }

  return `https://jira.fio.net/search?jql=filter=10081 AND summary ~ "${publicKey}"&maxResults=1000`;
};

export const useGetCandidates = (): {
  loading: boolean;
  candidatesList: CandidateProps[];
} => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [candidatesList, setCandidatesList] = useState<CandidateProps[]>([]);

  const getCandidates = useCallback(async () => {
    try {
      toggleLoading(true);
      const results = await superagent.get(getJiraCandidatesUrl());

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
          customfield_10184,
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
          lastVoteUpdate: customfield_10184,
          name: summary,
          status: status?.name,
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
    void getCandidates();
  }, []);

  return { loading, candidatesList };
};

export const useGetPublicKeyCandidatesVotes = (
  publicKey: string,
): {
  candidatesVotes: CandidatesVotes;
  loading: boolean;
} => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [
    candidatesVotes,
    setCandidatesVotes,
  ] = useState<CandidatesVotes | null>(null);

  const settings = useSelector(siteSetings);

  const getCandidates = useCallback(
    async (publicKey?: string) => {
      try {
        toggleLoading(true);
        const boardPublicKey =
          settings[VARS_KEYS.MOCKED_PUBLIC_KEYS_FOR_BOARD_VOTE] &&
          config.fioChainId === FIO_CHAIN_ID.TESTNET
            ? settings[VARS_KEYS.MOCKED_PUBLIC_KEYS_FOR_BOARD_VOTE]
            : publicKey;

        const results = await superagent.get(
          getJiraCandidatesUrl(boardPublicKey),
        );

        const jiraCandidatesResults: JiraCandidates = results.body?.issues;

        const { fields } = jiraCandidatesResults[0] || {};

        const candidatesVotesRersults = {
          currentBoardVotingPower: fields?.customfield_10183,
          boardVotingPowerLastUpdate: fields?.customfield_10184,
          candidatesIdsList: fields?.issuelinks
            .filter(issueLink => issueLink?.type?.outward === 'votes on')
            .map(({ outwardIssue: { key } }) => key?.replace('FB-', '')),
        };

        setCandidatesVotes(candidatesVotesRersults);
      } catch (error) {
        log.error(error);
      } finally {
        toggleLoading(false);
      }
    },
    [settings],
  );

  useEffectOnce(() => {
    void getCandidates(publicKey);
  }, [publicKey]);

  return { loading, candidatesVotes };
};

export const useDetailedProxies = () => {
  const [proxyList, setProxyList] = useState<DetailedProxy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getProxyList = async () => {
    try {
      setLoading(true);
      const proxies = await apis.fio.getDetailedProxies();
      setProxyList(shuffle(proxies));
    } catch (error) {
      log.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffectOnce(() => {
    void getProxyList();
  }, []);

  return { loading, proxyList };
};

export const useOveriewWallets = (): {
  overviewWallets: OverviewWallet[];
  loading: boolean;
} => {
  const fioWallets = useSelector(fioWalletsSelector);
  const walletsLoading = useSelector(isFioWalletsBalanceLoading);
  const settings = useSelector(siteSetings);

  const [walletVotes, setwalletVotes] = useState<{
    [key: string]: DetailedProxy[];
  }>({});
  const [isWalletVotesLoading, toggleIsWalletVotesLoading] = useState<boolean>(
    false,
  );
  const [
    walletsFioRequests,
    setWalletsFioRequests,
  ] = useState<WalletsFioRequest | null>(null);
  const [
    isWalletsFioRequestsLoading,
    toggleIsWalletsFioRequestsLoading,
  ] = useState<boolean>(false);

  const history = useHistory();

  const isGovernanceTab =
    history.location?.pathname === ROUTES.GOVERNANCE_OVERVIEW;

  const getCurrentWalletVotes = useCallback(async (publicKey: string) => {
    try {
      const currentWalletVotes = await apis.fio.getWalletVotes(publicKey);

      setwalletVotes(prevVotes => ({
        ...prevVotes,
        [publicKey]: currentWalletVotes,
      }));
    } catch (error) {
      log.error(error);
    }
  }, []);

  const getCurrentWalletFioRequests = useCallback(async () => {
    toggleIsWalletsFioRequestsLoading(true);

    try {
      const fioRequests = await apis.account.getFioRequests();

      setWalletsFioRequests(fioRequests);
    } catch (error) {
      log.error(error);
    } finally {
      toggleIsWalletsFioRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isGovernanceTab) {
      toggleIsWalletVotesLoading(true);
      Promise.all(
        fioWallets.map(fioWallet => getCurrentWalletVotes(fioWallet.publicKey)),
      ).finally(() => {
        toggleIsWalletVotesLoading(false);
      });

      getCurrentWalletFioRequests();
    }
  }, [
    fioWallets,
    getCurrentWalletFioRequests,
    getCurrentWalletVotes,
    isGovernanceTab,
  ]);

  const overviewWallets = fioWallets?.map(fioWallet => ({
    ...fioWallet,
    votes: walletVotes[fioWallet?.publicKey] || [],
    hasProxy: walletVotes[fioWallet?.publicKey]?.some(
      walletVote => walletVote.isAutoProxy || !!walletVote.proxy,
    ),
    hasVotedForBoardOfDirectors:
      walletsFioRequests &&
      walletsFioRequests[fioWallet?.publicKey]?.sent.some(
        ({ payer_fio_address }) =>
          payer_fio_address === settings[VARS_KEYS.VOTE_FIO_HANDLE],
      ),
  }));

  return {
    overviewWallets,
    loading:
      walletsLoading || isWalletVotesLoading || isWalletsFioRequestsLoading,
  };
};

export const useModalState = <T>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T>();

  const open = useCallback((data?: T) => {
    setIsOpen(true);
    setData(data);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close, data };
};

export const useGetBlockProducers = (): {
  loading: boolean;
  blockProducersList: BlockProducersItemProps[];
} => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [blockProducersList, setBlockProducersList] = useState<
    BlockProducersItemProps[]
  >([]);

  const getBlockProducers = useCallback(async () => {
    try {
      toggleLoading(true);

      let blockProducersUrl = GET_BLOCK_PRODUCERS_URL;

      if (config.fioChainId === FIO_CHAIN_ID.TESTNET) {
        blockProducersUrl += '&chain=Testnet';
      }

      const results = await superagent.get(blockProducersUrl);

      const blockProducersResult: BlockProducersResult = results.body;

      const blockProducers: BlockProducersItemProps[] = blockProducersResult
        .sort((a, b) => b.total_votes - a.total_votes)
        .map(
          (
            {
              branding: { logo_svg, logo_256 },
              candidate_name,
              fio_address,
              flagIconUrl,
              id,
              owner,
              score: {
                details: {
                  valid_fio_address: { status },
                },
                grade,
              },
              socials: { telegram, twitter },
              total_votes,
              url,
            },
            i,
          ) => {
            const links = [];

            if (twitter) {
              links.push({
                name: 'Twitter',
                url: twitter,
                logo: twitterLogo,
              });
            }

            if (telegram) {
              links.push({
                name: 'Telegram',
                url: telegram,
                logo: telegramLogo,
              });
            }

            if (url) {
              links.push({ name: 'Web', url: url, logo: webLogo });
            }

            return {
              fioAddress: fio_address,
              flagIconUrl,
              grade,
              id,
              isTop21: i <= 21,
              isValidFioHandle: status,
              links,
              logo: logo_svg || logo_256,
              defaultLogo: noBpIconSrc,
              defaultDarkLogo: noBpIconDarkSrc,
              name: candidate_name || 'N/A',
              owner,
              totalVotes: total_votes,
            };
          },
        );

      setBlockProducersList(blockProducers);
    } catch (error) {
      log.error(error);
    } finally {
      toggleLoading(false);
    }
  }, []);

  useEffectOnce(() => {
    getBlockProducers();
  }, []);

  return { loading, blockProducersList };
};
