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

type SocialMediaLinkItem = {
  iconSrc: string;
  name: string;
  link: string;
};

export const SOCIAL_MEDIA_LINKS: SocialMediaLinkItem[] = [
  {
    iconSrc: DiscordSrc,
    name: 'discord',
    link: 'https://discordapp.com/users/',
  },
  {
    iconSrc: FacebookSrc,
    name: 'facebook',
    link: 'https://facebook.com/',
  },
  {
    iconSrc: HiveSrc,
    name: 'hive',
    link: 'https://peakd.com/@',
  },
  {
    iconSrc: IntsagramSrc,
    name: 'instagram',
    link: 'https://instagram.com/',
  },
  {
    iconSrc: LinkedinSrc,
    name: 'linkedin',
    link: 'https://www.linkedin.com/in/',
  },
  {
    iconSrc: MastedonSrc,
    name: 'mastodon',
    link: 'https://mastodon.social/@',
  },
  {
    iconSrc: NostrSrc,
    name: 'nostr',
    link: 'https://iris.to/',
  },
  {
    iconSrc: RedditSrc,
    name: 'reddit',
    link: 'https://www.reddit.com/user',
  },
  {
    iconSrc: TwitterSrc,
    name: 'twitter',
    link: 'https://twitter.com/',
  },
  {
    iconSrc: TelegramSrc,
    name: 'telegram',
    link: 'https://t.me/',
  },
  {
    iconSrc: WhatsappSrc,
    name: 'whatsapp',
    link: 'https://wa.me/',
  },
];
