export const nftId = (
  chainCode: string,
  tokenId: string,
  contractAddress: string,
) => `${chainCode}-${tokenId}-${contractAddress}`;
