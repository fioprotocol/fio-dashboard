import React, { useState, useEffect, useCallback } from 'react';

import EdgeConfirmAction from '../EdgeConfirmAction';
import ModalComponent from './components/ModalComponent';

import apis from '../../api';

import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import { minWaitTimeFunction } from '../../utils';
import { log } from '../../util/general';

import { ACTION_TYPE, NEW_DEVICE_REQUEST_STATUS } from './constants';

import { NewDeviceVoucher, PendingVoucher } from './types';
import { User } from '../../types';
import { SubmitActionParams } from '../EdgeConfirmAction/types';

type Props = {
  isAuthenticated: boolean;
  user: User;
  loadProfile: ({
    shouldHandleUsersFreeCart,
  }: {
    shouldHandleUsersFreeCart?: boolean;
  }) => void;
};

const TwoFactorAuth: React.FC<Props> = props => {
  const { isAuthenticated, user, loadProfile } = props;
  const { newDeviceTwoFactor = [] } = user || {};

  const [showApprove, toggleApproveModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<{
    voucherId?: string;
    type: string;
  } | null>(null);
  const [newDevicesList, setNewDevicesList] = useState<NewDeviceVoucher[]>([]);
  const [loading, setLoading] = useState({});

  const username = user?.username;

  const deleteUndefinedFromEdgeNewDeviceRequest = useCallback(
    async (voucherId: string) => {
      await apis.auth.deleteNewDeviceRequest(voucherId);
    },
    [],
  );

  const getLoginMessages = useCallback(async () => {
    const res = await apis.edge.loginMessages();

    if (res && username) {
      const usersPendingVouchers: PendingVoucher[] =
        res[username] && res[username].pendingVouchers;
      const newDeviceTwoFactorRequested = newDeviceTwoFactor.filter(
        device => device.status === NEW_DEVICE_REQUEST_STATUS.REQUESTED,
      );

      if (!usersPendingVouchers.length) {
        toggleApproveModal(false);
        try {
          await Promise.all(
            newDeviceTwoFactorRequested.map(async device =>
              deleteUndefinedFromEdgeNewDeviceRequest(device.voucherId),
            ),
          );
        } catch (e) {
          log.error(e);
        }
        return;
      }

      const newDeviceTwoFactorRequestList: NewDeviceVoucher[] = [];
      const undefinedTwoFactorRequestList: string[] = [];

      newDeviceTwoFactorRequested.forEach(device => {
        const pendingVouchers = usersPendingVouchers.find(
          voucher => voucher.voucherId === device.voucherId,
        );

        if (!pendingVouchers) {
          undefinedTwoFactorRequestList.push(device.voucherId);
          return;
        }

        const deviceData = { ...pendingVouchers, id: device.id };

        if (pendingVouchers && pendingVouchers.deviceDescription) {
          deviceData.deviceDescription = pendingVouchers.deviceDescription;
        } else {
          deviceData.deviceDescription = device.deviceDescription || 'N/A';
        }

        newDeviceTwoFactorRequestList.push(deviceData);
      });

      setLoading(
        newDeviceTwoFactorRequestList.reduce(
          (acc, device) => ({ ...acc, [device.voucherId]: false }),
          {},
        ),
      );
      setNewDevicesList(newDeviceTwoFactorRequestList);

      if (undefinedTwoFactorRequestList.length > 0) {
        try {
          await Promise.all(
            undefinedTwoFactorRequestList.map(async voucherId =>
              deleteUndefinedFromEdgeNewDeviceRequest(voucherId),
            ),
          );
        } catch (e) {
          log.error(e);
        }
      }
    }
  }, [deleteUndefinedFromEdgeNewDeviceRequest, newDeviceTwoFactor, username]);

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
        loadProfile({});
      }
      if (type === ACTION_TYPE.DENY_ALL) {
        const promises = newDevicesList.map(device => [
          edgeAccount.rejectVoucher(device.voucherId),
          apis.auth.updateNewDevice({
            id: device.id,
            status: NEW_DEVICE_REQUEST_STATUS.REJECTED,
          }),
        ]);
        try {
          await Promise.all(promises);
          toggleApproveModal(false);
        } finally {
          loadProfile({});
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
      (!isAuthenticated ||
        newDeviceTwoFactor.length === 0 ||
        newDeviceTwoFactor.every(
          device => device.status === NEW_DEVICE_REQUEST_STATUS.REJECTED,
        )) &&
      showApprove
    ) {
      toggleApproveModal(false);
      setNewDevicesList([]);
      setLoading({});
    }
  }, [getLoginMessages, newDeviceTwoFactor, isAuthenticated, showApprove]);

  useEffect(() => {
    if (isAuthenticated) {
      getLoginMessages();
    }
  }, [getLoginMessages, isAuthenticated]);

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
