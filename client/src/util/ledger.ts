import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/lib/fio';
import { Ecc } from '@fioprotocol/fiojs';

const HARDENED = 0x80000000;

export const getPath = (derivationIndex?: number) => {
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
) => {
  const { publicKeyWIF } = await appFio.getPublicKey({
    path: getPath(derivationIndex),
    show_or_not: false,
  });

  return publicKeyWIF;
};

export const formatLedgerSignature = (witnessSignatureHex: string) => {
  return Ecc.Signature.fromHex(witnessSignatureHex).toString();
};
