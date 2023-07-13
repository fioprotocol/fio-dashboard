import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import SettingsIcon from '@mui/icons-material/Settings';
import classnames from 'classnames';
import superagent from 'superagent';
import isEmpty from 'lodash/isEmpty';
import { useSelector } from 'react-redux';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import ShowPrivateKeyModal from './components/ShowPrivateKeyModal';
import { ManagePageCtaBadge } from '../../components/ManagePageContainer/ManagePageCtaBadge';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import ActionButtonsContainer from '../WalletsPage/components/ActionButtonsContainer';
import TotalBalanceBadge from '../WalletsPage/components/TotalBalanceBadge';
import Title from '../WalletsPage/components/Title';
import EditWalletName from './components/EditWalletName';
import WalletTabs from './components/WalletTabs';
import InfoBadge from '../../components/InfoBadge/InfoBadge';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { WALLET_CREATED_FROM } from '../../constants/common';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { CTA_BADGE_TYPE } from '../../components/ManagePageContainer/constants';
import {
  APY_URL,
  WELCOME_COMPONENT_ITEM_CONTENT,
  WelcomeItemProps,
} from '../DashboardPage/components/WelcomeComponentItem/constants';

import useEffectOnce from '../../hooks/general';
import { isDomainExpired } from '../../util/fio';
import { log } from '../../util/general';

import {
  fioAddresses as fioAddressesSelector,
  fioAddressesLoading as fioAddressesLoadingSelector,
  fioDomains as fioDomainsSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
  loading as fioLoadingSelector,
  mappedPublicAddresses as mappedPublicAddressesSelector,
  walletsFioAddressesLoading as walletsFioAddressesLoadingSelector,
} from '../../redux/fio/selectors';
import { user as userSelector } from '../../redux/profile/selectors';
import {
  hasRecoveryQuestions as hasRecoveryQuestionsSelector,
  isPinEnabled as isPinEnabledSelector,
  loading as edgeLoadingSelector,
} from '../../redux/edge/selectors';

import { ContainerProps, LocationProps } from './types';

import classes from './styles/WalletPage.module.scss';
import wrapIcon from '../../assets/images/wrap.svg';
import unwrapIcon from '../../assets/images/unwrap.svg';
import { WelcomeComponent } from '../DashboardPage/components/WelcomeComponent';

