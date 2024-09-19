import React, { useEffect, useState } from 'react';

import { RequestStatus } from '@fioprotocol/fiosdk';

import FioRecordDetailedActionButtons from './FioRecordDetailedActionButtons';
import FioRecordPendingActionButtons from './FioRecordPendingActionButtons';
import FioRecordFieldsList from './FioRecordFieldsList';
import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';

import { FIO_RECORD_TYPES } from '../constants';

import { useFioAddresses } from '../../../util/hooks';

import { FioRecordViewKeysProps, FioRecordViewDecrypted } from '../types';
import { FioAddressDoublet, FioWalletDoublet } from '../../../types';

import classes from '../styles/FioRecordDetailedItem.module.scss';

type Props = {
  fieldsList: FioRecordViewKeysProps[];
  fioRecordDecrypted?: FioRecordViewDecrypted | null;
  fioRecordType: string;
  fioRecordDetailedType: string;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

const FioRecordDetailedItem: React.FC<Props> = props => {
  const {
    fieldsList,
    fioRecordDecrypted,
    fioRecordType,
    fioWallet,
    fioRecordDetailedType,
    onCloseModal,
  } = props;

  const [error, setError] = useState<string | null>(null);
  const [
    selectedAddress,
    setSelectedAddress,
  ] = useState<FioAddressDoublet | null>(null);

  const [walletFioAddresses, isLoading] = useFioAddresses(
    fioWallet && fioWallet.publicKey,
  );

  useEffect(() => {
    if (isLoading) setError(null);
    const fch =
      fioRecordType === FIO_RECORD_TYPES.RECEIVED
        ? fioRecordDecrypted?.fioRecord?.to
        : fioRecordDecrypted?.fioRecord?.from;
    if (!isLoading && fch) {
      const address = walletFioAddresses.find(({ name }) => name === fch);
      setSelectedAddress(address);
      setError(
        !address ? 'This FIO Handle no longer exists in current wallet.' : null,
      );
    }
  }, [fioRecordDecrypted, fioRecordType, walletFioAddresses, isLoading]);

  if (!fioRecordDecrypted) return null;

  const renderActionButtons = () =>
    !!selectedAddress &&
    fioRecordDecrypted.fioRecord.status === RequestStatus.pending &&
    fioRecordType === FIO_RECORD_TYPES.RECEIVED ? (
      <FioRecordDetailedActionButtons
        fioRecordDecrypted={fioRecordDecrypted}
        fioWallet={fioWallet}
        fioRecordType={fioRecordType}
        onCloseModal={onCloseModal}
      />
    ) : (
      !!selectedAddress &&
      fioRecordDecrypted.fioRecord.status === RequestStatus.pending &&
      fioRecordType === FIO_RECORD_TYPES.SENT && (
        <FioRecordPendingActionButtons
          fioRecordDecrypted={fioRecordDecrypted}
          fioWallet={fioWallet}
          fioRecordType={fioRecordType}
          onCloseModal={onCloseModal}
        />
      )
    );
  return (
    <div className={classes.fieldsContainer}>
      <FioRecordFieldsList
        fieldsList={fieldsList}
        fioRecordDecrypted={fioRecordDecrypted}
        fioRecordDetailedType={fioRecordDetailedType}
        fioRecordType={fioRecordType}
      />
      {!isLoading &&
        error &&
        fioRecordDecrypted.fioRecord.status === RequestStatus.pending &&
        ((fioRecordType === FIO_RECORD_TYPES.RECEIVED &&
          fioRecordDecrypted?.fioRecord?.to) ||
          (fioRecordType === FIO_RECORD_TYPES.SENT &&
            fioRecordDecrypted?.fioRecord?.from)) && (
          <div className={classes.infoBadge}>
            <InfoBadge
              isOrange
              message={error || ''}
              title={`${fioRecordDecrypted.fioRecord.to}`}
            />
          </div>
        )}
      {renderActionButtons()}
    </div>
  );
};

export default FioRecordDetailedItem;
