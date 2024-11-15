export type SubmitData = {
  action: string;
  account: string;
  data: {
    actor: string;
    fio_address: string;
    max_fee: number;
    proxy: string;
  };
};
