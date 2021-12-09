import apis from '../api';

const RETRY_LOGIN_TIME = 5000;

type LoginProps = {
  voucherId: string;
  timerRef: any;
  loginParams: {
    email: string;
    password: string;
    voucherId?: string;
    options?: { otpKey?: string };
  };
  login: (params: {
    email: string;
    password: string;
    voucherId?: string;
    options?: { otpKey?: string };
  }) => void;
};

const handleAutoLogin = async ({
  voucherId,
  timerRef,
  loginParams,
  login,
}: LoginProps) => {
  const voucherCheck = async () => {
    if (voucherId == null) return false;

    const messages = await apis.edge.loginMessages();
    for (const username of Object.keys(messages)) {
      const { pendingVouchers } = messages[username];
      for (const voucher of pendingVouchers) {
        if (voucher.voucherId === voucherId) return false;
      }
    }
    return true;
  };
  const hasReadyVoucher = await voucherCheck();

  if (hasReadyVoucher) {
    login({ ...loginParams, voucherId });
    return;
  }
  autoLogin({ voucherId, timerRef, loginParams, login });
};

export const autoLogin = (params: LoginProps) => {
  const { timerRef } = params;
  timerRef.current = setTimeout(
    () => handleAutoLogin({ ...params }),
    RETRY_LOGIN_TIME,
  );
};
