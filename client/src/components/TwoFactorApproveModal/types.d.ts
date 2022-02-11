export type PendingVoucher = {
  voucherId: string;
  loginId?: string;
  deviceDescription?: string;
  ipDescription: string;
  created: Date;
  activates: Date;
};
