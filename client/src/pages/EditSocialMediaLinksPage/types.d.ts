import { SocialMediaLinkItem } from '../../types';

export type EditSocialLinkItem = {
  isEditing: boolean;
  id: string;
  newUsername: string;
  username: string;
} & SocialMediaLinkItem;

export type EditSocialLinkValues = {
  fch: string;
  socialMediaLinksList: EditSocialLinkItem[];
};
