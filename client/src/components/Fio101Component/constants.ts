import { ROUTES } from '../../constants/routes';

import FchInRectangleImageSrc from '../../assets/images/fch-in-rectangle.svg';
import FchWithDomainImageSrc from '../../assets/images/fch-with-domain.svg';
import FchWithPlanesImageSrc from '../../assets/images/fch-with-planes.svg';
import MappingImageSrc from '../../assets/images/mapping-image.svg';

export type Fio101SliderContentProps = {
  buttonText: string;
  imageSrc: string;
  link: string;
  oneItemLink?: string;
  title: string;
  text: string;
  videoId?: string;
};

export const FIO_101_SLIDER_CONTENT: {
  [key: string]: Fio101SliderContentProps;
} = {
  NO_FCH: {
    buttonText: 'Get a FIO Crypto Handle',
    imageSrc: FchInRectangleImageSrc,
    link: ROUTES.FIO_ADDRESSES_SELECTION,
    title: 'What’s a FIO crypto handle & why it’s useful?',
    text:
      'A FIO crypto handle is a human readable identifier that works across every token and coin in your wallet and eliminates the need to see or interact with public addresses.',
    videoId: 'ih9oVckc2bU',
  },
  NO_MAPPED_PUBLIC_ADDRESSES: {
    buttonText: 'Map Now',
    imageSrc: MappingImageSrc,
    link: ROUTES.FIO_ADDRESSES,
    oneItemLink: ROUTES.ADD_TOKEN,
    title: 'Why map your FIO Crypto Handle?',
    text:
      'By mapping your FIO Crypto Handle, users are presented with a simple to understand replacement for complicated public addresses across tokens and chains. This allows users to utilize a single crypto handle to send, recieve or request any type of crypto.',
  },
  NO_DOMAINS: {
    buttonText: 'Get a FIO Domain',
    imageSrc: FchWithDomainImageSrc,
    link: ROUTES.FIO_DOMAINS_SELECTION,
    title: 'What’s a FIO domain & why it’s useful?',
    text:
      'The FIO domain is the second part of the user’s FIO crypto handle. Once bought and registered, it is unavailable to another user and can be used  to create a unique FIO crypto handle for the owner.',
  },
  DEFAULT: {
    buttonText: 'Send a FIO Request',
    imageSrc: FchWithPlanesImageSrc,
    link: ROUTES.FIO_TOKENS_REQUEST,
    title: 'FIO requests .. What’s the deal?',
    text:
      'A FIO Request is a secure, decentralized, and private method of requesting a crypto payment from another user using their FIO Crypto Handle. No need to send a public address and no confusion on type or amount you want to receive.',
  },
};
