import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { FeePriceOptionsList } from '../../components/ConnectWallet/FeesModal/FeesModalInput';
import apis from '../../api';
import { log } from '../../util/general';
import { WRAP_TYPE } from '../../constants/wrap';

export function useLoadFeePriceSuggestions({
  startLoad,
  chainCode,
  type,
}: {
  startLoad: boolean;
  chainCode: string;
  type: keyof typeof WRAP_TYPE;
}): {
  feePriceOptionsList: FeePriceOptionsList;
  isLoading: boolean;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [feePriceOptionsList, setFeePriceOptionsList] = useState<
    FeePriceOptionsList
  >([]); // wei
  useEffect(() => {
    const getGasData = async () => {
      try {
        setIsLoading(true);
        // could be used EtherScan as alternative
        const gasData = await apis.infura.getGasOracle({ chainCode });

        const dataList: FeePriceOptionsList = [
          {
            name: 'High',
            gasPrice: ethers.utils
              .parseUnits(gasData?.FastGasPrice, 'wei')
              .toString(),
          },
          {
            name: 'Medium',
            gasPrice: ethers.utils
              .parseUnits(gasData?.ProposeGasPrice, 'wei')
              .toString(),
          },
          {
            name: 'Low',
            gasPrice: ethers.utils
              .parseUnits(gasData?.SafeGasPrice, 'wei')
              .toString(),
          },
        ];

        setFeePriceOptionsList(dataList);
        setIsLoading(false);
      } catch (e) {
        log.error(`Wrapped FIO ${type} fee suggestion error`, e);
        setIsLoading(false);
      }
    };

    if (startLoad) getGasData();
  }, [startLoad, type, chainCode]);

  return {
    feePriceOptionsList,
    isLoading,
  };
}

export default useLoadFeePriceSuggestions;
