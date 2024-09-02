import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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

import { waitWalletKeys, waitForEdgeAccountStop } from '../../../util/edge';
import { copyToClipboard, log } from '../../../util/general';

import { ROUTES } from '../../../constants/routes';
import { WALLET_CREATED_FROM } from '../../../constants/common';
import { LINKS } from '../../../constants/labels';
import { USER_PROFILE_TYPE } from '../../../constants/profile';

import apis from '../../../api';

import { updateWalletName } from '../../../redux/account/actions';
import { deleteWallet as deleteWalletAction } from '../../../redux/account/actions';
import { showGenericErrorModal } from '../../../redux/modal/actions';

import { FioWalletDoublet } from '../../../types';
import {
  DeleteWalletFormValues,
  EditWalletNameValues,
  PasswordFormValues,
} from '../types';

import classes from '../styles/WalletDetailsModal.module.scss';
import {
  fioDomains as fioDomainsSelector,
  fioAddresses as fioAddressesSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
} from '../../../redux/fio/selectors';
import { PriceComponent } from '../../../components/PriceComponent';

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

  const balance = fioWalletsBalances.wallets[fioWallet.publicKey].total;

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
  const [currentDeleteValues, setCurrentDeleteValues] = useState<
    DeleteWalletFormValues
  >();

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

  const deleteWallet = async (publicKey: string) => {
    try {
      const res = await apis.account.deleteWallet(publicKey);
      if (res.success) {
        dispatch(deleteWalletAction({ publicKey }));
        history.push(ROUTES.TOKENS, { walletDeleted: true });
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

  const onDeleteConfirmModal = async (values: DeleteWalletFormValues) => {
    setLoading({ ...loading, deleteWallet: true });
    try {
      const account = await apis.edge.login(values.username, values.password);
      if (!account) throw new Error();
    } catch (e) {
      return { password: 'Invalid Password' };
    } finally {
      setLoading({ ...loading, deleteWallet: false });
    }

    if (isPrimaryUserProfileType) {
      setCurrentDeleteValues(values);
    }
    setShowDeleteConfirm(true);
  };

  const onDeleteConfirm = async () => {
    setLoading({ ...loading, deleteWallet: true });

    const { username, password } = currentDeleteValues || {};

    try {
      if (isPrimaryUserProfileType && isEdgeWallet) {
        const account = await apis.edge.login(username, password);
        await apis.edge.deleteWallet(account, fioWallet.edgeId);
      }

      await deleteWallet(fioWallet.publicKey);
    } catch (err) {
      setLoading({ ...loading, deleteWallet: false });
      log.error(err);
    }
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
              <div className={classes.publicKey}>{key}</div>
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
                  ? 'Your private key for this wallet is stored on your ledger device. Once Deleted, it can be added back at any time.'
                  : isMetamaskWallet
                  ? 'Your private key for this wallet is stored on your MetaMask wallet. Once Deleted, it can be added back at any time.'
                  : 'Record your private key as this wallet will be permanently lost.'
              }
            />
            <DeleteWalletForm
              loading={loading.deleteWallet}
              isPrimaryUserProfileType={isPrimaryUserProfileType}
              onSubmit={onDeleteConfirmModal}
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
        show={showDeleteConfirm}
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
                costFio={balance.fio}
                costUsdc={balance.usdc}
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
    </>
  );
};

export default WalletSettings;
