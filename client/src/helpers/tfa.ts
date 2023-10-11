import speakeasy, { GeneratedSecret } from 'speakeasy';
import { toDataURL } from 'qrcode';
import { jsPDF } from 'jspdf';

export const TFA_PREFIX_NAME = 'FIO App administration';

class TFA {
  createSecret(name?: string): GeneratedSecret {
    return speakeasy.generateSecret({
      name: name || TFA_PREFIX_NAME,
    });
  }

  async generateSrcImageDataFromSecretOtpauthUrl(otpauthUrl: string) {
    return toDataURL(otpauthUrl);
  }

  // could be used in case we need to download recovery file through admin profile page
  generateOtpauthUrlFromSecret(secretKey: string, name: string) {
    return speakeasy.otpauthURL({
      secret: secretKey,
      label: name || TFA_PREFIX_NAME,
      encoding: 'base32',
    });
  }

  async downloadSecretQr(secretQrPng: string) {
    const doc = new jsPDF();
    doc.addImage(secretQrPng, 'PNG', 15, 8, 100, 100);
    doc.save('FIO-App-admin-2fa-secret.pdf');
  }
}

export default new TFA();
