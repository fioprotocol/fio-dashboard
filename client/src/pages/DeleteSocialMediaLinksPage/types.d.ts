import { PublicAddressDoublet } from '../../types';

export type CheckedSocialMediaLinkType = {
  isChecked: boolean;
  id: string;
  link: string;
  iconSrc: string;
  name: string;
} & PublicAddressDoublet;

export type DeleteSocialMediaLinkValues = {
  fch: string;
  socialMediaLinksList: CheckedSocialMediaLinkType[];
};
