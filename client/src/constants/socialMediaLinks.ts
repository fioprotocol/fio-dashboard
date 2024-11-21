import DiscordSrc from '../assets/images/social-network-icons-rounded-dark-light/discord.svg';
import FacebookSrc from '../assets/images/social-network-icons-rounded-dark-light/facebook.svg';
import FarcasterSrc from '../assets/images/social-network-icons-rounded-dark-light/farcaster.svg';
import HiveSrc from '../assets/images/social-network-icons-rounded-dark-light/hive.svg';
import IntsagramSrc from '../assets/images/social-network-icons-rounded-dark-light/instagram.svg';
import LinkedinSrc from '../assets/images/social-network-icons-rounded-dark-light/linkedin.svg';
import MastodonSrc from '../assets/images/social-network-icons-rounded-dark-light/mastodon.svg';
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
import MastodonRoundedSrc from '../assets/images/social-network-icons-rounded/mastodon.svg';
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

export const SOCIAL_MEDIA_URLS = {
  [SOCIAL_MEDIA_IDS.DISCORD]: 'https://discordapp.com/users/',
  [SOCIAL_MEDIA_IDS.DISCORDSER]: 'https://discord.gg/',
  [SOCIAL_MEDIA_IDS.FACEBOOK]: 'https://facebook.com/',
  [SOCIAL_MEDIA_IDS.FARCASTER]: 'https://warpcast.com/',
  [SOCIAL_MEDIA_IDS.HIVE]: 'https://peakd.com/@',
  [SOCIAL_MEDIA_IDS.INSTAGRAM]: 'https://instagram.com/',
  [SOCIAL_MEDIA_IDS.LINKEDIN]: 'https://www.linkedin.com/in/',
  [SOCIAL_MEDIA_IDS.LINKEDINCO]: 'https://www.linkedin.com/company/',
  [SOCIAL_MEDIA_IDS.MASTODON]: 'https://mastodon.social/@',
  [SOCIAL_MEDIA_IDS.NOSTR]: 'https://iris.to/',
  [SOCIAL_MEDIA_IDS.REDDIT]: 'https://www.reddit.com/user/',
  [SOCIAL_MEDIA_IDS.TWITTER]: 'https://twitter.com/',
  [SOCIAL_MEDIA_IDS.TELEGRAM]: 'https://t.me/',
  [SOCIAL_MEDIA_IDS.WHATSAPP]: 'https://wa.me/',
  [SOCIAL_MEDIA_IDS.YOUTUBE]: 'https://www.youtube.com/@',
};

export const SOCIAL_MEDIA_LINKS: SocialMediaLinkItem[] = [
  {
    iconSrc: DiscordSrc,
    roundedIconSrc: DiscordRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.DISCORD,
    name: SOCIAL_MEDIA_NAMES.DISCORD,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.DISCORD],
  },
  {
    iconSrc: DiscordSrc,
    roundedIconSrc: DiscordRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.DISCORDSER,
    name: SOCIAL_MEDIA_NAMES.DISCORDSER,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.DISCORDSER],
  },
  {
    iconSrc: FacebookSrc,
    roundedIconSrc: FacebookRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.FACEBOOK,
    name: SOCIAL_MEDIA_NAMES.FACEBOOK,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.FACEBOOK],
  },
  {
    iconSrc: FarcasterSrc,
    roundedIconSrc: FarcasterRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.FARCASTER,
    name: SOCIAL_MEDIA_NAMES.FARCASTER,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.FARCASTER],
  },
  {
    iconSrc: HiveSrc,
    roundedIconSrc: HiveRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.HIVE,
    name: SOCIAL_MEDIA_NAMES.HIVE,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.HIVE],
  },
  {
    iconSrc: IntsagramSrc,
    roundedIconSrc: IntsagramRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.INSTAGRAM,
    name: SOCIAL_MEDIA_NAMES.INSTAGRAM,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.INSTAGRAM],
  },
  {
    iconSrc: LinkedinSrc,
    roundedIconSrc: LinkedinRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.LINKEDIN,
    name: SOCIAL_MEDIA_NAMES.LINKEDIN,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.LINKEDIN],
  },
  {
    iconSrc: LinkedinSrc,
    roundedIconSrc: LinkedinRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.LINKEDINCO,
    name: SOCIAL_MEDIA_NAMES.LINKEDINCO,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.LINKEDINCO],
  },
  {
    iconSrc: MastodonSrc,
    roundedIconSrc: MastodonRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.MASTODON,
    name: SOCIAL_MEDIA_NAMES.MASTODON,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.MASTODON],
  },
  {
    iconSrc: NostrSrc,
    roundedIconSrc: NostrRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.NOSTR,
    name: SOCIAL_MEDIA_NAMES.NOSTR,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.NOSTR],
  },
  {
    iconSrc: RedditSrc,
    roundedIconSrc: RedditRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.REDDIT,
    name: SOCIAL_MEDIA_NAMES.REDDIT,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.REDDIT],
  },
  {
    iconSrc: TwitterSrc,
    roundedIconSrc: TwitterRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.TWITTER,
    name: SOCIAL_MEDIA_NAMES.TWITTER,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.TWITTER],
  },
  {
    iconSrc: TelegramSrc,
    roundedIconSrc: TelegramRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.TELEGRAM,
    name: SOCIAL_MEDIA_NAMES.TELEGRAM,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.TELEGRAM],
  },
  {
    iconSrc: WhatsappSrc,
    roundedIconSrc: WhatsappRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.WHATSAPP,
    name: SOCIAL_MEDIA_NAMES.WHATSAPP,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.WHATSAPP],
  },
  {
    iconSrc: YoutubeSrc,
    roundedIconSrc: YoutubeRoundedSrc,
    tokenName: SOCIAL_MEDIA_IDS.YOUTUBE,
    name: SOCIAL_MEDIA_NAMES.YOUTUBE,
    link: SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.YOUTUBE],
  },
];
