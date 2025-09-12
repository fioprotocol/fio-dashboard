import { useCallback, useEffect, useMemo, useState } from 'react';
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
  ProxyDetailedProxy,
  WalletsFioRequest,
} from '../types/governance';
import { DetailedProxy } from '../types';
import { VARS_KEYS } from '../constants/vars';
import {
  SOCIAL_MEDIA_IDS,
  SOCIAL_MEDIA_URLS,
} from '../constants/socialMediaLinks';

const getJiraCandidatesUrl = (publicKey?: string): string => {
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

export const useGetPublicKeyCandidatesVotes = ({
  proxyPublicKey,
  publicKey,
}: {
  proxyPublicKey: string;
  publicKey: string;
}): {
  candidatesVotes: CandidatesVotes;
  loading: boolean;
} => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [
    candidatesVotes,
    setCandidatesVotes,
  ] = useState<CandidatesVotes | null>(null);

  const settings = useSelector(siteSetings);

  const boardPublicKey =
    proxyPublicKey != null
      ? proxyPublicKey
      : settings[VARS_KEYS.MOCKED_PUBLIC_KEYS_FOR_BOARD_VOTE] &&
        config.fioChainId === FIO_CHAIN_ID.TESTNET
      ? settings[VARS_KEYS.MOCKED_PUBLIC_KEYS_FOR_BOARD_VOTE]
      : publicKey;

  const getCandidates = useCallback(async (jiraPublicKey: string) => {
    try {
      toggleLoading(true);

      const results = await superagent.get(getJiraCandidatesUrl(jiraPublicKey));

      const jiraCandidatesResults: JiraCandidates = results.body?.issues;

      const { fields } = jiraCandidatesResults[0] || {};

      const candidatesVotesResults = {
        currentBoardVotingPower: fields?.customfield_10183,
        boardVotingPowerLastUpdate: fields?.customfield_10184,
        candidatesList: fields?.issuelinks
          .filter(issueLink => issueLink?.type?.outward === 'votes on')
          .map(({ outwardIssue: { key, fields } }) => ({
            id: key?.replace('FB-', '') || '',
            name: fields?.summary || '',
            image: noImageIconSrc,
            status: fields?.status?.name || '',
          })),
      };
      setCandidatesVotes(candidatesVotesResults);
    } catch (error) {
      log.error(error);
    } finally {
      toggleLoading(false);
    }
  }, []);

  useEffect(() => {
    void getCandidates(boardPublicKey);
  }, [boardPublicKey, getCandidates]);

  return { loading, candidatesVotes };
};

