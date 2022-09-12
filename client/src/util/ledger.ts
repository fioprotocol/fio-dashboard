import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { Ecc } from '@fioprotocol/fiojs';

const HARDENED = 0x80000000;

export const getPath = (derivationIndex?: number): number[] => {
  return [
    44 + HARDENED,
    235 + HARDENED,
    0 + HARDENED,
    0,
    derivationIndex != null ? derivationIndex : 0,
  ];
};

export const getPubKeyFromLedger = async (
  appFio: LedgerFioApp,
  derivationIndex?: number,
): Promise<string> => {
  const { publicKeyWIF } = await appFio.getPublicKey({
    path: getPath(derivationIndex),
    show_or_not: false,
  });

  return publicKeyWIF;
};

export const formatLedgerSignature = (witnessSignatureHex: string): string => {
  return Ecc.Signature.fromHex(witnessSignatureHex).toString();
};
