import { SocialMediaLinkItem } from '../../constants/socialMediaLinks';

export type EditSocialLinkItem = {
  isEditing: boolean;
  id: string;
  newUsername: string;
  username: string;
} & SocialMediaLinkItem;
