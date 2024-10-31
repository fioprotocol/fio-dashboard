export type CandidateProps = {
  checked?: boolean;
  country: string;
  id: string;
  image: string;
  lastVoutCount: number;
  links: Array<{ name: string; url: string }>;
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
