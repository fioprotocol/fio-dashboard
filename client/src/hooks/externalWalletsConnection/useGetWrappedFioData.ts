import { useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers/src.ts/web3-provider';
import { Contract } from '@ethersproject/contracts';

import apis from '../../api';
import { log } from '../../util/general';
import EtherScan, { LogItem } from '../../api/ether-scan';
import {
  NETWORKS_LIST,
  W_FIO_DOMAIN_NFT,
  W_FIO_TOKEN,
} from '../../constants/ethereum';
import ABI_WRAPPED_FIO_TOKEN from '../../constants/abi_wrapped_fio_token';
import ABI_WRAPPED_FIO_DOMAIN_NFT from '../../constants/abi_wrapped_fio_domain_nft';

import { NetworkType } from './useInitializeProviderConnection';

export type WrappedFioData = {
  tokenContract: Contract;
  wFioBalance: string | null;
  nfts: NtfsItems;
  isWrongNetwork: boolean;
};

export type NtfsItems = { name: string; id: string }[];

const etherscan = new EtherScan();

const isValidNetwork = (network: NetworkType, isNFT: boolean): boolean => {
  return (
    network?.name &&
    (isNFT
      ? network.chainId === NETWORKS_LIST.Polygon.chainID ||
        network.chainId === NETWORKS_LIST.Mumbai.chainID
      : network.chainId === NETWORKS_LIST.Ethereum.chainID ||
        network.chainId === NETWORKS_LIST.Goerli.chainID)
  );
};

export function useGetWrappedFioData(
  web3Provider: Web3Provider,
  network: NetworkType,
  address: string,
  isNFT?: boolean,
): WrappedFioData {
  const isNftsLoading = useRef(false);
  const nftsOwner = useRef(null);
  const [wFioBalance, setWFioBalance] = useState<string | null>(null);
  const [tokenContract, setTokenContract] = useState<Contract>(null);
  const [nfts, setNfts] = useState<NtfsItems>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [abi, setAbi] = useState(null);

  useEffect(() => {
    if (web3Provider && address && ethers.utils.isAddress(address)) {
      // Example of getting wFioDomains not by the contract method
      // For wrapped FIO Domains, balance = count of wDomains (nfts) on Polygon chain
      const getNfts = async (balance?: number) => {
        isNftsLoading.current = true;
        let pageNumber = 1;
        const limit = 20; // For public endpoint users, an IP based limit is applied at 150000/day;700/minute;40/second. Therefore, each transfer event makes two calls (40\2=20)

        // Function that will get wDomain (nft) data from chain Logs.
        const getData = async (
          page: number = pageNumber,
          offset: number = limit,
          nftsList: NtfsItems = [],
        ) => {
          // Get Logs from chain, could be duplicated (wrap \ unwrap \ transfer to another account)
          const transferLogs = await etherscan.getNftsTransferEventLogs(
            page,
            offset,
            address,
          );

          nftsOwner.current = address;

          const tokensIdsSet = new Set();

          // Filter unique tokenIds only
          transferLogs?.forEach((o: LogItem) => {
            tokensIdsSet.add(o.tokenID);
          });

          // Get wDomain (nft) data
          const getLogData = async (
            tokenId: string,
          ): Promise<{ name: string; id: string } | null> => {
            try {
              const tokenInfo = await Promise.all([
                tokenContract.tokenURI(tokenId), // returns wDomain url string
                tokenContract.ownerOf(tokenId), // returns wDomain owner address string
              ]);

              if (tokenInfo[1].toLowerCase() === address.toLowerCase()) {
                const domainName = tokenInfo[0].match(
                  /domainnft\/(.*?).json/,
                )[1];

                return {
                  name: domainName,
                  id: tokenId,
                };
              } else return null;
            } catch (e) {
              return null;
            }
          };

          const promises: Promise<{ name: string; id: string } | null>[] = [];

          tokensIdsSet.forEach(value => {
            promises.push(getLogData(value as string));
          });

          const result = (await Promise.all(promises)).filter(o => !!o);

          if (result.length) nftsList = [...nftsList, ...result];

          // recursively get next portion of the data if needed
          if (
            transferLogs?.length === offset &&
            balance &&
            (nftsList?.length || 0) < balance
          ) {
            pageNumber = pageNumber + 1;
            setTimeout(() => getData(pageNumber, limit, nftsList), 1000);
          } else {
            isNftsLoading.current = false;
            setNfts(nftsList);
          }
        };

        await getData(pageNumber, limit);

        // example of using etherjs provider to get the logs, but it works with limitation of only 1000 Blocks per request and difference between two transactions could be more than 10000 Blocks
        // const currentBlock = await web3Provider.getBlockNumber();
        // const eventFilter = tokenContract.filters.Transfer();
        // const events = await tokenContract.queryFilter(
        //   eventFilter,
        //   currentBlock - 999,
        //   currentBlock,
        // );
      };

      const getBalance = async () => {
        try {
          if (isValidNetwork(network, isNFT)) {
            const defaultAbi = isNFT
              ? ABI_WRAPPED_FIO_DOMAIN_NFT
              : ABI_WRAPPED_FIO_TOKEN;
            let contractAbi = abi;
            if (!abi?.length)
              try {
                const resAbi = await apis.client.get(
                  isNFT ? 'abi_fio_domain_nft' : 'abi_fio_token',
                );
                contractAbi = resAbi;
                setAbi(resAbi);
              } catch (e) {
                log.error(
                  `wrapped FIO ${isNFT ? 'domains' : 'tokens'} fetch ABI error`,
                  e,
                );
              }
            const newTokenContract = new ethers.Contract(
              isNFT ? W_FIO_DOMAIN_NFT.address : W_FIO_TOKEN.address,
              contractAbi || defaultAbi,
              web3Provider.getSigner(),
            );

            if (!tokenContract || (!abi && contractAbi))
              setTokenContract(newTokenContract);

            const walletNativeBalance = await newTokenContract.balanceOf(
              address,
            );
            const walletBalance =
              walletNativeBalance.toString() /
              Math.pow(
                10,
                isNFT ? W_FIO_DOMAIN_NFT.decimals : W_FIO_TOKEN.decimals,
              );

            setWFioBalance(walletBalance + '');

            if (
              isNFT &&
              (!nfts || nftsOwner.current !== address) &&
              !isNftsLoading.current &&
              tokenContract
            ) {
              setNfts(null);
              await getNfts(walletBalance);
            }

            // todo: use it when newTokenContract.listDomainsOfOwner method will get fixed
            // if (isNFT && !nfts && !isNftsLoading.current) {
            //   isNftsLoading.current = true;
            //   const nftsList =
            //     (await newTokenContract.listDomainsOfOwner(address)) || [];
            //   setNfts(nftsList);
            //   isNftsLoading.current = false;
            // }
          } else
            log.error(
              `Cannot get balance for wrong Network (${network.name.toUpperCase()})`,
            );
        } catch (e) {
          log.error(
            `wrapped FIO ${isNFT ? 'domains' : 'tokens'} balance error`,
            e,
          );
        }
      };
      getBalance();
    }
  }, [
    web3Provider,
    address,
    isNFT,
    nfts,
    network,
    abi,
    tokenContract,
    wFioBalance,
  ]);

  // clear balance, when address input has been cleared
  useEffect(() => {
    if (web3Provider && wFioBalance && !address) {
      setWFioBalance(null);
      setNfts(null);
    }
  }, [address, wFioBalance, web3Provider]);

  // validate network
  useEffect(() => {
    if (!address || !network || isValidNetwork(network, isNFT)) {
      setIsWrongNetwork(false);
    } else setIsWrongNetwork(true);
  }, [network, isNFT, address]);

  return {
    wFioBalance,
    tokenContract,
    nfts,
    isWrongNetwork,
  };
}

export default useGetWrappedFioData;
