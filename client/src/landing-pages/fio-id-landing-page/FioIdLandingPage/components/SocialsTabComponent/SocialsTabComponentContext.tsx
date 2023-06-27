import { useCallback, useEffect, useState } from 'react';

import apis from '../../../api';
import useEffectOnce from '../../../../../hooks/general';

import { CHAIN_CODES } from '../../../../../constants/common';
import { SOCIAL_MEDIA_LINKS } from '../../../../../constants/socialMediaLinks';

interface ImageData {
  [key: string]: string;
}

type SocialLinks = {
  iconSrc: string;
  name: string;
  link: string;
};

type UseContextProps = {
  loading: boolean;
  socialLinks: SocialLinks[];
};

const DEFAULT_LIMIT = 100;

export const useContext = ({ fch }: { fch: string }): UseContextProps => {
  const [loading, toggeLoading] = useState<boolean>(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinks[]>([]);
  const [images, setImages] = useState<ImageData>({});
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, toggleHasMore] = useState<boolean>(false);

  const imagesJSON = JSON.stringify(images);

  const getSocialLinks = useCallback(async () => {
    toggeLoading(true);
    const imagesParsed: ImageData = JSON.parse(imagesJSON);

    const { more, public_addresses } = await apis.fio.getPublicAddresses(
      fch,
      DEFAULT_LIMIT,
      offset,
    );

    toggleHasMore(more);
    setOffset(offset + DEFAULT_LIMIT);

    const socialLinksList = public_addresses
      .filter(publicAddress => publicAddress.chain_code === CHAIN_CODES.SOCIALS)
      .map(publicAddress => {
        const socialMediaLinkItem = SOCIAL_MEDIA_LINKS.find(
          socialMediaItem =>
            publicAddress.token_code.toLowerCase() ===
            socialMediaItem.name.toLowerCase(),
        );
        return {
          ...socialMediaLinkItem,
          link: socialMediaLinkItem.link + publicAddress.public_address,
        };
      });

    if (!socialLinksList?.length) {
      toggeLoading(false);
      return;
    }

    setSocialLinks(
      socialLinksList.map(socialLinkItem => ({
        ...socialLinkItem,
        iconSrc: imagesParsed[socialLinkItem.name],
      })),
    );
    toggeLoading(false);
  }, [fch, imagesJSON, offset]);

  useEffectOnce(
    () => {
      getSocialLinks();
    },
    [getSocialLinks],
    !!Object.keys(images).length,
  );

  useEffect(() => {
    if (hasMore) {
      getSocialLinks();
    }
  }, [hasMore, getSocialLinks]);

  useEffect(() => {
    const importImages = async () => {
      // @ts-ignore
      const context = require.context(
        '../../../../../assets/images/social-network-icons-rounded',
        false,
        /\.(png|jpe?g|svg)$/,
      );
      const keys = context.keys();

      const imagesData: ImageData = {};

      for (const key of keys) {
        const imageName = key.replace('./', '') as string;
        const imageUrl = await import(
          `../../../../../assets/images/social-network-icons-rounded/${imageName}`
        );
        imagesData[imageName.replace(/\.\w+$/, '')] = imageUrl.default;
      }

      setImages(imagesData);
    };

    importImages();
  }, []);

  return { loading, socialLinks };
};
