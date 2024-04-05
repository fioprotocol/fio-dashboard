import { useCallback, useEffect, useState } from 'react';

import apis from '../../../api';
import { log } from '../../../../../util/general';
import { sleep } from '../../../../../utils';

import { CHAIN_CODES } from '../../../../../constants/common';
import { tokensIcons } from '../../../../../constants/tokensIcons';

import defaultImageSrc from '../../../../../assets/images/chain.svg';

import { PublicAddressDoublet } from '../../../../../types';

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

const ANY_TOKEN_CODE = '*';

export const useContext = ({ fch }: { fch: string }): UseContextProps => {
  const [publicAddresses, setPublicAddresses] = useState<PublicAddressItem[]>(
    [],
  );
  const [loading, toggleLoading] = useState<boolean>(false);
  const [showModal, toggleModal] = useState<boolean>(false);
  const [activePublicAddress, setActivePublicAddress] = useState<
    PublicAddressItem
  >(null);

  useEffect(() => {
    const getPublicAddresses = async () => {
      toggleLoading(true);
      try {
        const pubAddressesRes = await apis.fio.getPublicAddresses(fch);
        const pubAddresses = pubAddressesRes?.public_addresses
          .filter(pubAddress => pubAddress.chain_code !== CHAIN_CODES.SOCIALS)
          .map(pubAddress => ({
            chainCode: pubAddress.chain_code,
            publicAddress: pubAddress.public_address,
            tokenCode: pubAddress.token_code,
          }));
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

            const chainCodeToken = chainCode?.tokens?.find(
              tokenCode => tokenCode.tokenCodeId === pubAddress.tokenCode,
            );

            const imageId =
              pubAddress.chainCode +
              '_' +
              (pubAddress.tokenCode === ANY_TOKEN_CODE
                ? pubAddress.chainCode
                : pubAddress.tokenCode);

            const tokenCodeName =
              chainCodeToken?.tokenCodeName ||
              (pubAddress.tokenCode === ANY_TOKEN_CODE
                ? null
                : pubAddress.tokenCode);

            const chainCodeName =
              chainCode?.chainCodeName || pubAddress.chainCode;

            const tokenCode =
              pubAddress.tokenCode === ANY_TOKEN_CODE
                ? null
                : pubAddress.tokenCode;

            return {
              ...pubAddress,
              iconSrc:
                (tokensIcons as Record<string, string>)[imageId] ??
                defaultImageSrc,
              tokenCode,
              tokenCodeName,
              chainCodeName,
            };
          }),
        );
      } catch (error) {
        log.error(error);
      }

      toggleLoading(false);
    };

    void getPublicAddresses();
  }, [fch]);

  const onModalClose = useCallback(async () => {
    toggleModal(false);
    await sleep(500);
    setActivePublicAddress(null);
  }, []);

  const onItemClick = useCallback((publicAddress: PublicAddressItem) => {
    setActivePublicAddress(publicAddress);
    toggleModal(true);
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
