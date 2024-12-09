import fs from 'fs';

import express from 'express';
import superagent from 'superagent';

import routes from './routes';

const router = express.Router();

const checkUserAuth = routes.auth.checkUser;
const checkUserOptionalAuth = routes.auth.checkUserOptional;
const checkGuestOptionalAuth = routes.auth.checkGuestOptional;
const checkUserOrGuestOptionalAuth = routes.auth.checkUserOrGuestOptional;
const checkGuestOrUserAuth = routes.auth.checkUserOrGuest;
const checkAdminAuth = routes.auth.checkAdmin;
const checkSimpleAuth = routes.auth.checkSimple;

router.get('/ping', routes.general.healthCheck);

router.post('/auth', checkGuestOptionalAuth, routes.auth.create);
router.get('/auth/nonce', routes.auth.nonce);
router.get('/auth/generate-nonce', routes.auth.generateNonce);
router.get('/auth/username/:email', routes.auth.username);
router.post('/auth/new-device-two-factor', routes.newDeviceTwoFactor.create);
router.put(
  '/auth/new-device-two-factor/update/:id',
  checkUserAuth,
  routes.newDeviceTwoFactor.update,
);
router.delete(
  '/auth/new-device-two-factor',
  checkUserAuth,
  routes.newDeviceTwoFactor.delete,
);
router.get(
  '/auth/new-device-two-factor/check-rejected',
  routes.newDeviceTwoFactor.checkRejected,
);
router.post('/alternate-auth', checkGuestOptionalAuth, routes.auth.alternateAuth);
router.post('/guest-auth', checkGuestOptionalAuth, routes.auth.guestAuth);
router.post('/admin-auth', routes.auth.adminLogin);
router.post('/admin-auth/create', routes.auth.adminCreate);
router.get('/admin-auth/create/check', routes.auth.adminCreateCheck);
router.post('/admin-auth/reset-password', routes.auth.adminResetPassword);
router.get('/admin-auth/reset-password/check', routes.auth.adminResetPasswordCheck);

router.get('/users/me', checkUserAuth, routes.users.info);
router.delete('/users/me', checkUserAuth, routes.users.delete);
router.get('/users/:id', checkAdminAuth, routes.users.show);
router.post('/users', routes.users.create);
router.post('/users/setRecovery', checkUserAuth, routes.users.setRecovery);
router.post('/users/resendRecovery', checkUserAuth, routes.users.resendRecovery);
router.post('/users/update-email', checkUserAuth, routes.users.updateEmail);
router.put(
  '/users/update-email-notification-params',
  checkUserAuth,
  routes.users.updateEmailNotificationParams,
);
router.post('/users/affiliate', checkUserAuth, routes.users.activateAffiliate);
router.patch('/users/affiliate', checkUserAuth, routes.users.updateAffiliate);
router.post('/users/sendEvent', checkUserOptionalAuth, routes.users.sendEvent);

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
router.put('/admin/change-password', checkAdminAuth, routes.adminUsers.changePassword);
router.put('/admin/change-two-fa', checkAdminAuth, routes.adminUsers.change2FA);

router.post('/admin/invite', checkAdminAuth, routes.adminUsers.invite);
router.get('/admin/roles', checkAdminAuth, routes.adminUsers.rolesList);
router.get('/admin/statuses', checkAdminAuth, routes.adminUsers.statusesList);

router.get('/admin/orders', checkAdminAuth, routes.adminUsers.ordersList);
router.get('/admin/orders/export', checkAdminAuth, routes.adminUsers.exportOrdersData);
router.get('/admin/orders/:id', checkAdminAuth, routes.adminUsers.order);

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
router.get(
  '/admin/partners/api-token',
  checkAdminAuth,
  routes.adminUsers.createPartnerApiToken,
);
router.post('/admin/partners', checkAdminAuth, routes.adminUsers.createPartner);
router.post('/admin/partners/:id', checkAdminAuth, routes.adminUsers.updatePartner);

router.get('/admin/search', checkAdminAuth, routes.adminUsers.search);

router.get('/admin/reg-users', checkAdminAuth, routes.users.list);
router.get('/admin/reg-users/:id', checkAdminAuth, routes.users.detailedInfo);

router.get('/admin/defaults', checkAdminAuth, routes.adminUsers.getDefaults);
router.post('/admin/defaults', checkAdminAuth, routes.adminUsers.saveDefaults);

router.post('/admin/vars/update/:key', checkAdminAuth, routes.vars.update);
router.post(
  '/vars/update_email/:type/:password',
  checkSimpleAuth,
  routes.vars.updateEmail,
);
router.get('/vars/:key', routes.vars.get);

router.get('/notifications', checkUserAuth, routes.notifications.list);
router.post('/notifications', checkUserAuth, routes.notifications.create);
router.put('/notifications', checkUserAuth, routes.notifications.update);

router.get('/reg/domains/list', routes.registration.domainsList);
router.get('/reg/domain-prefix-postfix', routes.registration.prefixPostfixList);
router.get('/reg/prices', routes.external.prices);
router.post('/reg/captcha/init', routes.external.initCaptcha);
router.get('/reg/api-urls', routes.external.apiUrls);

