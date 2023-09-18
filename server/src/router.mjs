import fs from 'fs';

import express from 'express';
import superagent from 'superagent';

import { createProxyMiddleware } from 'http-proxy-middleware';

import routes from './routes';

const router = express.Router();

const checkAuth = routes.auth.check;
const checkAuthOptional = routes.auth.checkOptional;
const checkAdminAuth = routes.auth.checkAdminAuth;
const checkSimpleAuth = routes.auth.checkSimple;

router.get('/ping', routes.general.healthCheck);

router.post('/auth', routes.auth.create);
router.get('/auth/nonce', routes.auth.nonce);
router.get('/auth/username/:email', routes.auth.username);
router.post('/auth/new-device-two-factor', routes.newDeviceTwoFactor.create);
router.put(
  '/auth/new-device-two-factor/update/:id',
  checkAuth,
  routes.newDeviceTwoFactor.update,
);
router.delete('/auth/new-device-two-factor', checkAuth, routes.newDeviceTwoFactor.delete);
router.get(
  '/auth/new-device-two-factor/check-rejected',
  routes.newDeviceTwoFactor.checkRejected,
);
router.post('/admin-auth', routes.auth.adminLogin);
router.post('/admin-auth/create', routes.auth.adminCreate);
router.get('/admin-auth/create/check', routes.auth.adminCreateCheck);
router.post('/admin-auth/reset-password', routes.auth.adminResetPassword);
router.get('/admin-auth/reset-password/check', routes.auth.adminResetPasswordCheck);

router.post('/actions/:hash', routes.actions.submit);

router.get('/users/available/:email', routes.users.available);
router.get('/users/me', checkAuth, routes.users.info);
router.delete('/users/me', checkAuth, routes.users.delete);
router.get('/users/:id', checkAdminAuth, routes.users.show);
router.post('/users', routes.users.create);
router.put('/users', checkAuth, routes.users.update);
router.post('/users/setRecovery', checkAuth, routes.users.setRecovery);
router.post('/users/resendRecovery', checkAuth, routes.users.resendRecovery);
router.post('/users/update-email', checkAuth, routes.users.updateEmail);
router.put(
  '/users/update-email-notification-params',
  checkAuth,
  routes.users.updateEmailNotificationParams,
);
router.post('/users/affiliate', checkAuth, routes.users.activateAffiliate);
router.patch('/users/affiliate', checkAuth, routes.users.updateAffiliate);
router.post('/users/sendEvent', checkAuthOptional, routes.users.sendEvent);

router.get('/admin/me', checkAdminAuth, routes.adminUsers.personalInfo);
router.get('/admin/list', checkAdminAuth, routes.adminUsers.adminsList);
router.get('/admin/info/:id', checkAdminAuth, routes.adminUsers.adminUserInfo);
router.put('/admin', checkAdminAuth, routes.adminUsers.update);
router.delete('/admin', checkAdminAuth, routes.adminUsers.remove);
router.post(
  '/admin/:id/send-reset-password',
  checkAdminAuth,
  routes.adminUsers.sendResetPassword,
);
router.put('/admin/change-passowrd', checkAdminAuth, routes.adminUsers.changePassword);
router.put('/admin/change-two-fa', checkAdminAuth, routes.adminUsers.change2FA);

router.post('/admin/invite', checkAdminAuth, routes.adminUsers.invite);
router.get('/admin/roles', checkAdminAuth, routes.adminUsers.rolesList);
router.get('/admin/statuses', checkAdminAuth, routes.adminUsers.statusesList);

router.get('/admin/orders', checkAdminAuth, routes.adminUsers.ordersList);
router.get('/admin/orders/export', checkAdminAuth, routes.adminUsers.exportOrdersData);
router.get('/admin/orders/:id', checkAdminAuth, routes.adminUsers.order);

router.get('/admin/users/list', checkAdminAuth, routes.adminUsers.regularUsersList);
router.get('/admin/users/:id', checkAdminAuth, routes.adminUsers.regularUserInfo);

router.get(
  '/admin/accounts/list',
  checkAdminAuth,
  routes.adminUsers.fioAccountsProfilesList,
);
router.post('/admin/accounts', checkAdminAuth, routes.adminUsers.createFioAccountProfile);
router.post(
  '/admin/accounts/:id',
  checkAdminAuth,
  routes.adminUsers.updateFioAccountProfile,
);
router.delete(
  '/admin/accounts/:id',
  checkAdminAuth,
  routes.adminUsers.deleteFioAccountProfile,
);

router.get('/admin/api-urls', checkAdminAuth, routes.adminUsers.fioApiUrlsList);
router.post('/admin/api-urls', checkAdminAuth, routes.adminUsers.createFioApiUrlsList);
router.patch('/admin/api-urls/:id', checkAdminAuth, routes.adminUsers.updateFioApiUrl);
router.delete(
  '/admin/api-urls/:id',
  checkAdminAuth,
  routes.adminUsers.deleteFioApiUrlsList,
);
router.put(
  '/admin/api-urls/list-update',
  checkAdminAuth,
  routes.adminUsers.updateFioApiUrlsList,
);

router.get('/admin/partners/list', checkAdminAuth, routes.adminUsers.partnersList);
router.post('/admin/partners', checkAdminAuth, routes.adminUsers.createPartner);
router.post('/admin/partners/:id', checkAdminAuth, routes.adminUsers.updatePartner);

