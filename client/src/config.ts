const defaultSupportUrl =
  'https://fioprotocol.atlassian.net/servicedesk/customer/portal/4';
const defaultWrapPage = 'https://wrap.fio.net';
const defaultGetTokensUrl = 'https://fio.net/token/get-fio-tokens';

const config = {
  apiPrefix: 'api/v1/',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
  baseUrl: process.env.REACT_APP_BASE_URL,
  fioChainId: process.env.REACT_APP_FIO_CHAIN_ID,
  wsBaseUrl: process.env.REACT_APP_WS_BASE_URL,
  supportUrl:
    process.env.REACT_APP_FIOPROTOCOL_SUPPORT_URL || defaultSupportUrl,
  userTokenName: process.env.REACT_APP_USER_TOKEN_NAME,
  guestTokenName: process.env.REACT_APP_GUEST_TOKEN_NAME,
  adminTokenName: process.env.REACT_APP_ADMIN_TOKEN_NAME,
  getTokensUrl: process.env.REACT_APP_GET_TOKENS_URL || defaultGetTokensUrl,
  wrapStatusPage:
    process.env.REACT_APP_WRAP_STATUS_PAGE_BASE_URL || defaultWrapPage,
  sentryDsn: process.env.REACT_APP_SENTRY_DSN,
  sentryEnv: process.env.REACT_APP_SENTRY_ENV,
  sentryReplaysSampleRate: Number(
    process.env.REACT_APP_SENTRY_REPLAYS_SAMPLE_RATE || 0,
  ),
  sentryReplaysOnErrorSampleRate: Number(
    process.env.REACT_APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || 1,
  ),
  exportOrdersCSVLimit: Number(process.env.REACT_APP_EXPORT_ORDERS_CSV_LIMIT),
};

export default config;
