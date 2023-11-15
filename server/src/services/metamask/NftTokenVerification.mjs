import Web3 from 'web3';

import logger from '../../logger';
import Base from '../Base';
import X from '../Exception.mjs';
import MathOp from '../math.mjs';
import moralisApi from '../../external/moralis.mjs';

import { Action, GatedRegistrtionTokens, ReferrerProfile } from '../../models';

import { NFT_LABEL, TOKEN_LABEL } from '../../constants/general.mjs';
import { MORALIS_CHAIN_LIST } from '../../constants/moralis-chains.mjs';

const web3 = new Web3();

export default class NftTokenVerification extends Base {
  static get validationRules() {
    return {
      address: ['required', 'string'],
      refId: ['required', 'string'],
      signedMessage: ['required', 'string'],
    };
  }

  async execute({ address, refId, signedMessage }) {
    try {
      let isVerified = null;

      const r = '0x' + signedMessage.slice(2, 66);
      const s = '0x' + signedMessage.slice(66, 130);
      const v = '0x' + signedMessage.slice(130, 132);
      const publicKey = web3.eth.accounts.recover(
        process.env.METAMASK_SIGN_MESSAGE,
        v,
        r,
        s,
      );

      const addressFromSignedMessage = web3.utils.toChecksumAddress(publicKey);

      if (address !== addressFromSignedMessage) {
        throw new X({
          code: 'SERVER_ERROR',
          fields: {
            address: 'WRONG_ADDRESS_AND_SIGN_MESSAGE',
          },
        });
      }

      const refProfile = await ReferrerProfile.findById(refId);

      if (!refProfile) {
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            refProfile: 'NOT_FOUND',
          },
        });
      }

      if (
        refProfile.settings &&
        refProfile.settings.gatedRegistration &&
        refProfile.settings.gatedRegistration.isOn &&
        refProfile.settings.gatedRegistration.params &&
        refProfile.settings.gatedRegistration.params.chainId
      ) {
        const chainId = refProfile.settings.gatedRegistration.params.chainId;

        const chain = MORALIS_CHAIN_LIST.find(
          chainItem => chainItem.chainId.toString() === chainId.toString(),
        );

        const { chainName } = chain || {};

        if (!chainName) {
          throw new X({
            code: 'NOT_FOUND',
            fields: {
              chainName: 'NOT_FOUND',
            },
          });
        }

        const { asset, contractAddress } = refProfile.settings.gatedRegistration.params;

        if (asset === NFT_LABEL && chainId) {
          const nftsList = await moralisApi.getAllWalletNfts({
            address,
            chainName,
          });
          ({ address, chainName });
          isVerified =
            nftsList &&
            nftsList.some(nftItem => nftItem.token_address === contractAddress);
        }

        if (asset === TOKEN_LABEL && chainId) {
          const { jsonResponse: tokensList } =
            (await moralisApi.getAllTokens({
              address,
              chainName,
            })) || {};

          isVerified =
            tokensList &&
            tokensList.some(
              tokenItem =>
                tokenItem.token_address === contractAddress &&
                new MathOp(tokenItem.balance).gt(0),
            );
        }
      } else {
        throw new X({
          code: 'SERVER_ERROR',
          fields: {
            params: 'GATED_REGISTRATION_IS_OFF',
          },
        });
      }

      if (!isVerified) return { data: { isVerified: false } };

      const gatedToken = await Action.generateHash();

      if (!gatedToken) {
        throw new X({
          code: 'SERVER_ERROR',
          fields: {
            token: 'CANNOT_CREATE_TOKEN',
          },
        });
      }

      await GatedRegistrtionTokens.create({ token: gatedToken });

      return {
        data: { token: gatedToken, isVerified: true },
      };
    } catch (e) {
      logger.error(`[Metamask NFT/Token verification] error: ${e}`);
      throw new X({
        code: 'VERIFIACTION_FAILED',
        fields: {
          verification: 'VERIFIACTION_FAILED',
        },
      });
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
