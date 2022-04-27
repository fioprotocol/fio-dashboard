import { MutableRefObject } from 'react';

import apis from '../api';

const RETRY_LOGIN_TIME = 5000;

export type AutoLoginParams = {
  email?: string;
  password?: string;
  voucherId?: string;
};

type AutoLoginProps = {
  voucherId: string;
  timerRef: MutableRefObject<ReturnType<typeof setTimeout>>;
  loginParams: AutoLoginParams;
  login: (params: AutoLoginParams) => void;
  onCloseBlockModal: () => void;
};

const handleAutoLogin = async (props: AutoLoginProps) => {
  const { voucherId, loginParams, login, onCloseBlockModal } = props;
  const voucherCheck = async () => {
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
  const isRejected = await apis.auth.checkRejected(voucherId);

  if (hasReadyVoucher) {
    onCloseBlockModal();

    if (isRejected) return;

    login({ ...loginParams, voucherId });
    return;
  }
  autoLogin(props);
};

export const autoLogin = (params: AutoLoginProps): void => {
  const { timerRef } = params;
  timerRef.current = setTimeout(() => {
    handleAutoLogin({ ...params });
  }, RETRY_LOGIN_TIME);
};
