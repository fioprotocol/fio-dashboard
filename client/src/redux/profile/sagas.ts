import { History } from 'history';
import { put, select, takeEvery } from 'redux-saga/effects';

import { log } from '../../util/general';

import { setWallets } from '../account/actions';
import { refreshBalance } from '../fio/actions';
import {
  loadAdminProfile,
  loadProfile,
  login,
  setIsNewUser,
  ALTERNATE_LOGIN_SUCCESS,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGOUT_SUCCESS,
  CONFIRM_ADMIN_EMAIL_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  NONCE_SUCCESS,
  PROFILE_SUCCESS,
  RESET_ADMIN_PASSWORD_SUCCESS,
  ACTIVATE_AFFILIATE_SUCCESS,
  GUEST_LOGIN_SUCCESS,
} from './actions';

import { closeLoginModal } from '../modal/actions';
import { listNotifications } from '../notifications/actions';
import {
  handleUsersFreeCartItems,
  deleteItem as deleteCartItem,
  clearCart,
} from '../cart/actions';
import { setRedirectPath } from '../navigation/actions';

import {
  locationState as locationStateSelector,
  redirectLink,
  pathname as pathnameSelector,
} from '../navigation/selectors';
import { fioWallets } from '../fio/selectors';
import { archivedWalletIds } from '../edge/selectors';
import {
  cartId as cartIdSelector,
  cartItems as cartItemsSelector,
} from '../cart/selectors';
import {
  isNoProfileFlow as isNoProfileFlowSelector,
  refProfileCode as refProfileCodeSelector,
} from '../refProfile/selectors';
import {
  user as userSelector,
  isNewUser as isNewUserSelectors,
} from './selectors';

import {
  ANALYTICS_EVENT_ACTIONS,
  ANALYTICS_LOGIN_METHOD,
} from '../../constants/common';
import { ADMIN_ROUTES, PUBLIC_ROUTES, ROUTES } from '../../constants/routes';
import { METAMASK_DOMAIN_NAME } from '../../constants/fio';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { REF_PROFILE_SLUG_NAME } from '../../constants/ref';

import { fireAnalyticsEvent } from '../../util/analytics';
import { Api } from '../../api';
import { Api as AdminApi } from '../../admin/api';

import {
  CartItem,
  FioWalletDoublet,
  PrivateRedirectLocationState,
  User,
} from '../../types';
import { Action } from '../types';
import { AuthDeleteNewDeviceRequestResponse } from '../../api/responses';

export function* loginSuccess(history: History, api: Api): Generator {
  yield takeEvery(LOGIN_SUCCESS, function*(action: Action) {
    api.client.setToken(action.data.jwt);
    action.data.deviceToken &&
      api.client.setDeviceToken(action.data.deviceToken);
    const hasRedirectTo: {
      pathname: string;
      state: object;
      search: string;
    } = yield select(redirectLink);
    const wallets: FioWalletDoublet[] = yield select(fioWallets);
    if (action.isSignUp) {
      fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.SIGN_UP);
      yield put<Action>(setIsNewUser(true));
    }
    fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.LOGIN, {
      method: action.isPinLogin
        ? ANALYTICS_LOGIN_METHOD.PIN
        : ANALYTICS_LOGIN_METHOD.PASSWORD,
    });
    const edgeArchivedWalletIds: string[] | null = yield select(
      archivedWalletIds,
    );
    if (wallets && wallets.length)
      yield put<Action>(
        setWallets({
          fioWallets: wallets,
          archivedWalletIds: edgeArchivedWalletIds,
        }),
      );
    if ((action.otpKey && action.voucherId) || action.voucherId)
      try {
        // We have to wait delete voucher call from server to get updated profile then.
        // Sagas doesn't wait. So in this case we have to write result into a constant.
        // @ts-ignore
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const res: AuthDeleteNewDeviceRequestResponse = yield api.auth.deleteNewDeviceRequest(
          action.voucherId,
        );
      } catch (e) {
        log.error(e);
      }
    // Need to wait for result, so use hack with two yield
    // @ts-ignore
    yield yield put<
      Action
    >(loadProfile({ shouldHandleUsersFreeCart: true, shouldHandleMetamaskCartItem: true }));
    yield put<Action>(listNotifications());

    const locationState: PrivateRedirectLocationState = yield select(
      locationStateSelector,
    );

    if (
      !hasRedirectTo &&
      locationState &&
      locationState.from &&
      locationState.from.pathname
    ) {
      history.push({
        pathname: locationState.from.pathname,
        search: locationState.from.search || '',
      });
    }

    if (
      !hasRedirectTo &&
      history.location?.pathname === ROUTES.CREATE_ACCOUNT
    ) {
      history.push({
        pathname: ROUTES.HOME,
      });
    }

    if (hasRedirectTo) {
      history.push(hasRedirectTo.pathname, hasRedirectTo.state);
      yield put<Action>(setRedirectPath(null));
    }

    yield put(closeLoginModal());
  });
}

