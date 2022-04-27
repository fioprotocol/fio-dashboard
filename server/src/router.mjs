import express from 'express';

import { createProxyMiddleware } from 'http-proxy-middleware';

import routes from './routes';

const router = express.Router();

const checkAuth = routes.auth.check;

router.post('/auth', routes.auth.create);
router.get('/auth/nonce', routes.auth.nonce);
router.get('/auth/username/:email', routes.auth.username);
router.post('/auth/new-device-two-factor', routes.newDeviceTwoFactor.create);
router.post(
  '/auth/new-device-two-factor/update/:voucherId',
  checkAuth,
  routes.newDeviceTwoFactor.update,
);
router.delete('/auth/new-device-two-factor', checkAuth, routes.newDeviceTwoFactor.delete);
router.get(
  '/auth/new-device-two-factor/check-rejected',
  routes.newDeviceTwoFactor.checkRejected,
);

router.post('/actions/:hash', routes.actions.submit);

router.get('/users/available/:email', routes.users.available);
router.get('/users/me', checkAuth, routes.users.info);
router.get('/users', checkAuth, routes.users.list);
router.get('/users/:id', checkAuth, routes.users.show);
router.post('/users', routes.users.create);
router.put('/users', checkAuth, routes.users.update);
router.post('/users/setRecovery', checkAuth, routes.users.setRecovery);
router.post('/users/resendRecovery', checkAuth, routes.users.resendRecovery);
router.post('/users/resendConfirmEmail', routes.users.resendEmailConfirm);
router.post('/users/update-email-request', checkAuth, routes.users.updateEmailRequest);
router.post('/users/update-email-revert', checkAuth, routes.users.updateEmailRevert);

router.get('/notifications', checkAuth, routes.notifications.list);
router.post('/notifications', checkAuth, routes.notifications.create);
router.put('/notifications', checkAuth, routes.notifications.update);

router.get('/reg/domains', routes.external.domains);
router.get('/reg/prices', routes.external.prices);
router.post('/reg/register', checkAuth, routes.external.register);
router.post('/reg/captcha/init', checkAuth, routes.external.initCaptcha);

router.get('/account/wallets', checkAuth, routes.account.walletsList);
router.post('/account/wallets', checkAuth, routes.account.setWallets);
router.post('/account/wallet', checkAuth, routes.account.addWallet);
router.post('/account/wallet/update/:publicKey', checkAuth, routes.account.editWallet);
router.post(
  '/account/wallet/import/validate/:publicKey',
  checkAuth,
  routes.account.importValidateWallet,
);

router.get('/ref-profile/:code', routes.refProfiles.info);
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

router.post('/contacts', checkAuth, routes.contacts.create);
router.get('/contacts', checkAuth, routes.contacts.list);

router.get('/check-pub-address', checkAuth, routes.external.validatePubAddress);

export default router;
