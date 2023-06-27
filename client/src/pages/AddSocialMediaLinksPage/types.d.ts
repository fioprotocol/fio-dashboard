import { SOCIAL_MEDIA_NAMES } from '../../constants/socialMediaLinks';

type FormValues = {
  [key: typeof SOCIAL_MEDIA_NAMES[keyof typeof SOCIAL_MEDIA_NAMES]]: string;
};
