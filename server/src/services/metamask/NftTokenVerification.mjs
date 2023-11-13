import logger from '../../logger';
import Base from '../Base';
import X from '../Exception.mjs';
import MathOp from '../math.mjs';
import moralisApi from '../../external/moralis.mjs';

import { Action, GatedRegistrtionTokens, ReferrerProfile } from '../../models';

import { NFT_LABEL, TOKEN_LABEL } from '../../constants/general.mjs';
import { MORALIS_CHAIN_LIST } from '../../constants/moralis-chains.mjs';

export default class NftTokenVerification extends Base {
  static get validationRules() {
    return {
      address: ['required', 'string'],
      chainId: ['required', 'string'],
      refId: ['required', 'string'],
    };
  }

  async execute({ address, chainId, refId }) {
    try {
      let isVerified = null;

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
        refProfile.settings.gatedRegistration.params
      ) {
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
          const nftsList = await moralisApi.getAllTokens({
            address,
            chainName,
          });
          ({ address, chainName });
          isVerified = nftsList.some(
            nftItem => nftItem.token_address === contractAddress,
          );
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
