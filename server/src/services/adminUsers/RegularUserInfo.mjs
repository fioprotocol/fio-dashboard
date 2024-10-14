// import Base from '../Base';
// import X from '../Exception';
//
// import { User } from '../../models';
// import { ADMIN_ROLES_IDS } from '../../config/constants.js';
//
// export default class RegularUserInfo extends Base {
//   static get requiredPermissions() {
//     return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
//   }
//
//   static get validationRules() {
//     return {
//       id: ['required'],
//     };
//   }
//
//   async execute({ id }) {
//     const user = await User.info(id);
//
//     if (!user) {
//       throw new X({
//         code: 'NOT_FOUND',
//         fields: {
//           id: 'NOT_FOUND',
//         },
//       });
//     }
//
//     return {
//       data: user.json(),
//     };
//   }
//
//   static get paramsSecret() {
//     return [];
//   }
//
//   static get resultSecret() {
//     return ['data.email', 'data.location'];
//   }
// }
