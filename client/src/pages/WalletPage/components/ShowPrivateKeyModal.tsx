import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import Modal from '../../../components/Modal/Modal';
import InfoBadge from '../../../components/InfoBadge/InfoBadge';
import CopyTooltip from '../../../components/CopyTooltip';
import CancelButton from '../../../components/common/CancelButton/CancelButton';
import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import PasswordForm from './PasswordForm';

import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';

import { waitWalletKeys, waitForEdgeAccountStop } from '../../../util/edge';
import { copyToClipboard } from '../../../util/general';

import apis from '../../../api';

import { FioWalletDoublet } from '../../../types';
import { EditWalletNameValues, PasswordFormValues } from '../types';

import classes from '../styles/WalletDetailsModal.module.scss';
import EditWalletNameForm from './EditWalletNameForm';
import { updateWalletName } from '../../../redux/account/actions';
import { showGenericErrorModal } from '../../../redux/modal/actions';

type Props = {
  show: boolean;
  fioWallet: FioWalletDoublet;
  onClose: () => void;
};

const ShowPrivateKeyModal: React.FC<Props> = props => {
  const { show, fioWallet, onClose } = props;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [key, setKey] = useState<string | null>(null);

  const [currentValues, setCurrentValues] = useState<EditWalletNameValues>({
    name: fioWallet.name,
  });
  const [processing, setProcessing] = useState(false);

  const onEditSubmit = (values: EditWalletNameValues) => {
    setCurrentValues(values);
    edit(values.name);
  };

  console.log(currentValues, processing, onEditSubmit);

  const edit = async (name: string) => {
    setProcessing(true);
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

    setProcessing(false);
  };

  useEffect(() => {
    setKey(null);
    return () => setKey(null);
  }, []);

  useEffect(() => {
    if (!show) setKey(null);
  }, [show]);

  const onConfirm = async (values: PasswordFormValues) => {
    setLoading(true);

    const { username, password } = values;
    let account;
    try {
      account = await apis.edge.login(username, password);
      if (!account) throw new Error();
    } catch (e) {
      setLoading(false);
      return { password: 'Invalid Password' };
    }

    try {
      const keys = await waitWalletKeys(account);
      await waitForEdgeAccountStop(account);
      if (keys[fioWallet.edgeId] != null && keys[fioWallet.edgeId].private) {
        setKey(keys[fioWallet.edgeId].private);
      }

      setLoading(false);

      return {};
    } catch (e) {
      setLoading(false);
      return { password: 'Something went wrong, please try again later' };
    }
  };

  const onCancel = () => {
    if (!loading) onClose();
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
                <FontAwesomeIcon
                  className={classes.icon}
                  icon={{ prefix: 'far', iconName: 'copy' }}
                />
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
        <PasswordForm loading={loading} onSubmit={onConfirm} />
      </>
    );
  };

  const renderNameForm = () => {
    if (key != null) return null;
    return (
      <>
        <h6 className={classes.settingTitle}>Edit Wallet Name</h6>
        <EditWalletNameForm
          loading={loading}
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

    return (
      <CancelButton onClick={onCancel} isBlack={true} withBottomMargin={true} />
    );
  };

  return (
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

        {renderPasswordForm()}
        {renderKey()}
        {renderCancel()}
      </div>
    </Modal>
  );
};

export default ShowPrivateKeyModal;
