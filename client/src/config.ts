const defaultSupportUrl =
  'https://fioprotocol.atlassian.net/servicedesk/customer/portal/4';
const defaultWrapPage = 'https://wrap.fio.net';
const defaultGetTokensUrl = 'https://fio.net/token/get-fio-tokens';

const config = {
  apiPrefix: 'api/v1/',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
  baseUrl: process.env.REACT_APP_BASE_URL,
  wsBaseUrl: process.env.REACT_APP_WS_BASE_URL,
  supportUrl:
    process.env.REACT_APP_FIOPROTOCOL_SUPPORT_URL || defaultSupportUrl,
  userTokenName: process.env.REACT_APP_USER_TOKEN_NAME,
  adminTokenName: process.env.REACT_APP_ADMIN_TOKEN_NAME,
  getTokensUrl: process.env.REACT_APP_GET_TOKENS_URL || defaultGetTokensUrl,
  wrapStatusPage:
    process.env.REACT_APP_WRAP_STATUS_PAGE_BASE_URL || defaultWrapPage,
};

export default config;
