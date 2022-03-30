import React, { useEffect, useState } from 'react';

import FioRecordDetailedActionButtons from './FioRecordDetailedActionButtons';
import FioRecordFieldsList from './FioRecordFieldsList';
import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';

import { FIO_REQUEST_STATUS_TYPES } from '../../../constants/fio';
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
    if (!isLoading && fioRecordDecrypted?.fioRecord?.to) {
      const address = walletFioAddresses.find(
        ({ name }) => name === fioRecordDecrypted.fioRecord.to,
      );
      setSelectedAddress(address);
      setError(
        !address
          ? 'This Fio Crypto Handle no longer exists in current wallet.'
          : null,
      );
    }
  }, [fioRecordDecrypted, walletFioAddresses, isLoading]);

  if (!fioRecordDecrypted) return null;

  const renderActionButtons = () =>
    !!selectedAddress &&
    fioRecordDecrypted.fioRecord.status === FIO_REQUEST_STATUS_TYPES.PENDING &&
    fioRecordType === FIO_RECORD_TYPES.RECEIVED && (
      <FioRecordDetailedActionButtons
        fioRecordDecrypted={fioRecordDecrypted}
        fioWallet={fioWallet}
        fioRecordType={fioRecordType}
        onCloseModal={onCloseModal}
      />
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
        fioRecordDecrypted.fioRecord.status ===
          FIO_REQUEST_STATUS_TYPES.PENDING &&
        fioRecordType === FIO_RECORD_TYPES.RECEIVED &&
        fioRecordDecrypted?.fioRecord?.to && (
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
