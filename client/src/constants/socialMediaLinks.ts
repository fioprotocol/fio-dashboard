import DiscordSrc from '../assets/images/social-network-icons-rounded-dark-light/discord.svg';
import FacebookSrc from '../assets/images/social-network-icons-rounded-dark-light/facebook.svg';
import FarcasterSrc from '../assets/images/social-network-icons-rounded-dark-light/farcaster.svg';
import HiveSrc from '../assets/images/social-network-icons-rounded-dark-light/hive.svg';
import IntsagramSrc from '../assets/images/social-network-icons-rounded-dark-light/instagram.svg';
import LinkedinSrc from '../assets/images/social-network-icons-rounded-dark-light/linkedin.svg';
import MastedonSrc from '../assets/images/social-network-icons-rounded-dark-light/mastedon.svg';
import NostrSrc from '../assets/images/social-network-icons-rounded-dark-light/nostr.svg';
import RedditSrc from '../assets/images/social-network-icons-rounded-dark-light/reddit.svg';
import TelegramSrc from '../assets/images/social-network-icons-rounded-dark-light/telegram.svg';
import TwitterSrc from '../assets/images/social-network-icons-rounded-dark-light/twitter.svg';
import WhatsappSrc from '../assets/images/social-network-icons-rounded-dark-light/whatsapp.svg';
import YoutubeSrc from '../assets/images/social-network-icons-rounded-dark-light/youtube.svg';

import DiscordRoundedSrc from '../assets/images/social-network-icons-rounded/discord.svg';
import FacebookRoundedSrc from '../assets/images/social-network-icons-rounded/facebook.svg';
import FarcasterRoundedSrc from '../assets/images/social-network-icons-rounded/farcaster.svg';
import HiveRoundedSrc from '../assets/images/social-network-icons-rounded/hive.svg';
import IntsagramRoundedSrc from '../assets/images/social-network-icons-rounded/instagram.svg';
import LinkedinRoundedSrc from '../assets/images/social-network-icons-rounded/linkedin.svg';
import MastedonRoundedSrc from '../assets/images/social-network-icons-rounded/mastedon.svg';
import NostrRoundedSrc from '../assets/images/social-network-icons-rounded/nostr.svg';
import RedditRoundedSrc from '../assets/images/social-network-icons-rounded/reddit.svg';
import TelegramRoundedSrc from '../assets/images/social-network-icons-rounded/telegram.svg';
import TwitterRoundedSrc from '../assets/images/social-network-icons-rounded/twitter.svg';
import WhatsappRoundedSrc from '../assets/images/social-network-icons-rounded/whatsapp.svg';
import YoutubeRoundedSrc from '../assets/images/social-network-icons-rounded/youtube.svg';

import { SocialMediaLinkItem } from '../types';

export const SOCIAL_MEDIA_IDS = {
  DISCORD: 'DISCORD',
  DISCORDSER: 'DISCORDSER',
  FACEBOOK: 'FACEBOOK',
  FARCASTER: 'FARCASTER',
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
  YOUTUBE: 'YOUTUBE',
} as const;

export const SOCIAL_MEDIA_NAMES = {
  [SOCIAL_MEDIA_IDS.DISCORD]: 'discord',
  [SOCIAL_MEDIA_IDS.DISCORDSER]: 'discord Server',
  [SOCIAL_MEDIA_IDS.FACEBOOK]: 'facebook',
  [SOCIAL_MEDIA_IDS.FARCASTER]: 'farcaster',
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
  [SOCIAL_MEDIA_IDS.YOUTUBE]: 'youtube',
} as const;

export const SOCIAL_MEDIA_LINKS: SocialMediaLinkItem[] = [
  {
    iconSrc: DiscordSrc,
    roundedIconSrc: DiscordRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.DISCORD,
    name: SOCIAL_MEDIA_NAMES.DISCORD,
    link: 'https://discordapp.com/users/',
  },
  {
    iconSrc: DiscordSrc,
    roundedIconSrc: DiscordRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.DISCORDSER,
    name: SOCIAL_MEDIA_NAMES.DISCORDSER,
    link: 'https://discord.gg/',
  },
  {
    iconSrc: FacebookSrc,
    roundedIconSrc: FacebookRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.FACEBOOK,
    name: SOCIAL_MEDIA_NAMES.FACEBOOK,
    link: 'https://facebook.com/',
  },
  {
    iconSrc: FarcasterSrc,
    roundedIconSrc: FarcasterRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.FARCASTER,
    name: SOCIAL_MEDIA_NAMES.FARCASTER,
    link: 'https://warpcast.com/',
  },
  {
    iconSrc: HiveSrc,
    roundedIconSrc: HiveRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.HIVE,
    name: SOCIAL_MEDIA_NAMES.HIVE,
    link: 'https://peakd.com/@',
  },
  {
    iconSrc: IntsagramSrc,
    roundedIconSrc: IntsagramRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.INSTAGRAM,
    name: SOCIAL_MEDIA_NAMES.INSTAGRAM,
    link: 'https://instagram.com/',
  },
  {
    iconSrc: LinkedinSrc,
    roundedIconSrc: LinkedinRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.LINKEDIN,
    name: SOCIAL_MEDIA_NAMES.LINKEDIN,
    link: 'https://www.linkedin.com/in/',
  },
  {
    iconSrc: LinkedinSrc,
    roundedIconSrc: LinkedinRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.LINKEDINCO,
    name: SOCIAL_MEDIA_NAMES.LINKEDINCO,
    link: 'https://www.linkedin.com/company/',
  },
  {
    iconSrc: MastedonSrc,
    roundedIconSrc: MastedonRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.MASTODON,
    name: SOCIAL_MEDIA_NAMES.MASTODON,
    link: 'https://mastodon.social/@',
  },
  {
    iconSrc: NostrSrc,
    roundedIconSrc: NostrRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.NOSTR,
    name: SOCIAL_MEDIA_NAMES.NOSTR,
    link: 'https://iris.to/',
  },
  {
    iconSrc: RedditSrc,
    roundedIconSrc: RedditRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.REDDIT,
    name: SOCIAL_MEDIA_NAMES.REDDIT,
    link: 'https://www.reddit.com/user/',
  },
  {
    iconSrc: TwitterSrc,
    roundedIconSrc: TwitterRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.TWITTER,
    name: SOCIAL_MEDIA_NAMES.TWITTER,
    link: 'https://twitter.com/',
  },
  {
    iconSrc: TelegramSrc,
    roundedIconSrc: TelegramRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.TELEGRAM,
    name: SOCIAL_MEDIA_NAMES.TELEGRAM,
    link: 'https://t.me/',
  },
  {
    iconSrc: WhatsappSrc,
    roundedIconSrc: WhatsappRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.WHATSAPP,
    name: SOCIAL_MEDIA_NAMES.WHATSAPP,
    link: 'https://wa.me/',
  },
  {
    iconSrc: YoutubeSrc,
    roundedIconSrc: YoutubeRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.YOUTUBE,
    name: SOCIAL_MEDIA_NAMES.YOUTUBE,
    link: 'https://www.youtube.com/channel/',
  },
];
