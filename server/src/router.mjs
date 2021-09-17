import express from 'express';
import routes from './routes';

const router = express.Router();

const checkAuth = routes.auth.check;

router.post('/auth', routes.auth.create);
router.get('/auth/nonce', routes.auth.nonce);
router.get('/auth/username/:email', routes.auth.username);

router.post('/actions/:hash', routes.actions.submit);

router.get('/users/available/:email', routes.users.available);
router.get('/users/me', checkAuth, routes.users.info);
router.get('/users', checkAuth, routes.users.list);
router.get('/users/:id', checkAuth, routes.users.show);
router.post('/users', routes.users.create);
router.put('/users', checkAuth, routes.users.update);
router.post('/users/setRecovery', checkAuth, routes.users.setRecovery);
router.post('/users/resendRecovery', checkAuth, routes.users.resendRecovery);

router.get('/notifications', checkAuth, routes.notifications.list);
router.post('/notifications', checkAuth, routes.notifications.create);
router.put('/notifications', checkAuth, routes.notifications.update);

router.get('/reg/domains', routes.external.domains);
router.get('/reg/prices', routes.external.prices);
router.post('/reg/register', checkAuth, routes.external.register);
router.post('/reg/captcha/init', checkAuth, routes.external.initCaptcha);

router.get('/account/wallets', checkAuth, routes.account.walletsList);
router.post('/account/wallets', checkAuth, routes.account.setWallets);

router.get('/ref-profile/:code', routes.refProfiles.info);

export default router;
