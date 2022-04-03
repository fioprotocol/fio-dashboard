import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { BADGE_TYPES } from '../../../../../components/Badge/Badge';
import EdgeConfirmAction from '../../../../../components/EdgeConfirmAction';

import { log } from '../../../../../util/general';

import { CONFIRM_PIN_ACTIONS } from '../../../../../constants/common';

import { SubmitActionParams } from '../../../../../components/EdgeConfirmAction/types';

import classes from '../styles/BackupCode.module.scss';

const BackupCode: React.FC = () => {
  const [show, toggleShow] = useState(false);
  const [submitData, setSubmitData] = useState<boolean | null>(null);
  const [processing, setProcessing] = useState(false);
  const [backupCode, setBackupCode] = useState<string | null>();

  const handleBackup = () => {
    if (!show) {
      setSubmitData(true);
    } else {
      toggleShow(false);
      setSubmitData(null);
    }
  };

  const onSuccess = () => {
    setProcessing(false);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const submitAction = async ({ edgeAccount }: SubmitActionParams) => {
    try {
      setBackupCode(edgeAccount.otpKey);
      toggleShow(true);
    } catch (e) {
      log.error(e);
    }
  };

  const renderCircles = () => {
    const circles = [];
    for (let i = 0; i < 8; i++) {
      circles.push(
        <FontAwesomeIcon icon="circle" className={classes.circle} key={i} />,
      );
    }
    return circles;
  };

  const renderBackupCode = () => (
    <div className={classes.backupCode}>{backupCode}</div>
  );

  const renderResults = () => {
    return backupCode && show ? renderBackupCode() : renderCircles();
  };

  return (
    <div className={classes.container}>
      <p className={classes.title}>2FA Code</p>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        {renderResults()}
        <FontAwesomeIcon
          icon={!show ? 'eye' : 'eye-slash'}
          className={classes.showButton}
          onClick={handleBackup}
        />
      </Badge>
      <EdgeConfirmAction
        data={submitData}
        processing={processing}
        setProcessing={setProcessing}
        action={CONFIRM_PIN_ACTIONS.SHOW_BACKUP_CODE}
        onSuccess={onSuccess}
        onCancel={onCancel}
        submitAction={submitAction}
        hideProcessing={true}
      />
    </div>
  );
};

export default BackupCode;
