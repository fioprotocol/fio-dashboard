export type SubmitData = {
  action: string;
  account: string;
  data: {
    actor: string;
    producers: string[];
    fio_address: string;
    max_fee: number;
  };
};
