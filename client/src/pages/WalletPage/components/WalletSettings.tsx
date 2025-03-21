import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import classnames from 'classnames';

import Modal from '../../../components/Modal/Modal';
import InfoBadge from '../../../components/InfoBadge/InfoBadge';
import CopyTooltip from '../../../components/CopyTooltip';
import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import PasswordForm from './PasswordForm';
import DeleteWalletForm from './DeleteWalletForm';
import EditWalletNameForm from './EditWalletNameForm';
import LedgerBadge from '../../../components/Badges/LedgerBadge/LedgerBadge';
import PageTitle from '../../../components/PageTitle/PageTitle';

import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import DangerModal from '../../../components/Modal/DangerModal';
import { LedgerCheckPublicAddress } from '../../../components/LedgerCheckPublicAddress/LedgerCheckPublicAddress';
import { PublicAddressBadge } from './PublicAddressBadge';
import { PriceComponent } from '../../../components/PriceComponent';

import apis from '../../../api';
import { authenticateWallet } from '../../../services/api/wallet';

import { useMetaMaskProvider } from '../../../hooks/useMetaMaskProvider';

import { updateWalletName } from '../../../redux/account/actions';
import { deleteWallet as deleteWalletAction } from '../../../redux/account/actions';
import { showGenericErrorModal } from '../../../redux/modal/actions';

import {
  fioDomains as fioDomainsSelector,
  fioAddresses as fioAddressesSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
} from '../../../redux/fio/selectors';

import { waitWalletKeys, waitForEdgeAccountStop } from '../../../util/edge';
import { copyToClipboard, log } from '../../../util/general';

import { ROUTES } from '../../../constants/routes';
import { WALLET_CREATED_FROM } from '../../../constants/common';
import { LINKS } from '../../../constants/labels';
import { USER_PROFILE_TYPE } from '../../../constants/profile';
import { ERROR_MESSAGES_BY_CODE } from '../../../constants/errors';

import { FioWalletDoublet } from '../../../types';
import {
  DeleteWalletFormValues,
  EditWalletNameValues,
  PasswordFormValues,
} from '../types';
import { EdgeWalletApiProvider } from '../../../services/api/wallet/edge';

import classes from '../styles/WalletDetailsModal.module.scss';

type Props = {
  show: boolean;
  fioWallet: FioWalletDoublet;
  fioWalletsAmount: number;
  userType: string;
  onClose: () => void;
};

