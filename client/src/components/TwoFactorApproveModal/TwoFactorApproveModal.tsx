import React, { useState, useEffect } from 'react';

import EdgeConfirmAction from '../EdgeConfirmAction';
import ModalComponent from './components/ModalComponent';

import apis from '../../api';

import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import { minWaitTimeFunction } from '../../utils';
import { log } from '../../util/general';

import { ACTION_TYPE, NEW_DEVICE_REQUEST_STATUS } from './constants';

import { PendingVoucher } from './types';
import { User } from '../../types';
import { SubmitActionParams } from '../EdgeConfirmAction/types';

type Props = {
  user: User;
  loadProfile: () => void;
};

const TwoFactorAuth: React.FC<Props> = props => {
  const { user, loadProfile } = props;
  const { newDeviceTwoFactor = [] } = user || {};

  const [showApprove, toggleApproveModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<{
    voucherId?: string;
    type: string;
  } | null>(null);
  const [newDevicesList, setNewDevicesList] = useState<PendingVoucher[]>([]);
  const [loading, setLoading] = useState({});

  const getLoginMessages = async () => {
    const res = await apis.edge.loginMessages();
    if (res && user && user.username) {
      const usersPendingVouchers: PendingVoucher[] =
        res[user.username] && res[user.username].pendingVouchers;
      if (!usersPendingVouchers) return;
      const retArr = newDeviceTwoFactor
        .filter(device => device.status === NEW_DEVICE_REQUEST_STATUS.REQUESTED)
        .map(device => {
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
      setLoading(
        retArr.reduce(
          (acc, device) => ({ ...acc, [device.voucherId]: false }),
          {},
        ),
      );
      setNewDevicesList(retArr as PendingVoucher[]);
    }
  };

  const submit = async ({ edgeAccount, data }: SubmitActionParams) => {
    const { voucherId, type } = data;
    try {
      setLoading(prevState => ({ ...prevState, [voucherId]: true }));
      if (type === ACTION_TYPE.GRANT_ACCESS) {
        await minWaitTimeFunction(
          () => edgeAccount.approveVoucher(voucherId),
          1000,
        );
        await apis.auth.deleteNewDeviceRequest(voucherId);
        loadProfile();
      }
      if (type === ACTION_TYPE.DENY_ALL) {
        const promises = newDevicesList.map(device => [
          edgeAccount.rejectVoucher(device.voucherId),
          apis.auth.updateNewDevice({
            voucherId: device.voucherId,
            status: NEW_DEVICE_REQUEST_STATUS.REJECTED,
          }),
        ]);
        try {
          await Promise.all(promises);
          toggleApproveModal(false);
        } finally {
          loadProfile();
        }
      }
    } catch (e) {
      log.error(e);
    }
    setLoading(prevState => ({ ...prevState, [voucherId]: false }));
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
    if (
      newDeviceTwoFactor.length > 0 &&
      newDeviceTwoFactor.some(
        device => device.status === NEW_DEVICE_REQUEST_STATUS.REQUESTED,
      )
    ) {
      getLoginMessages();
      toggleApproveModal(true);
    }

    if (
      !user ||
      newDeviceTwoFactor.length === 0 ||
      newDeviceTwoFactor.every(
        device => device.status === NEW_DEVICE_REQUEST_STATUS.REJECTED,
      )
    ) {
      toggleApproveModal(false);
      setNewDevicesList([]);
      setLoading({});
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
        onClick={onClick}
        loading={loading}
        newDevicesList={newDevicesList}
      />
    </>
  );
};

export default TwoFactorAuth;
