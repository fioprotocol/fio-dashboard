import { useCallback, useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers/src.ts/web3-provider';
import { Contract } from '@ethersproject/contracts';

import apis from '../../api';
import { log } from '../../util/general';
import MathOp from '../../util/math';
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

const isValidNetwork = (network: NetworkType, isNFT: boolean): boolean => {
  return (
    network?.name &&
    (isNFT
      ? [NETWORKS_LIST.Polygon.chainID, NETWORKS_LIST.Amoy.chainID].includes(
          network.chainId,
        )
      : [
          NETWORKS_LIST.Ethereum.chainID,
          NETWORKS_LIST.Sepolia.chainID,
          NETWORKS_LIST.BaseSepolia.chainID,
          NETWORKS_LIST.Base.chainID,
        ].includes(network.chainId))
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

  const getExternalProviderNfts = useCallback(async (address: string) => {
    const nftsList = await apis.externalProviderNfts.getAllNfts(address);

    return nftsList.length > 0
      ? nftsList
          .filter(nftItem => !!nftItem.metadata)
          .map(nftItem => {
            const { metadata, token_id, normalized_metadata } = nftItem;
            const metadataName =
              normalized_metadata.name ||
              (metadata && JSON.parse(metadata).name);
            const name = metadataName && metadataName.split(': ')[1];
            return { name, id: token_id };
          })
          .reverse()
      : null;
  }, []);

  const getNftsWithContract = useCallback(
    async address => {
      const data = await tokenContract.listDomainsOfOwner(address);

      return data.length > 0
        ? data.map((nftData: string) => {
            const nftParts = nftData.split(': ');
            return {
              name: nftParts[0],
              id: nftParts[1],
            };
          })
        : null;
    },
    [tokenContract],
  );

  useEffect(() => {
    if (web3Provider && address && ethers.utils.isAddress(address)) {
      const getNfts = async (isFallback?: boolean) => {
        isNftsLoading.current = true;

        let nfts = null;

        if (isFallback) {
          nfts = await getNftsWithContract(address);
        } else {
          nfts = await getExternalProviderNfts(address);
        }

        setNfts(nfts);
        nftsOwner.current = address;
        isNftsLoading.current = false;

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
            const walletBalance = new MathOp(walletNativeBalance)
              .div(
                new MathOp(10)
                  .pow(isNFT ? W_FIO_DOMAIN_NFT.decimals : W_FIO_TOKEN.decimals)
                  .toString(),
              )
              .toString();

            setWFioBalance(walletBalance);

            if (
              isNFT &&
              (!nfts || nftsOwner.current !== address) &&
              !isNftsLoading.current &&
              tokenContract
            ) {
              setNfts(null);

              try {
                await getNfts();
              } catch (error) {
                log.error('Get external provider nfts error, retry', error);
                await getNfts(true);
              }
            }
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
    getNftsWithContract,
    getExternalProviderNfts,
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