const WalletSettings: React.FC<Props> = props => {
  const { show, fioWallet, fioWalletsAmount, userType, onClose } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const fioDomains = useSelector(fioDomainsSelector);
  const fioAddresses = useSelector(fioAddressesSelector);
  const fioWalletsBalances = useSelector(fioWalletsBalancesSelector);
  const metaMaskProvider = useMetaMaskProvider();

  const balance = fioWalletsBalances?.wallets[fioWallet?.publicKey]?.total;

  const walletFioDomainsCount = fioDomains.filter(
    it => it.walletPublicKey === fioWallet.publicKey,
  ).length;
  const walletFioAddressesCount = fioAddresses.filter(
    it => it.walletPublicKey === fioWallet.publicKey,
  ).length;

  const isPrimaryUserProfileType = userType === USER_PROFILE_TYPE.PRIMARY;

  const [loading, setLoading] = useState({
    updateWalletName: false,
    showPrivateKey: false,
    deleteWallet: false,
  });
  const [key, setKey] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const isEdgeWallet = fioWallet?.from === WALLET_CREATED_FROM.EDGE;
  const isLedgerWallet = fioWallet?.from === WALLET_CREATED_FROM.LEDGER;
  const isMetamaskWallet = fioWallet?.from === WALLET_CREATED_FROM.METAMASK;

  const onEditSubmit = (values: EditWalletNameValues) => {
    edit(values.name);
  };

  const edit = async (name: string) => {
    try {
      const res = await apis.account.updateWallet(fioWallet.publicKey, {
        name,
      });

      if (res.success) {
        dispatch(updateWalletName({ publicKey: fioWallet.publicKey, name }));
        onClose();
      } else {
        dispatch(showGenericErrorModal());
      }
    } catch (e) {
      showGenericErrorModal();
    }
  };

  useEffect(() => {
    setKey(null);
    return () => setKey(null);
  }, []);

  useEffect(() => {
    if (!show) setKey(null);
  }, [show]);

  const onConfirm = async (values: PasswordFormValues) => {
    setLoading({ ...loading, showPrivateKey: true });

    const { username, password } = values;
    let account;
    try {
      account = await apis.edge.login(username, password);
      if (!account) throw new Error();
    } catch (e) {
      setLoading({ ...loading, showPrivateKey: false });
      return { password: 'Invalid Password' };
    }

    try {
      const keys = await waitWalletKeys(account);
      await waitForEdgeAccountStop(account);
      if (keys[fioWallet.edgeId] != null && keys[fioWallet.edgeId].private) {
        setKey(keys[fioWallet.edgeId].private);
      }

      setLoading({ ...loading, showPrivateKey: false });

      return {};
    } catch (e) {
      setLoading({ ...loading, showPrivateKey: false });
      return { password: 'Something went wrong, please try again later' };
    }
  };

  const deleteWallet = async (values?: DeleteWalletFormValues) => {
    setLoading({ ...loading, deleteWallet: true });

    try {
      const { walletApiProvider, nonce } = await authenticateWallet({
        walletProviderName: isPrimaryUserProfileType ? 'edge' : 'metamask',
        authParams: isPrimaryUserProfileType
          ? values
          : { provider: metaMaskProvider },
      });

      if (isPrimaryUserProfileType && isEdgeWallet) {
        await apis.edge.deleteWallet(
          (walletApiProvider as EdgeWalletApiProvider).account,
          fioWallet.edgeId,
        );
      }

      await walletApiProvider.logout();

      try {
        const res = await apis.account.deleteWallet(fioWallet.publicKey, nonce);
        if (res.success) {
          dispatch(deleteWalletAction({ publicKey: fioWallet.publicKey }));
          history.push(ROUTES.TOKENS, { walletDeleted: true });
          onClose();
        } else {
          dispatch(showGenericErrorModal());
        }
      } catch (e) {
        showGenericErrorModal();
      }
    } catch (err) {
      setLoading({ ...loading, deleteWallet: false });
      log.error(err);

      throw err;
    }
  };

  const onDeleteConfirm = async () => {
    if (isPrimaryUserProfileType) {
      setShowPasswordModal(true);
    } else {
      try {
        await deleteWallet();
      } catch (error) {
        log.error(error);

        showGenericErrorModal();
      }
    }
  };

  const onDeletePasswordConfirm = async (values: DeleteWalletFormValues) => {
    try {
      await deleteWallet(values);
    } catch (error) {
      log.error(error);
      return {
        password:
          ERROR_MESSAGES_BY_CODE[
            error?.code as keyof typeof ERROR_MESSAGES_BY_CODE
          ] || ERROR_MESSAGES_BY_CODE.SERVER_ERROR,
      };
    }

    return {};
  };

  const onCancel = () => {
    if (
      !loading.showPrivateKey &&
      !loading.deleteWallet &&
      !loading.updateWalletName
    )
      onClose();
  };

  const renderKey = () => {
    if (key != null) {
      const onCopy = () => {
        copyToClipboard(key);
      };

      return (
        <>
          <div className={classes.privateKeyLabel}>
            This is your private key
          </div>

          <Badge type={BADGE_TYPES.WHITE} show={true}>
            <div className={classes.publicAddressContainer}>
              <div className={classnames(classes.publicKey, 'sentry-mask')}>
                {key}
              </div>
            </div>
          </Badge>

          <div className={classes.actionButtons}>
            <CopyTooltip>
              <Button onClick={onCopy} className={classes.iconContainer}>
                <ContentCopyIcon className={classes.icon} />
              </Button>
            </CopyTooltip>
          </div>
        </>
      );
    }

    return null;
  };

  const renderPasswordForm = () => {
    if (key != null) return null;
    return (
      <>
        <h6 className={classes.settingTitle}>Show Private Key</h6>
        <InfoBadge
          className={classes.infoBadge}
          show={true}
          type={BADGE_TYPES.INFO}
          title="Warning!"
          message="Never disclose this private key. Anyone with your private keys can steal any assets in your wallet."
        />
        <PasswordForm loading={loading.showPrivateKey} onSubmit={onConfirm} />
      </>
    );
  };

  const renderNameForm = () => {
    if (key != null) return null;
    return (
      <>
        <h6 className={classes.settingTitle}>Edit Wallet Name</h6>
        <EditWalletNameForm
          loading={loading.updateWalletName}
          onSubmit={onEditSubmit}
          initialValues={{ name: fioWallet.name }}
        />
      </>
    );
  };

  const renderPublicKey = () => {
    if (key != null) return null;

    return (
      <>
        <h6 className={classes.settingTitle}>FIO Public Address</h6>
        <PublicAddressBadge
          publicKey={fioWallet.publicKey}
          classNames={{
            badgeContainer: classes.infoBadge,
            value: classes.infoBadgeValue,
          }}
        />
        <LedgerCheckPublicAddress
          className={classes.ledgerShowAddress}
          fioWallet={fioWallet}
        />
      </>
    );
  };

  const renderCancel = () => {
    if (key != null)
      return (
        <SubmitButton onClick={onCancel} text="Close" withBottomMargin={true} />
      );

    return;
  };

  const renderDeleteWalletForm = () => {
    if (key != null) return null;
    return (
      <>
        <h6 className={classes.settingTitle}>Delete Wallet</h6>
        {fioWalletsAmount === 1 && !isLedgerWallet ? (
          <InfoBadge
            className={classes.infoBadge}
            show={true}
            type={BADGE_TYPES.INFO}
            title="Info"
            message="You can delete the last wallet only by deleting the account. If you only need to delete this wallet, please create a new wallet and delete this one."
          />
        ) : (
          <>
            <InfoBadge
              className={classes.infoBadge}
              show={true}
              type={isLedgerWallet ? BADGE_TYPES.INFO : BADGE_TYPES.WARNING}
              title={isLedgerWallet ? 'Private Key' : 'Warning!'}
              message={
                isLedgerWallet
                  ? "However, this wallet's private keys are stored on your Ledger device and can be import again at any time."
                  : isMetamaskWallet
                  ? "However, this wallet's private keys are stored on your MetaMask wallet and can be import again at any time."
                  : 'If you permanently delete your wallet, you will no longer have access to it from the FIO App.'
              }
            />

            <SubmitButton
              className={classes.deleteWalletButton}
              loading={loading.deleteWallet}
              hasSmallPaddings
              hasSmallText
              hasLowHeight
              hasAutoWidth
              withoutMargin
              text="Delete Wallet"
              onClick={() => setShowDeleteConfirm(true)}
            />
          </>
        )}
      </>
    );
  };

  return (
    <>
      <PageTitle link={LINKS.FIO_WALLET_DETAILS} isVirtualPage />
      <Modal
        show={show}
        isSimple={true}
        closeButton={true}
        onClose={onCancel}
        isMiddleWidth={true}
        hasDefaultCloseColor={true}
      >
        <div className={classes.container}>
          <h3 className={classes.title}>
            <b>Wallet Settings </b>
            <span>{isLedgerWallet && <LedgerBadge />}</span>
          </h3>
          {renderNameForm()}
          {renderPublicKey()}
          {!isLedgerWallet && !isMetamaskWallet && renderPasswordForm()}
          {renderKey()}
          {renderCancel()}
          {renderDeleteWalletForm()}
        </div>
      </Modal>

      <DangerModal
        backdrop={false}
        loading={loading.deleteWallet}
        show={showDeleteConfirm && !showPasswordModal}
        onClose={() => setShowDeleteConfirm(false)}
        onActionButtonClick={onDeleteConfirm}
        buttonText="Yes, Delete This Wallet"
        title={`Delete ${fioWallet.name}`}
        showCancel={true}
        cancelButtonText="Cancel"
        subtitle={
          <>
            <span className={classes.balance}>
              Wallet Balance:&nbsp;
              <PriceComponent
                className={classes.balanceValue}
                costFio={balance?.fio}
                costUsdc={balance?.usdc}
              />
            </span>
            {walletFioDomainsCount + walletFioAddressesCount > 0 && (
              <span className={classes.dependenciesCount}>
                {walletFioDomainsCount > 0 && (
                  <span>Domains: {walletFioDomainsCount} Domains</span>
                )}
                {walletFioAddressesCount > 0 && (
                  <span>FIO Handles: {walletFioAddressesCount} Handles</span>
                )}
              </span>
            )}
            <span>
              If you permanently delete your wallet, you will no longer have
              access to it or your crypto/NFT holdings within this wallet.
            </span>
            <br />
            <span className={classes.deleteSecondText}>
              {isLedgerWallet ? (
                'However, this wallet’s private keys are stored on your Ledger device and can be import again at any time.'
              ) : isMetamaskWallet ? (
                'However, this wallet’s private keys are stored on your MetaMask wallet and can be import again at any time.'
              ) : (
                <>
                  Please make sure that you have recorded your private keys for
                  this
                  <span className={classes.walletTextInModal}>
                    &nbsp;wallet&nbsp;
                  </span>
                  to prevent loss of your holdings.
                </>
              )}
            </span>
          </>
        }
      />

      <Modal
        show={showPasswordModal}
        onClose={() => !loading.deleteWallet && setShowPasswordModal(false)}
        closeButton={true}
        backdrop="static"
        isDanger={true}
      >
        <>
          <h3>Confirm Deletion</h3>
          <p>Permanently delete this wallet</p>
          <DeleteWalletForm
            loading={loading.deleteWallet}
            isPrimaryUserProfileType={isPrimaryUserProfileType}
            onSubmit={onDeletePasswordConfirm}
          />
        </>
      </Modal>
    </>
  );
};

export default WalletSettings;
