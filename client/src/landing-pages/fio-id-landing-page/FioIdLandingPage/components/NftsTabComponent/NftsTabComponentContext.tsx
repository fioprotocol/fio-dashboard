import { useCallback, useState } from 'react';

import apis from '../../../../../api';

import { NETWORKS_LIST } from '../../../../../constants/ethereum';
import { loadImage } from '../../../../../util/general';
import useEffectOnce from '../../../../../hooks/general';

import noImageIconSrc from '../../../../../assets/images/no-photo.svg';
import multipleSignatureIconSrc from '../../../../../assets/images/multiple-signature.svg';

export type NftItem = {
  contractAddress: string;
  creatorUrl?: string;
  hasMultipleSignatures: boolean;
  hash?: string;
  imageUrl: string;
  infuraMetadata?: {
    description?: (string | string[])[];
    externalUrl?: string;
    imageSrc?: string;
    name?: string;
  };
  isAlteredImage?: boolean;
  isImage?: boolean;
  tokenId: string;
  viewNftLink?: string;
};

type UseContextProps = {
  activeNftItem: NftItem;
  hasMore: boolean;
  loading: boolean;
  nftsList: NftItem[];
  showModal: boolean;
  loadMore: () => void;
  onItemClick: (nftItem: NftItem) => void;
  onModalClose: () => void;
};

const INFURA_HOST_URL = 'ipfs.infura.io';
const REWRITE_INFURA_HOST_URL = 'fio.infura-ipfs.io';

const DEFAULT_LIMIT = 6;

const newObject: { [key: string]: number } = {};
for (const network in NETWORKS_LIST) {
  const { currency, chainID } = NETWORKS_LIST[network];
  if (currency === NETWORKS_LIST['Polygon'].currency) {
    newObject[currency] = NETWORKS_LIST['Polygon'].chainID;
  } else {
    newObject[currency] = chainID;
  }
}

const convertDescriptionToArray = (
  inputString: string,
): (string | string[])[] => {
  if (!inputString) return [];

  const result: (string | string[])[] = [];
  const segments = inputString.split(/\.(?=\s|[A-Z]|[^\w\s])/);

  for (const segment of segments) {
    if (segment.includes(':')) {
      const [key, values] = segment.split(':');
      const valueArray = values.split(',').map(item => item.trim());
      const nestedArray = [key.trim(), ...valueArray];
      result.push(nestedArray);
    } else {
      const trimmedSegment = segment.trim();
      if (trimmedSegment) {
        result.push(trimmedSegment);
      }
    }
  }

  return result;
};

