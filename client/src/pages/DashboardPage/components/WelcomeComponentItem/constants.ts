import { ROUTES } from '../../../../constants/routes';

import Addbox from '../../../../assets/images/add-box.svg';
import ExclamationCircleImgSrc from '../../../../assets/images/exclamation-circle.svg';
import FreeImgSrc from '../../../../assets/images/free.svg';
import GroupImgSrc from '../../../../assets/images/group.svg';
import GrowthImgSrc from '../../../../assets/images/growth.svg';
import LocationPinImgSrc from '../../../../assets/images/location-pin.svg';
import NetworkImgSrc from '../../../../assets/images/network.svg';
import NotsetupImgSrc from '../../../../assets/images/notsetup.svg';
import OpenseaImgSrc from '../../../../assets/images/opensea.svg';
import PackageImgSrc from '../../../../assets/images/package.svg';
import PasswordImgSrc from '../../../../assets/images/password.svg';

export const WELCOME_COMPONENT_ITEM_CONTENT = {
  RECOVERY_PASSWORD: {
    title: 'Set-up Password Recovery',
    text:
      'If you lose your account information, password recovery is the only way you will be able to restore your account.',
    imageSrc: NotsetupImgSrc,
    actionButtonText: 'Set-up Now',
    actionButtonLink: ROUTES.SETTINGS,
    isRed: true,
  },
  EXPIRED_DOMAINS: {
    title: 'Expired Domain(s)',
    text:
      'You have domains which have expired. Please renew them before they are burned.',
    imageSrc: ExclamationCircleImgSrc,
    actionButtonText: 'Renew Now',
    actionButtonLink: ROUTES.FIO_DOMAINS,
  },
  NO_FCH: {
    title: 'Get your FREE FIO Crypto Handle',
    text:
      'It will replace all your complicated public addresses across all tokens and coins in your wallets.',
    imageSrc: FreeImgSrc,
    actionButtonText: 'Buy Now',
    actionButtonLink: ROUTES.FIO_ADDRESSES_SELECTION,
  },
  LINK_FCH_ONE: {
    title: 'Link your Token Addresses',
    text:
      'You will then be able to receive crypto using a single FIO Crypto Handle instead of multiple complicated public addresses.',
    imageSrc: LocationPinImgSrc,
    actionButtonText: 'Map Now',
    actionButtonLink: ROUTES.ADD_TOKEN,
  },
  LINK_FCH: {
    title: 'Link your Token Addresses',
    text:
      'You will then be able to receive crypto using a single FIO Crypto Handle instead of multiple complicated public addresses.',
    imageSrc: LocationPinImgSrc,
    actionButtonText: 'Map Now',
    actionButtonLink: ROUTES.FIO_ADDRESSES,
  },
  SETUP_PIN: {
    title: 'Set-up PIN',
    text:
      'Setting up your PIN will allow you to quickly sign in as well as confirm certain transaction types easily.',
    imageSrc: PasswordImgSrc,
    actionButtonText: 'Set-up Now',
    actionButtonLink: ROUTES.SETTINGS,
  },
  FIO_BALANCE: {
    title: 'Buy FIO Tokens',
    text:
      'Register handles & domains, pay transaction fees or earn staking rewards.',
    imageSrc: Addbox,
    actionButtonText: 'Buy Now',
    actionButtonLink: ROUTES.FIO_TOKENS_GET,
  },
  GET_CUSTOM_FIO_DOMAIN: {
    title: 'Get a custom FIO Domain',
    text:
      'Personalize your FIO Crypto Handle! Get a FIO Domain, which lets you control who can register handles on it. It’s also an NFT which can be traded on NFT exchanges such as Opensea.',
    imageSrc: GroupImgSrc,
    actionButtonText: 'Buy a Domain',
    actionButtonLink: ROUTES.FIO_DOMAINS_SELECTION,
  },
  STAKING: {
    title: 'Earn Staking Rewards',
    text:
      'Don’t let your FIO Tokens sit idle. Stake them now and start earning rewards from every fee paid on the FIO Chain.',
    actionButtonText: 'Start Earning',
    imageSrc: GrowthImgSrc,
    actionButtonLink: ROUTES.STAKE,
  },
  AFFILIATE: {
    title: 'Share FIO Domains with others and earn FIO Tokens',
    text:
      'Invite friends to FIO Protocol. For every domain registration made through your link, you earn 10% 50% of that purchase value.',
    imageSrc: NetworkImgSrc,
    actionButtonText: 'Sign up Now',
    actionButtonLink: ROUTES.FIO_AFFILIATE_PROGRAM_LANDING,
  },
  GET_ANOTHER_FIO_DOMAIN: {
    title: 'Get another FIO Domain',
    text:
      'You can never have enough. FIO Domain are NFTs which can be traded on NFT exchanges such as Opensea.',
    imageSrc: Addbox,
    actionButtonText: 'Buy a Domain',
    actionButtonLink: ROUTES.FIO_DOMAINS_SELECTION,
  },
  WRAP_DOMAIN: {
    title: 'Wrap your FIO Domain',
    text:
      'FIO Domains can now be wrapped (moved to) Polygon NFT and traded on NFT exchanges such as Opensea.',
    imageSrc: PackageImgSrc,
    actionButtonText: 'Wrap Now',
    actionButtonLink: ROUTES.WRAP_TOKENS,
  },
  OPEN_SEA: {
    title: 'Find great domains on Opensea',
    text:
      'You can find some rare and unique FIO Domains on Opensea NFT Marketplace. Checkout the latest listings.',
    imageSrc: OpenseaImgSrc,
    actionButtonText: 'View Now',
    actionButtonLink: 'https://opensea.io/collection/fio-domains',
    isActionLinkExternal: true,
  },
};