export function* guestLoginSuccess(api: Api): Generator {
  yield takeEvery(GUEST_LOGIN_SUCCESS, function(action: Action) {
    api.client.setGuestToken(action.data.jwt);
  });
}

export function* alternateLoginSuccess(history: History, api: Api): Generator {
  yield takeEvery(ALTERNATE_LOGIN_SUCCESS, function*(action: Action) {
    api.client.setToken(action.data.jwt);
    action.data.deviceToken &&
      api.client.setDeviceToken(action.data.deviceToken);
    const hasRedirectTo: {
      pathname: string;
      state: object;
      search: string;
    } = yield select(redirectLink);
    if (action.data.isSignUp) {
      fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.SIGN_UP);
      yield put<Action>(setIsNewUser(true));
    }
    fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.LOGIN, {
      method: ANALYTICS_LOGIN_METHOD.EXTERNAL,
    });
    // Need to wait for result, so use hack with two yield
    // @ts-ignore
    yield yield put<
      Action
    >(loadProfile({ shouldHandleUsersFreeCart: true, shouldHandleMetamaskCartItem: true }));
    yield put<Action>(listNotifications());

    const locationState: PrivateRedirectLocationState = yield select(
      locationStateSelector,
    );

    if (
      !hasRedirectTo &&
      locationState &&
      locationState.from &&
      locationState.from.pathname
    ) {
      history.push({
        pathname: locationState.from.pathname,
        search: locationState.from.search || '',
      });
    }

    if (
      !hasRedirectTo &&
      history.location?.pathname === ROUTES.CREATE_ACCOUNT
    ) {
      history.push({
        pathname: ROUTES.HOME,
      });
    }

    if (hasRedirectTo) {
      history.push({
        pathname: hasRedirectTo.pathname,
        state: hasRedirectTo.state,
        search: hasRedirectTo.search,
      });
      yield put<Action>(setRedirectPath(null));
    }

    yield put(closeLoginModal());
  });
}

export function* profileSuccess(): Generator {
  yield takeEvery(PROFILE_SUCCESS, function*(action: Action) {
    for (const fioWallet of action.data.fioWallets) {
      yield put<Action>(refreshBalance(fioWallet.publicKey));
    }

    const user: User = yield select(userSelector);
    const cartId: string | null = yield select(cartIdSelector);
    const cartItems: CartItem[] = yield select(cartItemsSelector);

    if (cartId && user && action.shouldHandleUsersFreeCart) {
      yield put<Action>(
        handleUsersFreeCartItems({
          refCode: user.refProfile?.code,
        }),
      );
    }

    if (cartId && user && action.shouldHandleMetamaskCartItem) {
      const cartItemOnMetamaskDomain = cartItems.find(
        cartItem => cartItem.domain === METAMASK_DOMAIN_NAME,
      );

      if (cartItemOnMetamaskDomain) {
        yield put<Action>(
          deleteCartItem({
            itemId: cartItemOnMetamaskDomain.id,
            item: cartItemOnMetamaskDomain,
            refCode: user.refProfile?.code,
          }),
        );
      }
    }
  });
}

