export type PendingVoucher = {
  voucherId: string;
  loginId?: string;
  deviceDescription?: string;
  ipDescription: string;
  created: Date;
  activates: Date;
};

export type NewDeviceVoucher = PendingVoucher & { id: string };
