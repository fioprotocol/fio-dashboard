import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { FeePriceOptionsList } from '../../components/ConnectWallet/FeesModal/FeesModalInput';
// import EtherScan from '../../api/ether-scan';
import apis from '../../api';
import { log } from '../../util/general';

// const etherscan = new EtherScan();

export function useLoadFeePriceSuggestions(
  startLoad: boolean = false,
  isNFT: boolean = false,
): {
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
        // const gasData = await etherscan.getGasOracle(isNFT);
        const gasData = await apis.infura.getGasOracle({ isPolygon: isNFT });

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

        // This could be used in production
        // if (!isNFT) {
        //   const getHighPriceEstimation = etherscan
        //     .getEstimationOfConfirmationTime(gasData.FastGasPrice)
        //     .then((val: string) => {
        //       dataList[0].estimation = val;
        //     });
        //   const getMediumPriceEstimation = etherscan
        //     .getEstimationOfConfirmationTime(gasData.ProposeGasPrice)
        //     .then((val: string) => {
        //       dataList[1].estimation = val;
        //     });
        //   const getLowPriceEstimation = etherscan
        //     .getEstimationOfConfirmationTime(gasData.SafeGasPrice)
        //     .then((val: string) => {
        //       dataList[2].estimation = val;
        //     });
        //
        //   await Promise.all([
        //     getHighPriceEstimation,
        //     getMediumPriceEstimation,
        //     getLowPriceEstimation,
        //   ]);
        // }

        setFeePriceOptionsList(dataList);
        setIsLoading(false);
      } catch (e) {
        log.error(
          `Wrapped fio ${isNFT ? 'Domain' : 'Token'} fee suggestion error`,
          e,
        );
        setIsLoading(false);
      }
    };

    if (startLoad) getGasData();
  }, [startLoad, isNFT]);

  return {
    feePriceOptionsList,
    isLoading,
  };
}

export default useLoadFeePriceSuggestions;
