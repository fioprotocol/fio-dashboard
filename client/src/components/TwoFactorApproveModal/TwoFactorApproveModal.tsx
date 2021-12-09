import React, { useState, useEffect } from 'react';

import EdgeConfirmAction from '../EdgeConfirmAction';
import ModalComponent from './components/ModalComponent';

import apis from '../../api';

import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import { PendingVoucher } from './types';
import { User } from '../../types';
import { SubmitActionParams } from '../EdgeConfirmAction/types';

export const CLICK_TYPE = {
  GRANT_ACCESS: 'grantAccess',
  DENY_ALL: 'denyAll',
};

type Props = {
  user: User;
};

const TwoFactorAuth: React.FC<Props> = props => {
  const { user } = props;
  const { newDeviceTwoFactor = [] } = user || {};

  const [showApprove, toggleApproveModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<{
    voucherId?: string;
    type: string;
  } | null>(null);
  const [newDevicesList, setNewDevicesList] = useState<PendingVoucher[]>([]);
  const [loading, setLoading] = useState(false);

  const getLoginMessages = async () => {
    const res = await apis.edge.loginMessages();
    if (res && user && user.username) {
      const usersPendingVouchers: PendingVoucher[] =
        res[user.username] && res[user.username].pendingVouchers;
      if (!usersPendingVouchers) return;
      const retArr = newDeviceTwoFactor.map(device => {
        const pendingVouchers = usersPendingVouchers.find(
          voucher => voucher.voucherId === device.voucherId,
        );
        const deviceData = { ...pendingVouchers };

        if (pendingVouchers && pendingVouchers.deviceDescription) {
          deviceData.deviceDescription = pendingVouchers.deviceDescription;
        } else {
          deviceData.deviceDescription = device.deviceDescription || 'N/A';
        }

        return deviceData;
      });

      setNewDevicesList(retArr);
    }
  };

  const onCloseApproveModal = () => toggleApproveModal(false);

  const submit = async ({ edgeAccount, data }: SubmitActionParams) => {
    const { voucherId, type } = data;
    try {
      setLoading(true);
      if (type === CLICK_TYPE.GRANT_ACCESS) {
        await edgeAccount.approveVoucher(voucherId);
        await apis.auth.deleteNewDeviceRequest(voucherId);
        setNewDevicesList(
          newDevicesList.filter(device => device.voucherId === voucherId),
        );
      }
      if (type === CLICK_TYPE.DENY_ALL) {
        const promises = newDevicesList.map(async device => [
          await edgeAccount.rejectVoucher(device.voucherId),
          await apis.auth.deleteNewDeviceRequest(device.voucherId),
        ]);
        try {
          await Promise.all(promises);
        } finally {
          setNewDevicesList([]);
        }
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const onSuccess = () => {
    setProcessing(false);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const onClick = (data: { voucherId?: string; type: string }) => {
    setSubmitData(data);
  };

  useEffect(() => {
    if (newDeviceTwoFactor.length > 0) {
      getLoginMessages();
      toggleApproveModal(true);
    }

    if (!user || newDeviceTwoFactor.length === 0) {
      toggleApproveModal(false);
    }
  }, [JSON.stringify(newDeviceTwoFactor)]);

  useEffect(() => {
    if (user) {
      getLoginMessages();
    }
  }, []);

  return (
    <>
      <EdgeConfirmAction
        onSuccess={onSuccess}
        onCancel={onCancel}
        submitAction={submit}
        data={submitData}
        action={CONFIRM_PIN_ACTIONS.TWO_FACTOR_REQUEST}
        processing={processing}
        setProcessing={setProcessing}
        hideProcessing={true}
      />
      <ModalComponent
        show={showApprove}
        onClose={onCloseApproveModal}
        onClick={onClick}
        loading={loading}
        newDevicesList={newDevicesList}
      />
    </>
  );
};

export default TwoFactorAuth;
