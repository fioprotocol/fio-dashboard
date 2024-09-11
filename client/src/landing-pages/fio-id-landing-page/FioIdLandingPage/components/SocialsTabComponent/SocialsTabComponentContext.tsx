import { useCallback, useEffect, useState } from 'react';

import apis from '../../../api';

import { CHAIN_CODES } from '../../../../../constants/common';
import { SOCIAL_MEDIA_LINKS } from '../../../../../constants/socialMediaLinks';

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
  const [loading, toggleLoading] = useState<boolean>(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinks[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, toggleHasMore] = useState<boolean>(true);

  const getSocialLinks = useCallback(async () => {
    toggleLoading(true);

    const { more, public_addresses } = await apis.fio.getPublicAddresses(
      fch,
      DEFAULT_LIMIT,
      offset,
    );

    toggleHasMore(!!more);
    setOffset(offset + DEFAULT_LIMIT);

    const socialLinksList = public_addresses
      .filter(publicAddress => publicAddress.chain_code === CHAIN_CODES.SOCIALS)
      .map(publicAddress => {
        const socialMediaLinkItem = SOCIAL_MEDIA_LINKS.find(
          socialMediaItem =>
            publicAddress.token_code.toLowerCase() ===
            socialMediaItem.tokenName.toLowerCase(),
        );
        return {
          ...socialMediaLinkItem,
          link: socialMediaLinkItem.link + publicAddress.public_address,
        };
      });

    if (!socialLinksList?.length) {
      toggleLoading(false);
      return;
    }

    setSocialLinks(
      socialLinksList.map(it => ({ ...it, iconSrc: it.roundedIconSrc })),
    );
    toggleLoading(false);
  }, [fch, offset]);

  useEffect(() => {
    if (hasMore) {
      void getSocialLinks();
    }
  }, [hasMore, getSocialLinks]);

  return { loading, socialLinks };
};
