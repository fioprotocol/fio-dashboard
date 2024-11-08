import { FioAddressDoublet } from '../types';

type LinkItemProps = {
  name: string;
  url: string;
  logo: string;
};

export type CandidateProps = {
  checked?: boolean;
  country: string;
  id: string;
  image: string;
  lastVoteCount: number;
  links: LinkItemProps[];
  name: string;
  status: string;
  text: string;
  url: string;
};

export type JiraCandidates = {
  fields: {
    customfield_10176: string;
    customfield_10177: string;
    customfield_10178: string;
    customfield_10179: string;
    customfield_10180: {
      content: Array<{
        content: {
          text: string;
        }[];
      }>;
    };
    customfield_10181: string;
    customfield_10183: number;
    status: {
      name: string;
    };
    summary: string;
  };
  key: string;
}[];

export type BlockProducersResult = {
  branding: {
    logo_svg?: string;
    logo_256?: string;
  };
  candidate_name: string;
  fio_address: string;
  flagIconUrl: string;
  id: string;
  owner: string;
  score: {
    details: {
      valid_fio_address: {
        status: boolean;
      };
    };
    grade: string;
  };
  socials: {
    telegram?: string;
    twitter?: string;
  };
  total_votes: number;
  url: string;
}[];

export type BlockProducersItemProps = {
  checked?: boolean;
  defaultLogo: string;
  defaultDarkLogo: string;
  fioAddress: string;
  flagIconUrl: string;
  grade: string;
  id: string;
  isTop21: boolean;
  isValidFioHandle: boolean;
  links: LinkItemProps[];
  logo: string;
  name: string;
  owner: string;
  totalVotes: number;
};

export type FioHandleItem = FioAddressDoublet & { id: string };
