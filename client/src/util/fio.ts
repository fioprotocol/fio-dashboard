import apis from '../api/index';
import { sleep } from '../utils';

export const waitForAddressRegistered = async (fioAddress: string) => {
  const CALL_INTERVAL = 3000; // 3 sec
  const WAIT_TIMEOUT = 60000; // 60 sec
  const startTime = new Date().getTime();

  const checkAddressIsRegistered: () => Promise<void> = async () => {
    try {
      const { is_registered } = await apis.fio.availCheck(fioAddress);
      if (is_registered) return;
    } catch (e) {
      //
    }
    const timeOver = new Date().getTime() - startTime >= WAIT_TIMEOUT;
    if (timeOver)
      throw new Error(
        'Address is not registered. Try again and if this error occurs again please contact support.',
      );
    await sleep(CALL_INTERVAL);
    return checkAddressIsRegistered();
  };

  return checkAddressIsRegistered();
};