router.get('/admin/search', checkAdminAuth, routes.adminUsers.search);

router.get('/admin/reg-users', checkAdminAuth, routes.users.list);
router.get('/admin/reg-users/:id', checkAdminAuth, routes.users.detailedInfo);

router.get('/admin/defaults', checkAdminAuth, routes.adminUsers.getDefaults);
router.post('/admin/defaults', checkAdminAuth, routes.adminUsers.saveDefaults);

router.get('/notifications', checkAuth, routes.notifications.list);
router.post('/notifications', checkAuth, routes.notifications.create);
router.put('/notifications', checkAuth, routes.notifications.update);

router.get('/reg/domains/list', routes.registration.domainsList);
router.get('/reg/domain-prefix-postfix', routes.registration.prefixPostfixList);
router.get('/reg/prices', routes.external.prices);
router.post('/reg/captcha/init', checkAuth, routes.external.initCaptcha);
router.get('/reg/api-urls', routes.external.apiUrls);

router.get('/account/wallets', checkAuth, routes.account.walletsList);
router.post('/account/wallets', checkAuth, routes.account.setWallets);
router.post('/account/wallet', checkAuth, routes.account.addWallet);
router.post('/account/wallet/update/:publicKey', checkAuth, routes.account.editWallet);
router.delete('/account/wallet/:publicKey', checkAuth, routes.account.deleteWallet);
router.post(
  '/account/wallet/import/validate/:publicKey',
  checkAuth,
  routes.account.importValidateWallet,
);

router.get('/ref-profile/:code?', routes.refProfiles.info);

router.post('/fio-api/chain/get_table_rows', async (req, res) => {
  const sReq = superagent.post(`${process.env.FIO_BASE_URL}chain/get_table_rows`);

  sReq.send(req.body);

  const result = await sReq.then(res => {
    if (!res.status) throw res.body.error;
    return res.body;
  });

  return res.status(200).send(result);
});

router.use(
  '/fio-api/chain/:url',
  createProxyMiddleware({
    target: process.env.FIO_BASE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/api/v1/fio-api`]: '',
    },
  }),
);

router.use(
  '/mumbai-api',
  createProxyMiddleware({
    target: 'https://mumbai.polygonscan.com/',
    changeOrigin: true,
    pathRewrite: {
      [`^/api/v1/mumbai-api`]: '',
    },
  }),
);

router.post('/contacts', checkAuth, routes.contacts.create);
router.get('/contacts', checkAuth, routes.contacts.list);

router.get('/check-pub-address', checkAuth, routes.external.validatePubAddress);

router.get('/orders', checkAuth, routes.orders.list);
router.get('/orders/active', checkAuth, routes.orders.getActive);
router.post('/orders', checkAuth, routes.orders.create);
router.post('/orders/update/:id', checkAuth, routes.orders.update);
router.get('/orders/item/:id', checkAuth, routes.orders.get);

router.post('/payments', checkAuth, routes.payments.create);
router.post('/payments/webhook/', routes.payments.webhook);
router.post('/payments/cancel', checkAuth, routes.payments.cancel);

router.get('/chain-codes/:chainCode?', routes.chainCodes.list);
router.get('/selected-chain-codes', routes.chainCodes.selectedList);

router.post('/generate-pdf', checkAuth, routes.generatePdf.create);

router.post('/verify-twitter', routes.twitter.verify);
router.get('/verify-abstract-email', routes.external.abstractEmailVerification);

router.get('/wrap-status/tokens/wrap', routes.history.wrapTokens);
router.get('/wrap-status/domains/wrap', routes.history.wrapDomains);
router.get('/wrap-status/tokens/unwrap', routes.history.unwrapTokens);
router.get('/wrap-status/domains/unwrap', routes.history.unwrapDomains);

router.get('/fio-nfts', routes.external.getFioNfts);
router.get('/infura-nfts-metadata', routes.external.infuraNftsMetadata);

router.get('/fetch-image-hash', routes.general.imageToHash);

router.post('/domains-watchlist', checkAuth, routes.domainsWatchlist.create);
router.delete('/domains-watchlist', checkAuth, routes.domainsWatchlist.delete);
router.get('/domains-watchlist', checkAuth, routes.domainsWatchlist.list);

router.get('/vars/:key', routes.vars.get);
router.post('/vars/update/:key', routes.vars.update);
router.post(
  '/vars/update_email/:type/:password',
  checkSimpleAuth,
  routes.vars.updateEmail,
);

let WRAPPED_DOMAIN_ABI;
let WRAPPED_TOKEN_ABI;
try {
  WRAPPED_DOMAIN_ABI = JSON.parse(
    fs.readFileSync('server/static-files/abi_fio_domain_nft.json', 'utf8'), // readFileSync used because require is not working in .mjs files
  );
  WRAPPED_TOKEN_ABI = JSON.parse(
    fs.readFileSync('server/static-files/abi_fio_token.json', 'utf8'),
  );
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('No ABI for wrapped FIO was found! Please check "/server/static-files/"');
}
router.get('/abi_fio_domain_nft', (req, res) =>
  res.send({ data: WRAPPED_DOMAIN_ABI, status: WRAPPED_DOMAIN_ABI ? 1 : 0 }),
);
router.get('/abi_fio_token', (req, res) =>
  res.send({ data: WRAPPED_TOKEN_ABI, status: WRAPPED_TOKEN_ABI ? 1 : 0 }),
);

export default router;
