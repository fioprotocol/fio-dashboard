import { useCallback, useEffect, useState } from 'react';
import superagent from 'superagent';

import shuffle from 'lodash/shuffle';

import { useSelector } from 'react-redux';

import { GET_JIRA_CANDIDATES_URL } from '../constants/governance';

import useEffectOnce from './general';
import { log } from '../util/general';

import twitterLogo from '../assets/images/social-network-governance/twitter.svg';
import linkedinLogo from '../assets/images/social-network-governance/linkedin.svg';
import webLogo from '../assets/images/social-network-governance/website.svg';
import noImageIconSrc from '../assets/images/no-photo.svg';

import { CandidateProps, JiraCandidates } from '../types/governance';
import { DetailedProxy } from '../types';
import apis from '../api';
import { fioWallets, isFioWalletsBalanceLoading } from '../redux/fio/selectors';

export const useGetCandidates = (): {
  loading: boolean;
  candidatesList: CandidateProps[];
} => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [candidatesList, setCandidatesList] = useState<CandidateProps[]>([]);

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

  useEffect(() => {
    void getProxyList();
  }, []);

  return { loading, proxyList };
};

export type OverviewWallet = {
  name: string;
  publicKey: string;
  votingPower: number;
  boardVote: boolean;
  blockProducerVote: boolean;
};

export const useWalletsOverview = () => {
  const wallets = useSelector(fioWallets);
  const balancesLoading = useSelector(isFioWalletsBalanceLoading);
  const [boardVotedLoading, setBoardVotedLoading] = useState<boolean>(false);
  const [boardVotedWallets, setBoardVotedWallets] = useState<string[]>([]);
  const [blockProducersVotedLoading, setBlockProducersVotedLoading] = useState<
    boolean
  >(false);
  const [blockProducersVotedWallets, setBlockProducersVotedWallets] = useState<
    string[]
  >([]);

  const walletsKeysToken = wallets
    .map(it => it.publicKey)
    .sort()
    .join(';');

  useEffect(() => {
    const getSentFioRequests = async () => {
      try {
        setBoardVotedLoading(true);

        const walletsToRecords = await Promise.all(
          wallets.map(it =>
            apis.fio.getSentFioRequests(it.publicKey).then(records => ({
              publicKey: it.publicKey,
              records: records,
            })),
          ),
        );

        const votedWallets = walletsToRecords
          .filter(
            ({ records }) =>
              !!records.find(it => it.payeeFioAddress === 'vote@fio'),
          )
          .map(({ publicKey }) => publicKey);

        setBoardVotedWallets(votedWallets);
      } catch (err) {
        log.error(err);
      } finally {
        setBoardVotedLoading(false);
      }
    };

    void getSentFioRequests();
  }, [walletsKeysToken]);

  useEffect(() => {
    const getSentFioRequests = async () => {
      try {
        setBlockProducersVotedLoading(true);

        const walletsToRecords = await Promise.all(
          wallets.map(it =>
            apis.fio.getBlockProducersVote(it.publicKey).then(records => ({
              publicKey: it.publicKey,
              records: records,
            })),
          ),
        );

        const votedWallets = walletsToRecords
          .filter(({ records }) => records.length > 0)
          .map(({ publicKey }) => publicKey);

        setBlockProducersVotedWallets(votedWallets);
      } catch (err) {
        log.error(err);
      } finally {
        setBlockProducersVotedLoading(false);
      }
    };

    void getSentFioRequests();
  }, [walletsKeysToken]);

  if (balancesLoading || boardVotedLoading || blockProducersVotedLoading) {
    return {
      overviewWallets: [] as OverviewWallet[],
      loading: balancesLoading,
    };
  }

  const overviewWallets: OverviewWallet[] = wallets.map(wallet => ({
    name: wallet.name,
    publicKey: wallet.publicKey,
    votingPower: wallet.balance ? wallet.balance / 1000000000 : 0,
    boardVote: boardVotedWallets.includes(wallet.publicKey),
    blockProducerVote: blockProducersVotedWallets.includes(wallet.publicKey),
  }));

  return { overviewWallets, loading: false };
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
