import { SocialMediaLinkIdProp } from '../../types';

export type FormValues = Record<SocialMediaLinkIdProp, string>;

export type AddSocialMediaLinkValues = {
  fch: string;
  socialMediaLinksList: FormValues;
};
