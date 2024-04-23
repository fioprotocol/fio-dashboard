const defaultSupportUrl =
  'https://fioprotocol.atlassian.net/servicedesk/customer/portal/4';
const defaultWrapPage = 'https://wrap.fio.net';

const config = {
  apiPrefix: 'api/v1/',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
  baseUrl: process.env.REACT_APP_BASE_URL,
  wsBaseUrl: process.env.REACT_APP_WS_BASE_URL,
  supportUrl:
    process.env.REACT_APP_FIOPROTOCOL_SUPPORT_URL || defaultSupportUrl,
  userTokenName: process.env.REACT_APP_USER_TOKEN_NAME,
  adminTokenName: process.env.REACT_APP_ADMIN_TOKEN_NAME,
  wrapStatusPage:
    process.env.REACT_APP_WRAP_STATUS_PAGE_BASE_URL || defaultWrapPage,
};

export default config;
