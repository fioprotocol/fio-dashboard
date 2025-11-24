import config from '../config';

const { wrap } = config || {};

export const getChainContractAddress = ({ chainId }: { chainId: number }) => {
  return Object.values(wrap).find(network => network.chainId === chainId)
    ?.contractAddress;
};
