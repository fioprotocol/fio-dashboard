export type NFTSignature = {
  chainCode: string;
  tokenId: string;
  contractAddress: string;
};

export type ReduxState = ReturnType<typeof store.getState>;
