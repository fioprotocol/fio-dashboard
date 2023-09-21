import DiscordSrc from '../assets/images/social-network-icons-rounded-dark-light/discord.svg';
import FacebookSrc from '../assets/images/social-network-icons-rounded-dark-light/facebook.svg';
import HiveSrc from '../assets/images/social-network-icons-rounded-dark-light/hive.svg';
import IntsagramSrc from '../assets/images/social-network-icons-rounded-dark-light/instagram.svg';
import LinkedinSrc from '../assets/images/social-network-icons-rounded-dark-light/linkedin.svg';
import MastedonSrc from '../assets/images/social-network-icons-rounded-dark-light/mastedon.svg';
import NostrSrc from '../assets/images/social-network-icons-rounded-dark-light/nostr.svg';
import RedditSrc from '../assets/images/social-network-icons-rounded-dark-light/reddit.svg';
import TelegramSrc from '../assets/images/social-network-icons-rounded-dark-light/telegram.svg';
import TwitterSrc from '../assets/images/social-network-icons-rounded-dark-light/twitter.svg';
import WhatsappSrc from '../assets/images/social-network-icons-rounded-dark-light/whatsapp.svg';

import { SocialMediaLinkItem } from '../types';

export const SOCIAL_MEDIA_IDS = {
  DISCORD: 'DISCORD',
  DISCORDSER: 'DISCORDSER',
  FACEBOOK: 'FACEBOOK',
  HIVE: 'HIVE',
  INSTAGRAM: 'INSTAGRAM',
  LINKEDIN: 'LINKEDIN',
  LINKEDINCO: 'LINKEDINCO',
  MASTODON: 'MASTODON',
  NOSTR: 'NOSTR',
  REDDIT: 'REDDIT',
  TELEGRAM: 'TELEGRAM',
  TWITTER: 'TWITTER',
  WHATSAPP: 'WHATSAPP',
} as const;

export const SOCIAL_MEDIA_NAMES = {
  [SOCIAL_MEDIA_IDS.DISCORD]: 'discord',
  [SOCIAL_MEDIA_IDS.DISCORDSER]: 'discord Server',
  [SOCIAL_MEDIA_IDS.FACEBOOK]: 'facebook',
  [SOCIAL_MEDIA_IDS.HIVE]: 'hive',
  [SOCIAL_MEDIA_IDS.INSTAGRAM]: 'instagram',
  [SOCIAL_MEDIA_IDS.LINKEDIN]: 'linkedin',
  [SOCIAL_MEDIA_IDS.LINKEDINCO]: 'linkedin Company',
  [SOCIAL_MEDIA_IDS.MASTODON]: 'mastodon',
  [SOCIAL_MEDIA_IDS.NOSTR]: 'nostr',
  [SOCIAL_MEDIA_IDS.REDDIT]: 'reddit',
  [SOCIAL_MEDIA_IDS.TELEGRAM]: 'telegram',
  [SOCIAL_MEDIA_IDS.TWITTER]: 'twitter',
  [SOCIAL_MEDIA_IDS.WHATSAPP]: 'whatsapp',
} as const;

export const SOCIAL_MEDIA_LINKS: SocialMediaLinkItem[] = [
  {
    iconSrc: DiscordSrc,
    tokenName: SOCIAL_MEDIA_IDS.DISCORD,
    name: SOCIAL_MEDIA_NAMES.DISCORD,
    link: 'https://discordapp.com/users/',
  },
  {
    iconSrc: DiscordSrc,
    tokenName: SOCIAL_MEDIA_IDS.DISCORDSER,
    name: SOCIAL_MEDIA_NAMES.DISCORDSER,
    link: 'https://discord.gg/',
  },
  {
    iconSrc: FacebookSrc,
    tokenName: SOCIAL_MEDIA_IDS.FACEBOOK,
    name: SOCIAL_MEDIA_NAMES.FACEBOOK,
    link: 'https://facebook.com/',
  },
  {
    iconSrc: HiveSrc,
    tokenName: SOCIAL_MEDIA_IDS.HIVE,
    name: SOCIAL_MEDIA_NAMES.HIVE,
    link: 'https://peakd.com/@',
  },
  {
    iconSrc: IntsagramSrc,
    tokenName: SOCIAL_MEDIA_IDS.INSTAGRAM,
    name: SOCIAL_MEDIA_NAMES.INSTAGRAM,
    link: 'https://instagram.com/',
  },
  {
    iconSrc: LinkedinSrc,
    tokenName: SOCIAL_MEDIA_IDS.LINKEDIN,
    name: SOCIAL_MEDIA_NAMES.LINKEDIN,
    link: 'https://www.linkedin.com/in/',
  },
  {
    iconSrc: LinkedinSrc,
    tokenName: SOCIAL_MEDIA_IDS.LINKEDINCO,
    name: SOCIAL_MEDIA_NAMES.LINKEDINCO,
    link: 'https://www.linkedin.com/company/',
  },
  {
    iconSrc: MastedonSrc,
    tokenName: SOCIAL_MEDIA_IDS.MASTODON,
    name: SOCIAL_MEDIA_NAMES.MASTODON,
    link: 'https://mastodon.social/@',
  },
  {
    iconSrc: NostrSrc,
    tokenName: SOCIAL_MEDIA_IDS.NOSTR,
    name: SOCIAL_MEDIA_NAMES.NOSTR,
    link: 'https://iris.to/',
  },
  {
    iconSrc: RedditSrc,
    tokenName: SOCIAL_MEDIA_IDS.REDDIT,
    name: SOCIAL_MEDIA_NAMES.REDDIT,
    link: 'https://www.reddit.com/user/',
  },
  {
    iconSrc: TwitterSrc,
    tokenName: SOCIAL_MEDIA_IDS.TWITTER,
    name: SOCIAL_MEDIA_NAMES.TWITTER,
    link: 'https://twitter.com/',
  },
  {
    iconSrc: TelegramSrc,
    tokenName: SOCIAL_MEDIA_IDS.TELEGRAM,
    name: SOCIAL_MEDIA_NAMES.TELEGRAM,
    link: 'https://t.me/',
  },
  {
    iconSrc: WhatsappSrc,
    tokenName: SOCIAL_MEDIA_IDS.WHATSAPP,
    name: SOCIAL_MEDIA_NAMES.WHATSAPP,
    link: 'https://wa.me/',
  },
];
