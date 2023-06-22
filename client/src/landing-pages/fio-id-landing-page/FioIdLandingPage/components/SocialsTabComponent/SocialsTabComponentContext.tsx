import { useCallback, useEffect, useState } from 'react';

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

const mockedData: SocialLinks[] = [
  {
    iconSrc: '',
    name: 'discord',
    link: 'https://discordapp.com/users/',
  },
  {
    iconSrc: '',
    name: 'facebook',
    link: 'https://facebook.com/',
  },
  {
    iconSrc: '',
    name: 'hive',
    link: 'https://peakd.com/@',
  },
  {
    iconSrc: '',
    name: 'instagram',
    link: 'https://instagram.com/',
  },
  {
    iconSrc: '',
    name: 'linkedin',
    link: 'https://www.linkedin.com/in/',
  },
  {
    iconSrc: '',
    name: 'mastodon',
    link: 'https://mastodon.social/@',
  },
  {
    iconSrc: '',
    name: 'nostr',
    link: 'https://iris.to/',
  },
  {
    iconSrc: '',
    name: 'reddit',
    link: 'https://www.reddit.com/user',
  },
  {
    iconSrc: '',
    name: 'twitter',
    link: 'https://twitter.com/',
  },
  {
    iconSrc: '',
    name: 'telegram',
    link: 'https://t.me/',
  },
  {
    iconSrc: '',
    name: 'whatsapp',
    link: 'https://wa.me/',
  },
];

export const useContext = ({ fch }: { fch: string }): UseContextProps => {
  const [loading, toggeLoading] = useState<boolean>(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinks[]>([]);
  const [images, setImages] = useState<ImageData>({});

  const imagesJSON = JSON.stringify(images);

  const getSocialLinks = useCallback(() => {
    toggeLoading(true);
    const imagesParsed: ImageData = JSON.parse(imagesJSON);
    setSocialLinks(
      mockedData.map(socialLinkItem => ({
        ...socialLinkItem,
        iconSrc: imagesParsed[socialLinkItem.name],
      })),
    );
    toggeLoading(false);
  }, [imagesJSON]);

  useEffect(() => {
    getSocialLinks();
  }, [getSocialLinks]);

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
