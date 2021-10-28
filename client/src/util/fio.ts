import apis from '../api/index';
import { sleep } from '../utils';

import { NftTokenResponse } from '../types';

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

export const transformNft = (nfts: NftTokenResponse[]) => {
  const nftList = [];
  for (const item of nfts) {
    const nftItem = {
      fioAddress: item.fio_address,
      contractAddress: item.contract_address,
      chainCode: item.chain_code,
      tokenId: item.token_id,
      url: item.url,
      hash: item.hash,
      metadata: item.metadata,
    };
    nftList.push(nftItem);
  }
  return nftList;
};
