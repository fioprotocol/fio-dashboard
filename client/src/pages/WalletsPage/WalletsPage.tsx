import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import superagent from 'superagent';
import isEmpty from 'lodash/isEmpty';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import WalletItem from './components/WalletItem';
import CreateWallet from './components/CreateWallet';
import ActionButtonsContainer from './components/ActionButtonsContainer';
import TotalBalanceBadge from './components/TotalBalanceBadge';
import Title from './components/Title';
import InfoBadge from '../../components/Badges/InfoBadge/InfoBadge';
import NotificationBadge from '../../components/NotificationBadge/NotificationBadge';
import { WelcomeComponent } from '../DashboardPage/components/WelcomeComponent';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import {
  NOTIFICATIONS_CONTENT,
  NOTIFICATIONS_CONTENT_TYPE,
} from '../../constants/notifications';
import {
  APY_URL,
  WELCOME_COMPONENT_ITEM_CONTENT,
  WelcomeItemProps,
} from '../DashboardPage/components/WelcomeComponentItem/constants';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { isDomainExpired } from '../../util/fio';
import { log } from '../../util/general';

import useEffectOnce from '../../hooks/general';

import { Props } from './types';

import classes from './styles/WalletsPage.module.scss';
import unwrapIcon from '../../assets/images/unwrap.svg';

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

const WalletsPage: React.FC<Props> = props => {
  const { fioWallets, balance, refreshBalance, location } = props;

  const [showCreateWallet, setShowCreateWallet] = useState<boolean>(false);
  const [showWalletImported, setShowWalletImported] = useState<boolean>(false);
  const [showWalletCreated, setShowWalletCreated] = useState<boolean>(false);

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

  useEffectOnce(() => {
    for (const { publicKey } of fioWallets) {
      refreshBalance(publicKey);
    }
  }, [fioWallets, refreshBalance]);

  useEffect(() => {
    if (location.query && location.query.imported) {
      setShowWalletImported(true);
    }
  }, [location]);

  const closeCreateWallet = () => setShowCreateWallet(false);
  const closeImportedWallet = () => setShowWalletImported(false);
  const closeCreatedWallet = () => setShowWalletCreated(false);

  const onAdd = () => {
    setShowCreateWallet(true);
  };
  const onWalletCreated = () => {
    setShowCreateWallet(false);
    setShowWalletCreated(true);
  };

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

  const renderTitle = () => {
    return (
      <Title title="FIO Wallets">
        <ActionButtonsContainer>
          <Link to={ROUTES.UNWRAP_TOKENS} className={classes.actionButton}>
            <Button>
              <img
                src={unwrapIcon}
                alt="unwrap"
                className={classes.unwrapIcon}
              />
              <span>Unwrap Tokens</span>
            </Button>
          </Link>

          <Link to={ROUTES.IMPORT_WALLET} className={classes.actionButton}>
            <Button>
              <FontAwesomeIcon icon="download" />
              <span>Import</span>
            </Button>
          </Link>

          <a href="#" onClick={onAdd} className={classes.actionButton}>
            <Button>
              <FontAwesomeIcon icon="plus-circle" />
              <span>Add</span>
            </Button>
          </a>
        </ActionButtonsContainer>
      </Title>
    );
  };

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

  return (
    <div className={classes.container}>
      <CreateWallet
        show={showCreateWallet}
        onClose={closeCreateWallet}
        onWalletCreated={onWalletCreated}
      />
      <LayoutContainer title={renderTitle()}>
        <NotificationBadge
          type={BADGE_TYPES.SUCCESS}
          show={showWalletImported}
          onClose={closeImportedWallet}
          message={
            NOTIFICATIONS_CONTENT[NOTIFICATIONS_CONTENT_TYPE.WALLET_IMPORTED]
              .message
          }
          title={
            NOTIFICATIONS_CONTENT[NOTIFICATIONS_CONTENT_TYPE.WALLET_IMPORTED]
              .title
          }
          iconName="check-circle"
        />
        <NotificationBadge
          type={BADGE_TYPES.SUCCESS}
          show={showWalletCreated}
          onClose={closeCreatedWallet}
          message={
            NOTIFICATIONS_CONTENT[NOTIFICATIONS_CONTENT_TYPE.WALLET_CREATED]
              .message
          }
          title={
            NOTIFICATIONS_CONTENT[NOTIFICATIONS_CONTENT_TYPE.WALLET_CREATED]
              .title
          }
          iconName="check-circle"
        />
        {fioWallets.length > 0 ? (
          fioWallets.map(wallet => (
            <WalletItem key={wallet.publicKey} fioWallet={wallet} />
          ))
        ) : (
          <div className={classes.infoBadge}>
            <InfoBadge
              title="No Wallets"
              message="You have no wallets at this time."
            />
          </div>
        )}

        <WelcomeComponent
          firstWelcomeItem={firstWelcomeItem}
          secondWelcomeItem={secondWelcomeItem}
          loading={loading}
          onlyActions
          noPaddingTop
        />
      </LayoutContainer>
      <div className={classes.totalBalanceContainer}>
        <TotalBalanceBadge {...balance.total} isNew />
      </div>
    </div>
  );
};

export default WalletsPage;