export const useContext = ({ fch }: { fch: string }): UseContextProps => {
  const [loading, toggeLoading] = useState<boolean>(false);
  const [nftsList, setNftsList] = useState<NftItem[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, toggleHasMore] = useState<boolean>(false);
  const [showModal, toggleModal] = useState<boolean>(false);
  const [activeNftItem, setActiveNftItem] = useState<NftItem>(null);

  const getNftsList = useCallback(async () => {
    toggeLoading(true);
    const { nfts, more } =
      (await apis.fio.getNFTs({ fioAddress: fch }, DEFAULT_LIMIT, offset)) ||
      {};

    toggleHasMore(more);
    setOffset(offset + DEFAULT_LIMIT);

    if (!nfts?.length) {
      toggeLoading(false);
      return;
    }

    const nftsCombined: NftItem[] = nftsList;

    for (const nftItem of nfts) {
      const {
        contract_address,
        chain_code,
        token_id,
        hash,
        metadata,
        url,
      } = nftItem;

      const nftItemObj: NftItem = {
        contractAddress: contract_address,
        hasMultipleSignatures: token_id === '*',
        imageUrl: '',
        tokenId: token_id,
      };

      if (hash) {
        nftItemObj.hash = hash;
      }

      const creatorUrl = (() => {
        try {
          return JSON.parse(metadata || '').creator_url;
        } catch (err) {
          return '';
        }
      })();

      if (creatorUrl) {
        nftItemObj.creatorUrl = creatorUrl;
      }

      if (newObject[chain_code] && !nftItemObj.hasMultipleSignatures) {
        try {
          const fioNftMetadata = await apis.infuraNfts.getNftMetadata({
            chainName: chain_code,
            tokenAddress: contract_address,
            tokenId: token_id,
          });

          if (fioNftMetadata) {
            const {
              normalized_metadata,
              metadata,
              token_uri: nftTokenUrl,
            } = fioNftMetadata;

            let nftDescription = null,
              nftExternalUrl = null,
              nftImage = null,
              nftName = null;

            const {
              description: normalizedNftDescription,
              external_link: normalizedNftExternalUrl,
              image: normalizedNftImage,
              name: normalizedNftName,
            } = normalized_metadata || {};

            if (metadata && typeof metadata === 'string') {
              const metadataParsed = JSON.parse(metadata);
              const { description, external_link, image, name } =
                metadataParsed || {};
              nftDescription = description;
              nftExternalUrl = external_link;
              nftImage = image;
              nftName = name;
            }

            const description =
              normalizedNftDescription || nftDescription || '';
            const externalUrl =
              normalizedNftExternalUrl || nftExternalUrl || nftTokenUrl || '';
            const image = normalizedNftImage || nftImage || '';
            const name = normalizedNftName || nftName || '';

            nftItemObj.infuraMetadata = {
              description: convertDescriptionToArray(description),
              externalUrl,
              imageSrc: image.replace(INFURA_HOST_URL, REWRITE_INFURA_HOST_URL),
              name,
            };
          }
        } catch (error) {
          //
        }
      }

      const fioImageUrl = await loadImage(url);
      const infuraImageUrl = await loadImage(
        nftItemObj.infuraMetadata?.imageSrc,
      );
      const infuraxtenalImageUrl = await loadImage(
        nftItemObj.infuraMetadata?.externalUrl,
      );

      const viewNftLink = fioImageUrl || infuraImageUrl || infuraxtenalImageUrl;

      if (viewNftLink) {
        nftItemObj.viewNftLink = viewNftLink;
      }

      nftItemObj.imageUrl = nftItemObj.hasMultipleSignatures
        ? multipleSignatureIconSrc
        : fioImageUrl ||
          infuraImageUrl ||
          infuraxtenalImageUrl ||
          noImageIconSrc;
      nftItemObj.isImage =
        !!fioImageUrl || !!infuraImageUrl || !!infuraxtenalImageUrl;

      // todo: commented due to DASH-711 task. We hide it until figureout with hash
      // if (
      //   hash &&
      //   nftItemObj.imageUrl &&
      //   nftItemObj.isImage &&
      //   !nftItemObj.hasMultipleSignatures
      // ) {
      //   try {
      //     const imageHash = await apis.general.getImageHash(
      //       nftItemObj.imageUrl,
      //     );

      //     nftItemObj.isAlteredImage = imageHash && imageHash !== hash;
      //   } catch (error) {
      //     //
      //   }
      // }

      nftsCombined.push(nftItemObj);
    }

    setNftsList(nftsCombined);
    toggeLoading(false);
  }, [fch, nftsList, offset]);

  const onModalClose = useCallback(async () => {
    toggleModal(false);
    setActiveNftItem(null);
  }, []);

  const onItemClick = useCallback((nftItem: NftItem) => {
    setActiveNftItem(nftItem);
    toggleModal(true);
  }, []);

  const loadMore = useCallback(() => {
    getNftsList();
  }, [getNftsList]);

  useEffectOnce(() => {
    getNftsList();
  }, [getNftsList]);

  return {
    activeNftItem,
    hasMore,
    loading,
    nftsList,
    showModal,
    loadMore,
    onItemClick,
    onModalClose,
  };
};
