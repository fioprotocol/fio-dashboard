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

export const SOCIAL_MEDIA_NAMES = {
  DISCORD: 'discord',
  DISCORDSERVER: 'discord Server',
  FACEBOOK: 'facebook',
  HIVE: 'hive',
  INSTAGRAM: 'instagram',
  LINKEDIN: 'linkedin',
  LINKEDINCOMPANY: 'linkedin company',
  MASTODON: 'mastodon',
  NOSTR: 'nostr',
  REDDIT: 'reddit',
  TELEGRAM: 'telegram',
  TWITTER: 'twitter',
  WHATSAPP: 'whatsapp',
} as const;

export const SOCIAL_MEDIA_LINKS: SocialMediaLinkItem[] = [
  {
    iconSrc: DiscordSrc,
    name: SOCIAL_MEDIA_NAMES.DISCORD,
    link: 'https://discordapp.com/users/',
  },
  {
    iconSrc: DiscordSrc,
    name: SOCIAL_MEDIA_NAMES.DISCORDSERVER,
    link: 'https://discord.gg/',
  },
  {
    iconSrc: FacebookSrc,
    name: SOCIAL_MEDIA_NAMES.FACEBOOK,
    link: 'https://facebook.com/',
  },
  {
    iconSrc: HiveSrc,
    name: SOCIAL_MEDIA_NAMES.HIVE,
    link: 'https://peakd.com/@',
  },
  {
    iconSrc: IntsagramSrc,
    name: SOCIAL_MEDIA_NAMES.INSTAGRAM,
    link: 'https://instagram.com/',
  },
  {
    iconSrc: LinkedinSrc,
    name: SOCIAL_MEDIA_NAMES.LINKEDIN,
    link: 'https://www.linkedin.com/in/',
  },
  {
    iconSrc: LinkedinSrc,
    name: SOCIAL_MEDIA_NAMES.LINKEDINCOMPANY,
    link: 'https://www.linkedin.com/company/',
  },
  {
    iconSrc: MastedonSrc,
    name: SOCIAL_MEDIA_NAMES.MASTODON,
    link: 'https://mastodon.social/@',
  },
  {
    iconSrc: NostrSrc,
    name: SOCIAL_MEDIA_NAMES.NOSTR,
    link: 'https://iris.to/',
  },
  {
    iconSrc: RedditSrc,
    name: SOCIAL_MEDIA_NAMES.REDDIT,
    link: 'https://www.reddit.com/user/',
  },
  {
    iconSrc: TwitterSrc,
    name: SOCIAL_MEDIA_NAMES.TWITTER,
    link: 'https://twitter.com/',
  },
  {
    iconSrc: TelegramSrc,
    name: SOCIAL_MEDIA_NAMES.TELEGRAM,
    link: 'https://t.me/',
  },
  {
    iconSrc: WhatsappSrc,
    name: SOCIAL_MEDIA_NAMES.WHATSAPP,
    link: 'https://wa.me/',
  },
];
