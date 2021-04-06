import express from 'express';
import routes from './routes';

const router = express.Router();

const checkAuth = routes.auth.check;

router.post('/auth', routes.auth.create);

router.post('/actions/:hash', routes.actions.submit);

router.get('/users/me', checkAuth, routes.users.info);
router.get('/users', checkAuth, routes.users.list);
router.get('/users/:id', checkAuth, routes.users.show);
router.post('/users', routes.users.create);
router.post('/users/resetPassword', routes.users.resetPassword);
router.post('/users/setRecovery', checkAuth, routes.users.setRecovery);
router.put('/users', checkAuth, routes.users.update);

router.get('/notifications', checkAuth, routes.notifications.list);
router.post('/notifications', checkAuth, routes.notifications.create);
router.put('/notifications', checkAuth, routes.notifications.update);

export default router;
