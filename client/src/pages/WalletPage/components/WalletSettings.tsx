import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
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
    if (isPrimaryUserProfileType) {
      setCurrentDeleteValues(values);
    }
    setShowDeleteConfirm(true);
  };

  const onDeleteConfirm = async () => {
    setLoading({ ...loading, deleteWallet: true });

    const { username, password } = currentDeleteValues || {};

    try {
      if (isPrimaryUserProfileType) {
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
          show={true}
          type={BADGE_TYPES.INFO}
          title="Warning"
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
        <h6 className={classes.settingTitle}>
          Delete Wallet
          {isLedgerWallet && (
            <span>
              <LedgerBadge />
            </span>
          )}
        </h6>
        {fioWalletsAmount === 1 && !isLedgerWallet ? (
          <InfoBadge
            className="mb-4"
            show={true}
            type={BADGE_TYPES.INFO}
            title="Info"
            message="You can delete the last wallet only by deleting the account. If you only need to delete this wallet, please create a new wallet and delete this one."
          />
        ) : (
          <>
            <InfoBadge
              show={true}
              type={isLedgerWallet ? BADGE_TYPES.INFO : BADGE_TYPES.WARNING}
              title={isLedgerWallet ? 'Private Key' : 'Warning'}
              message={
                <>
                  {isLedgerWallet ? (
                    <span>
                      Your private key for this wallet is stored on your ledger
                      device. Once Deleted, it can be added back at any time.
                    </span>
                  ) : isMetamaskWallet ? (
                    <span>
                      Your private key for this wallet is stored on your
                      MetaMask wallet. Once Deleted, it can be added back at any
                      time.
                    </span>
                  ) : (
                    <span className={classes.badgeBoldText}>
                      Record your private key as this wallet will be permanently
                      lost.
                    </span>
                  )}
                </>
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
          <h3 className={classes.title}>Wallet Settings</h3>
          {renderNameForm()}
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
        title="Are You Sure?"
        showCancel={true}
        cancelButtonText="Cancel"
        subtitle={
          <>
            <span>
              If you permanently delete your wallet, you will no longer have
              access to it from the FIO App.
            </span>
            <br />
            {isLedgerWallet ? (
              <span className={classes.deleteSecondText}>
                <b>
                  However, this wallet’s private keys are stored on your Ledger
                  device and can be import again at any time.
                </b>
              </span>
            ) : isMetamaskWallet ? (
              <span className={classes.deleteSecondText}>
                <b>
                  However, this wallet’s private keys are stored on your
                  MetaMask wallet and can be import again at any time.
                </b>
              </span>
            ) : (
              <span className={classes.deleteSecondText}>
                <b>
                  Please make sure that you have recorded your private keys for
                  this{' '}
                  <span className={classes.walletTextInModal}>
                    {fioWallet?.name || 'wallet'}
                  </span>{' '}
                  to prevent loss of your holdings.
                </b>
              </span>
            )}
          </>
        }
      />
    </>
  );
};

export default WalletSettings;