export const useDetailedProxies = (): {
  proxyList: DetailedProxy[];
  loading: boolean;
} => {
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

  const history = useHistory<{
    updateOverview: boolean;
  }>();

  const { location } = history;
  const { pathname, state: locationState } = location;

  const [state, setState] = useState({
    walletVotes: {} as { [key: string]: DetailedProxy[] },
    proxyVotes: {} as { [key: string]: ProxyDetailedProxy },
    walletsFioRequests: null as WalletsFioRequest | null,
    isLoading: false,
    dataFetched: false,
    firstLoad: true,
  });

  const memoizedWalletsPublicKeys = useMemo(
    () => fioWallets.map(wallet => wallet.publicKey),
    [fioWallets],
  );

  const isGovernanceTab = pathname === ROUTES.GOVERNANCE_OVERVIEW;

  const clearRouterState = useCallback(() => {
    const state = history.location?.state;

    if (state) {
      delete state.updateOverview;
    }

    history.replace({ ...history.location, state });
  }, [history]);

  // Combine data fetching into a single function
  const fetchWalletData = useCallback(async () => {
    if (
      (!isGovernanceTab &&
        !state.firstLoad &&
        !locationState?.updateOverview) ||
      state.dataFetched
    )
      return;

    clearRouterState();
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Fetch FIO requests
      const fioRequests = await apis.account.getFioRequests();

      // Prepare votes data
      const usersWalletsVotes: { [key: string]: DetailedProxy[] } = {};
      const proxiesWalletsVotes: { [key: string]: ProxyDetailedProxy } = {};

      // Fetch votes for all wallets in parallel
      await Promise.all(
        memoizedWalletsPublicKeys.map(async walletPublicKey => {
          try {
            const userWalletVotes = await apis.fio.getWalletVotes(
              walletPublicKey,
            );
            usersWalletsVotes[walletPublicKey] = userWalletVotes;

            const proxyAccount = userWalletVotes.find(vote => !!vote.proxy)
              ?.proxy;

            if (proxyAccount) {
              const proxyPublicKey = await apis.fio.getAccountPubKey(
                proxyAccount,
              );
              if (proxyPublicKey) {
                const proxyWalletVotes = await apis.fio.getWalletVotes(
                  proxyPublicKey,
                );
                proxiesWalletsVotes[walletPublicKey] = {
                  publicKey: proxyPublicKey,
                  votes: proxyWalletVotes,
                };
              }
            }
          } catch (error) {
            log.error(
              `Error fetching data for wallet ${walletPublicKey}:`,
              error,
            );
          }
        }),
      );

      setState(prev => ({
        ...prev,
        walletVotes: usersWalletsVotes,
        proxyVotes: proxiesWalletsVotes,
        walletsFioRequests: fioRequests,
        isLoading: false,
        dataFetched: true,
        firstLoad: false,
      }));
    } catch (error) {
      log.error('Error fetching wallet data:', error);
      setState(prev => ({ ...prev, isLoading: false, firstLoad: false }));
    }
  }, [
    isGovernanceTab,
    state.firstLoad,
    state.dataFetched,
    locationState?.updateOverview,
    clearRouterState,
    memoizedWalletsPublicKeys,
  ]);

  useEffect(() => {
    if (
      (isGovernanceTab || state.firstLoad || locationState?.updateOverview) &&
      !state.dataFetched &&
      !state.isLoading
    ) {
      fetchWalletData();
    }
  }, [
    isGovernanceTab,
    fetchWalletData,
    state.dataFetched,
    state.isLoading,
    state.firstLoad,
    locationState?.updateOverview,
  ]);

  useEffect(() => {
    if (!isGovernanceTab) {
      setState(prev => ({ ...prev, dataFetched: false }));
    }
  }, [isGovernanceTab, state.dataFetched]);

  const overviewWallets = useMemo(
    () =>
      fioWallets?.map(fioWallet => ({
        ...fioWallet,
        votes: state.walletVotes[fioWallet?.publicKey] || [],
        hasProxy: state.walletVotes[fioWallet?.publicKey]?.some(
          walletVote => walletVote.isAutoProxy || !!walletVote.proxy,
        ),
        proxyVotes: state.proxyVotes[fioWallet?.publicKey],
        hasVotedForBoardOfDirectors:
          state.walletsFioRequests &&
          state.walletsFioRequests[fioWallet?.publicKey]?.sent.some(
            ({ payer_fio_address }) =>
              payer_fio_address === settings[VARS_KEYS.VOTE_FIO_HANDLE],
          ),
      })),
    [
      fioWallets,
      state.walletVotes,
      state.proxyVotes,
      state.walletsFioRequests,
      settings,
    ],
  );

  return {
    overviewWallets,
    loading: walletsLoading || state.isLoading,
  };
};

export const useModalState = <T>(): {
  isOpen: boolean;
  open: (data?: T) => void;
  close: () => void;
  data: T | undefined;
} => {
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
                url: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.TWITTER]}${twitter}`,
                logo: twitterLogo,
              });
            }

            if (telegram) {
              links.push({
                name: 'Telegram',
                url: `${
                  SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.TELEGRAM]
                }${telegram}`,
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
