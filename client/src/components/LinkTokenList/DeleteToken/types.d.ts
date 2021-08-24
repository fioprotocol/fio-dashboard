import { PublicAddressDoublet } from '../../../types';

export type CheckedTokenType = {
  isChecked: boolean;
  id: string;
} & PublicAddressDoublet;
