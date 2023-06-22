import { useCallback, useEffect, useState } from 'react';

import apis from '../../../api';
import { log } from '../../../../../util/general';
import { sleep } from '../../../../../utils';

import defaultImageSrc from '../../../../../assets/images/chain.svg';

import { PublicAddressDoublet } from '../../../../../types';

interface ImageData {
  [key: string]: string;
}

export type PublicAddressItem = {
  chainCodeName: string;
  iconSrc: string;
  tokenCodeName: string;
} & PublicAddressDoublet;

type UseContextProps = {
  activePublicAddress: PublicAddressItem | null;
  loading: boolean;
  publicAddresses: PublicAddressItem[];
  showModal: boolean;
  onModalClose: () => void;
  onItemClick: (publicAddress: PublicAddressItem) => void;
};

export const useContext = ({ fch }: { fch: string }): UseContextProps => {
  const [publicAddresses, setPublicAddresses] = useState<PublicAddressItem[]>(
    [],
  );
  const [loading, toggleLoading] = useState<boolean>(false);
  const [images, setImages] = useState<ImageData>({});
  const [showModal, toggleModal] = useState<boolean>(false);
  const [activePublicAddress, setActivePublicAddress] = useState<
    PublicAddressItem
  >(null);

  const imagesJSON = JSON.stringify(images);

  const getPublicAddresses = useCallback(async () => {
    toggleLoading(true);
    try {
      const imagesParsed: ImageData = JSON.parse(imagesJSON);
      const pubAddressesRes = await apis.fio.getPublicAddresses(fch);
      const pubAddresses = pubAddressesRes?.public_addresses.map(
        pubAddress => ({
          chainCode: pubAddress.chain_code,
          publicAddress: pubAddress.public_address,
          tokenCode: pubAddress.token_code,
        }),
      );
      const chainCodesList = pubAddresses.map(
        pubAddress => pubAddress.chainCode,
      );

      const selectedChainCodesList = await apis.chainCode.selectedList(
        chainCodesList,
      );

      setPublicAddresses(
        pubAddresses.map(pubAddress => {
          const chainCode = selectedChainCodesList.find(
            selectedChainCode =>
              selectedChainCode.chainCodeId.toUpperCase() ===
              pubAddress.chainCode.toUpperCase(),
          );

          const tokenCodeName = chainCode.tokens?.find(
            tokenCode => tokenCode.tokenCodeId === pubAddress.tokenCode,
          );

          return {
            iconSrc:
              imagesParsed[pubAddress.chainCode + '-' + pubAddress.tokenCode] ||
              defaultImageSrc,
            chainCodeName: chainCode.chainCodeName,
            tokenCodeName: tokenCodeName?.tokenCodeName || pubAddress.tokenCode,
            ...pubAddress,
          };
        }),
      );
    } catch (error) {
      log.error(error);
    }

    toggleLoading(false);
  }, [fch, imagesJSON]);

  const onModalClose = useCallback(async () => {
    toggleModal(false);
    await sleep(500);
    setActivePublicAddress(null);
  }, []);

  const onItemClick = useCallback((publicAddress: PublicAddressItem) => {
    setActivePublicAddress(publicAddress);
    toggleModal(true);
  }, []);

  useEffect(() => {
    getPublicAddresses();
  }, [getPublicAddresses]);

  useEffect(() => {
    const importImages = async () => {
      // @ts-ignore
      const context = require.context(
        '../../../../../assets/images/token-icons',
        false,
        /\.(png|jpe?g|svg)$/,
      );
      const keys = context.keys();

      const imagesData: ImageData = {};

      for (const key of keys) {
        const imageName = key.replace('./', '') as string;
        const imageUrl = await import(
          `../../../../../assets/images/token-icons/${imageName}`
        );
        imagesData[imageName.replace(/\.\w+$/, '')] = imageUrl.default;
      }

      setImages(imagesData);
    };

    importImages();
  }, []);

  return {
    activePublicAddress,
    loading,
    publicAddresses,
    showModal,
    onModalClose,
    onItemClick,
  };
};