export function* logoutRequest(): Generator {
  yield takeEvery(LOGOUT_REQUEST, function*(action: Action) {
    const cartId: string | null = yield select(cartIdSelector);
    if (cartId) {
      yield put<Action>(clearCart({ isNotify: action.auto }));
    }
  });
}

export function* logoutSuccess(history: History): Generator {
  yield takeEvery(LOGOUT_SUCCESS, function*(action: Action) {
    const { redirect } = action;
    const pathname: string = yield select(pathnameSelector);

    const isNewUser: boolean = yield select(isNewUserSelectors);

    if (isNewUser) {
      yield put<Action>(setIsNewUser(false));
    }

    const isNoProfileFlow: boolean = yield select(isNoProfileFlowSelector);
    const refCode: string = yield select(refProfileCodeSelector);

    if (isNoProfileFlow && refCode) {
      const search = window.location?.search;

      const noProfileFlowRedirectParams = {
        pathname: `${ROUTES.NO_PROFILE_REGISTER_FIO_HANDLE.replace(
          REF_PROFILE_SLUG_NAME,
          refCode,
        )}`,
        search: '',
      };

      if (search) {
        const urlParams = new URLSearchParams(search);

        const publicKey = urlParams.get('publicKey');
        noProfileFlowRedirectParams.search = `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${publicKey}`;
      }

      history.push(noProfileFlowRedirectParams);
    } else {
      if (redirect) history.push(redirect, {});
      if (!redirect) {
        if (!PUBLIC_ROUTES.includes(pathname)) {
          history.replace(ROUTES.HOME, {});
        }
      }
    }
  });
}

export function* nonceSuccess(): Generator {
  yield takeEvery(NONCE_SUCCESS, function*(action: Action) {
    const {
      email,
      edgeWallets,
      signatures,
      nonce,
      otpKey,
      voucherId,
      isPinLogin,
      isSignUp,
      referrerCode,
      username,
    } = action.data;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    yield put<Action>(
      login({
        email,
        edgeWallets,
        signatures,
        challenge: nonce,
        timeZone,
        otpKey,
        voucherId,
        isPinLogin,
        isSignUp,
        referrerCode,
        username,
      }),
    );
  });
}

export function* adminLogoutSuccess(history: History): Generator {
  yield takeEvery(ADMIN_LOGOUT_SUCCESS, function(action: Action) {
    const { redirect } = action;

    if (redirect) history.push(redirect, {});
    if (!redirect) history.replace(ADMIN_ROUTES.ADMIN_LOGIN, {});
  });
}

export function* adminLoginSuccess(history: History, api: AdminApi): Generator {
  yield takeEvery(ADMIN_LOGIN_SUCCESS, function*(action: Action) {
    api.client.setAdminToken(action.data.jwt);

    yield put<Action>(loadAdminProfile());

    history.push(ADMIN_ROUTES.ADMIN_HOME);
  });
}

export function* adminConfirmSuccess(
  history: History,
  api: AdminApi,
): Generator {
  yield takeEvery(CONFIRM_ADMIN_EMAIL_SUCCESS, function*(action: Action) {
    api.client.setAdminToken(action.data.jwt);

    yield put<Action>(loadAdminProfile());

    history.push(ADMIN_ROUTES.ADMIN_HOME);
  });
}

export function* adminResetPasswordSuccess(history: History): Generator {
  yield takeEvery(RESET_ADMIN_PASSWORD_SUCCESS, function() {
    history.replace(ADMIN_ROUTES.ADMIN_LOGIN, {});
  });
}

export function* activateAffiliateSuccess(history: History): Generator {
  yield takeEvery(ACTIVATE_AFFILIATE_SUCCESS, function*() {
    fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.AFFILIATE_ENABLED);
    yield history.push(ROUTES.FIO_AFFILIATE_PROGRAM_ENABLED);
  });
}
