export type FioProxyItem = {
  proxy: string;
  status: number;
  error: string | null;
};

export type SiteSetting = {
  [key: string]: string | FioProxyItem[];
};