const WalletPage: React.FC<ContainerProps & LocationProps> = props => {
  const {
    fioWallet,
    fioCryptoHandles,
    balance,
    profileRefreshed,
    refreshBalance,
    fioWalletsData = {},
    fioWalletsTxHistory,
    location: {
      query: { publicKey } = {},
      state: { isOpenLockedList = false } = {},
    },
  } = props;

  const isLedgerWallet = fioWallet?.from === WALLET_CREATED_FROM.LEDGER;
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [showWalletNameEdit, setShowWalletNameEdit] = useState(false);
  const [error, setError] = useState<string>('');

  const [
    firstWelcomeItem,
    setFirstWelcomeItem,
  ] = useState<WelcomeItemProps | null>(null);

  const [
    secondWelcomeItem,
    setSecondWelcomeItem,
  ] = useState<WelcomeItemProps | null>(null);

  const [APY, setAPY] = useState<string>(null);

  const fioWalletsBalances = useSelector(fioWalletsBalancesSelector);
  const fioLoading = useSelector(fioLoadingSelector);
  const fioAddresses = useSelector(fioAddressesSelector);
  const fioDomains = useSelector(fioDomainsSelector);
  const mappedPublicAddresses = useSelector(mappedPublicAddressesSelector);
  const user = useSelector(userSelector);
  const hasRecoveryQuestions = useSelector(hasRecoveryQuestionsSelector);
  const isPinEnabled = useSelector(isPinEnabledSelector);
  const edgeLoading = useSelector(edgeLoadingSelector);
  const fioAddressesLoading = useSelector(fioAddressesLoadingSelector);
  const walletsFioAddressesLoading = useSelector(
    walletsFioAddressesLoadingSelector,
  );

  const hasFCH = fioAddresses?.length > 0;
  const hasOneFCH = fioAddresses?.length === 1;
  const hasDomains = fioDomains?.length > 0;
  const hasOneDomain = fioDomains?.length === 1;
  const hasNoStakedTokens = fioWalletsBalances.total?.staked?.nativeFio === 0;
  const hasExpiredDomains = fioDomains.some(fioDomain =>
    isDomainExpired(fioDomain.name, fioDomain.expiration),
  );

  const loading =
    fioLoading ||
    edgeLoading ||
    fioAddressesLoading ||
    walletsFioAddressesLoading;

  const totalBalance = fioWalletsBalances?.total?.total;

  const noMappedPubAddresses =
    !isEmpty(mappedPublicAddresses) &&
    Object.values(mappedPublicAddresses).every(
      mappedPubicAddress => mappedPubicAddress.publicAddresses.length === 0,
    );

  const firstFromListFioAddressName = fioAddresses[0]?.name;
  const firstFromListFioDomainName = fioDomains[0]?.name;

  const getAPY = useCallback(async () => {
    try {
      const response = await superagent.post(APY_URL);
      const { historical_apr } = response.body || {};

      if (historical_apr?.['30day']) {
        setAPY(historical_apr['30day'].toFixed(2));
      }
    } catch (error) {
      log.error(error);
    }
  }, []);

  useEffectOnce(() => {
    getAPY();
  }, []);

  useEffect(() => {
    if (!loading) {
      let firstItem = WELCOME_COMPONENT_ITEM_CONTENT.OPEN_SEA;
      let secondItem = null;
      if (hasDomains) {
        secondItem = firstItem;
        if (hasOneDomain) {
          firstItem = {
            ...WELCOME_COMPONENT_ITEM_CONTENT.WRAP_DOMAIN,
            actionButtonLink: {
              ...WELCOME_COMPONENT_ITEM_CONTENT.WRAP_DOMAIN.actionButtonLink,
              search: `${QUERY_PARAMS_NAMES.NAME}=${firstFromListFioDomainName}`,
            },
          };
        } else {
          firstItem = WELCOME_COMPONENT_ITEM_CONTENT.WRAP_DOMAIN;
        }
      }
      if (hasDomains) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.GET_ANOTHER_FIO_DOMAIN;
      }
      if (hasDomains && !user.affiliateProfile) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.AFFILIATE;
      }
      if (hasNoStakedTokens) {
        secondItem = firstItem;
        firstItem = {
          ...WELCOME_COMPONENT_ITEM_CONTENT.STAKING,
          text: (
            <>
              {WELCOME_COMPONENT_ITEM_CONTENT.STAKING.text}
              <span className="bold-text"> Current APY: {APY}%</span>
            </>
          ),
        };
      }
      if (hasFCH && !hasDomains) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.GET_CUSTOM_FIO_DOMAIN;
      }
      if (totalBalance?.nativeFio === 0) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.FIO_BALANCE;
      }
      if (!isPinEnabled) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.SETUP_PIN;
      }
      if (hasFCH && noMappedPubAddresses) {
        secondItem = firstItem;
        if (hasOneFCH) {
          firstItem = {
            ...WELCOME_COMPONENT_ITEM_CONTENT.LINK_FCH_ONE,
            actionButtonLink: {
              ...WELCOME_COMPONENT_ITEM_CONTENT.LINK_FCH_ONE.actionButtonLink,
              search: `${QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE}=${firstFromListFioAddressName}`,
            },
          };
        } else {
          firstItem = WELCOME_COMPONENT_ITEM_CONTENT.LINK_FCH;
        }
      }
      if (!hasFCH) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.NO_FCH;
      }
      if (hasDomains && hasExpiredDomains) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.EXPIRED_DOMAINS;
      }
      if (!hasRecoveryQuestions) {
        secondItem = firstItem;
        firstItem = WELCOME_COMPONENT_ITEM_CONTENT.RECOVERY_PASSWORD;
      }
      setFirstWelcomeItem(firstItem);
      setSecondWelcomeItem(secondItem);
    }
  }, [
    APY,
    firstFromListFioAddressName,
    firstFromListFioDomainName,
    hasDomains,
    hasExpiredDomains,
    hasFCH,
    hasNoStakedTokens,
    hasOneDomain,
    hasOneFCH,
    hasRecoveryQuestions,
    isPinEnabled,
    loading,
    noMappedPubAddresses,
    totalBalance?.nativeFio,
    user.affiliateProfile,
  ]);

  useEffect(() => {
    if (fioWallet && fioWallet.publicKey) refreshBalance(fioWallet.publicKey);
  }, [fioWallet, refreshBalance]);

  useEffect(() => {
    if (publicKey && profileRefreshed && !fioWallet)
      setError(`FIO Wallet (${publicKey}) is not available`);
  }, [publicKey, fioWallet, profileRefreshed]);

  const onShowPrivateModalClose = () => setShowPrivateKeyModal(false);
  const closeWalletNameEdit = () => setShowWalletNameEdit(false);

  const onKeyShow = () => setShowPrivateKeyModal(true);

  const onWalletUpdated = () => {
    closeWalletNameEdit();
  };

  if (error)
    return (
      <div className={classes.container}>
        <LayoutContainer title="Wallet">
          <InfoBadge
            message={error}
            show={!!error}
            title="Error"
            type={BADGE_TYPES.ERROR}
          />
        </LayoutContainer>
      </div>
    );
  if (!fioWallet || !fioWallet.id) return <FioLoader wrap={true} />;

  const renderTitle = () => {
    const title = (
      <div className={classes.titleContainer}>
        <h3 className={classes.title}>{fioWallet.name}</h3>
        <div className={classes.titleActionButtons}>
          {!isLedgerWallet && (
            <a
              href="#"
              className={classnames(
                classes.actionButton,
                classes.settingsButton,
              )}
              onClick={onKeyShow}
            >
              <Button>
                <SettingsIcon />
              </Button>
            </a>
          )}
        </div>
      </div>
    );
    return (
      <Title title={title}>
        <ActionButtonsContainer>
          <Link
            to={{
              pathname: ROUTES.FIO_TOKENS_RECEIVE,
              search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}`,
            }}
            className={classes.actionButton}
          >
            <Button>
              <FontAwesomeIcon icon="arrow-down" />
              <span>Receive</span>
            </Button>
          </Link>

          <Link
            to={{
              pathname: ROUTES.SEND,
              search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}`,
            }}
            className={classes.actionButton}
          >
            <Button>
              <FontAwesomeIcon icon="arrow-up" />
              <span>Send</span>
            </Button>
          </Link>

          <Link
            to={`${ROUTES.WRAP_TOKENS}?publicKey=${fioWallet.publicKey}`}
            className={classes.actionButton}
          >
            <Button>
              <img src={wrapIcon} alt="wrap" />
              <span>Wrap Tokens</span>
            </Button>
          </Link>

          <Link
            to={`${ROUTES.UNWRAP_TOKENS}?publicKey=${fioWallet.publicKey}`}
            className={classes.actionButton}
          >
            <Button>
              <img src={unwrapIcon} alt="unwrap" />
              <span>Unwrap Tokens</span>
            </Button>
          </Link>
        </ActionButtonsContainer>
      </Title>
    );
  };
  const hasNoTransactions =
    balance.total.nativeFio === 0 &&
    fioWalletsTxHistory[fioWallet.publicKey]?.txs.length === 0;

  return (
    <div className={classes.container}>
      <ShowPrivateKeyModal
        show={showPrivateKeyModal}
        fioWallet={fioWallet}
        onClose={onShowPrivateModalClose}
      />
      <EditWalletName
        show={showWalletNameEdit}
        fioWallet={fioWallet}
        onSuccess={onWalletUpdated}
        onClose={closeWalletNameEdit}
      />
      <LayoutContainer title={renderTitle()}>
        <h6 className={classes.transactionsTitle}>Recent Transactions</h6>
        <hr />
        <InfoBadge
          message=" Only FIO Requests are displayed below. Please visit the Explorer to view you total transaction history."
          show={true}
          title="Transaction Display"
          type={BADGE_TYPES.INFO}
        />
        <p className={classes.text}>
          View your transactions by type as well as sent or received.
        </p>
        <WalletTabs
          fioWallet={fioWallet}
          fioCryptoHandles={fioCryptoHandles}
          hasNoTransactions={hasNoTransactions}
          walletData={fioWalletsData[fioWallet.publicKey]}
          walletTxHistory={fioWalletsTxHistory[fioWallet.publicKey]}
        />
        <WelcomeComponent
          firstWelcomeItem={firstWelcomeItem}
          secondWelcomeItem={secondWelcomeItem}
          loading={loading}
          onlyActions
          noPaddingTop
        />
      </LayoutContainer>
      <div className={classes.actionBadges}>
        <TotalBalanceBadge
          {...balance}
          publicKey={fioWallet.publicKey}
          isOpenLockedList={isOpenLockedList}
        />
        {!hasNoTransactions && (
          <ManagePageCtaBadge name={CTA_BADGE_TYPE.TOKENS} />
        )}
      </div>
    </div>
  );
};

export default WalletPage;