router.get('/account/wallets', checkUserAuth, routes.account.walletsList);
router.post('/account/wallets', checkUserAuth, routes.account.setWallets);
router.post('/account/wallet', checkUserAuth, routes.account.addWallet);
router.post(
  '/account/wallet/update/:publicKey',
  checkUserAuth,
  routes.account.editWallet,
);
router.delete('/account/wallet/:publicKey', checkUserAuth, routes.account.deleteWallet);
router.post(
  '/account/wallet/import/validate/:publicKey',
  checkUserAuth,
  routes.account.importValidateWallet,
);
router.post('/account/add-missing-wallet', routes.account.addMissingWallet);
router.get('/account/wallet/fio-requests', checkUserAuth, routes.account.fioRequests);

router.get('/ref-profile/:code?', routes.refProfiles.info);
router.get('/ref-profile/settings/:code?', routes.refProfiles.settings);

router.post('/fio-api/chain/get_table_rows', async (req, res) => {
  const sReq = superagent.post(`${process.env.FIO_BASE_URL}chain/get_table_rows`);

  sReq.send(req.body);

  const result = await sReq.then(res => {
    if (!res.status) throw res.body.error;
    return res.body;
  });

  return res.status(200).send(result);
});

router.post('/contacts', checkUserAuth, routes.contacts.create);
router.get('/contacts', checkUserAuth, routes.contacts.list);

router.get('/check-pub-address', checkUserAuth, routes.external.validatePubAddress);

router.get('/orders', checkUserOrGuestOptionalAuth, routes.orders.list);
router.get('/orders/active', checkGuestOrUserAuth, routes.orders.getActive);
router.post('/orders', checkGuestOrUserAuth, routes.orders.create);
router.post(
  '/orders/process-payment',
  checkGuestOrUserAuth,
  routes.orders.processPayment,
);
router.post('/orders/update/public-key', checkUserAuth, routes.orders.updatePubKey);
router.delete('/orders/active', checkGuestOrUserAuth, routes.orders.cancel);
router.get(
  '/orders/item/:id/:publicKey',
  checkUserOrGuestOptionalAuth,
  routes.orders.get,
);

router.post('/payments', checkUserAuth, routes.payments.create);
router.post('/payments/webhook/', routes.payments.webhook);
router.post('/payments/cancel', checkUserAuth, routes.payments.cancel);

router.get('/chain-codes/:chainCode?', routes.chainCodes.list);
router.get('/selected-chain-codes', routes.chainCodes.selectedList);

router.post('/generate-pdf', routes.generatePdf.create);

router.post('/verify-twitter', routes.twitter.verify);
router.get('/verify-abstract-email', routes.external.abstractEmailVerification);

router.get('/wrap-status/tokens/wrap', routes.history.wrapTokens);
router.get('/wrap-status/domains/wrap', routes.history.wrapDomains);
router.get('/wrap-status/tokens/unwrap', routes.history.unwrapTokens);
router.get('/wrap-status/domains/unwrap', routes.history.unwrapDomains);
router.get('/wrap-status/domains/burn', routes.history.burnedDomains);

router.post('/cart-add-item', checkGuestOrUserAuth, routes.cart.addItem);
router.delete('/cart-clear-cart', checkGuestOrUserAuth, routes.cart.clearCart);
router.patch('/cart-delete-item', checkGuestOrUserAuth, routes.cart.deleteItem);
router.get('/cart', checkUserOrGuestOptionalAuth, routes.cart.getCart);
router.patch(
  '/cart-handle-free-items',
  checkGuestOrUserAuth,
  routes.cart.handleUsersFreeCartItems,
);
router.patch(
  '/cart-recalculate-updated-prices',
  checkGuestOrUserAuth,
  routes.cart.recalculateOnPriceUpdate,
);
router.patch(
  '/cart-update-item-period',
  checkGuestOrUserAuth,
  routes.cart.updateItemPeriod,
);
router.post('/cart-create-from-order', checkUserAuth, routes.cart.createCartFromOrder);

router.get('/external-provider-nfts', routes.external.externalProviderNfts);
router.get(
  '/external-provider-nfts-metadata',
  routes.external.externalProviderNftsMetadata,
);
router.get('/external-tokens', routes.external.getAllExternalTokens);
router.get('/verify-gated-registration', routes.metamask.nftTokenVerification);

router.get(
  '/verify-alternative-user',
  checkUserAuth,
  routes.users.alternativeUserVerification,
);

router.get('/free-addresses', routes.freeAddresses.getFreeAddresses);

router.get('/gas-oracle', routes.external.getGasOracle);

router.get('/edge-cr', routes.external.getEdgeApiCreds);

router.get('/site-settings', routes.general.getSiteSettings);

// TODO: commented due to DASH-711 task. We hide it until figure out with hash
// router.get('/fetch-image-hash', routes.general.imageToHash);

router.get('/get-url-content', routes.general.getUrlContent);

router.post('/domains-watchlist', checkUserAuth, routes.domainsWatchlist.create);
router.delete('/domains-watchlist', checkUserAuth, routes.domainsWatchlist.delete);
router.get('/domains-watchlist', checkUserAuth, routes.domainsWatchlist.list);

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

const publicApiRouter = express.Router();

publicApiRouter.post('/buy-address', routes.publicApi.buyAddress);
publicApiRouter.post('/renew', routes.publicApi.renew);
publicApiRouter.post('/renew-address', routes.publicApi.renew);
publicApiRouter.post('/summary', routes.publicApi.summary);
publicApiRouter.get('/is-domain-public/:domain', routes.publicApi.isDomainPublic);
publicApiRouter.get('/get-domains/:referralCode', routes.publicApi.getDomains);

export { router, publicApiRouter };
