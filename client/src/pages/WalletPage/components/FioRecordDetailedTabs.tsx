import React from 'react';

import { RequestStatus } from '@fioprotocol/fiosdk';

import TabsContainer from '../../../components/Tabs/TabsContainer';
import Tabs from '../../../components/Tabs/Tabs';
import FioRecordDetailedItem from './FioRecordDetailedItem';

import {
  FIO_REQUEST_FIELDS_LIST,
  FIO_RECORD_DETAILED_TYPE,
  FIO_RECORD_TYPES,
} from '../constants';

import { FioRecordViewDecrypted, FioRecordViewKeysProps } from '../types';

import { FioWalletDoublet } from '../../../types';

import classes from '../styles/FioRecordDetailedModal.module.scss';

type Props = {
  fioRecordDecrypted: FioRecordViewDecrypted;
  fioRecordPaymentDataDecrypted?: FioRecordViewDecrypted;
  requestFieldsList: FioRecordViewKeysProps[];
  fioRecordType: string;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

const DetailedTabsList = [
  {
    eventKey: 'requestInformation',
    title: 'Request Information',
    renderTab: (props: Props) => (
      <>
        <FioRecordDetailedItem
          {...props}
          fieldsList={props.requestFieldsList}
          fioRecordDetailedType={FIO_RECORD_DETAILED_TYPE.REQUEST}
        />
      </>
    ),
  },
  {
    eventKey: 'Payment information',
    title: 'Payment information',
    renderTab: (props: Props) => (
      <FioRecordDetailedItem
        {...props}
        fieldsList={FIO_REQUEST_FIELDS_LIST.PAYMENT_LIST}
        fioRecordType={FIO_RECORD_TYPES.DATA}
        fioRecordDetailedType={FIO_RECORD_DETAILED_TYPE.PAYMENT}
        fioRecordDecrypted={props.fioRecordPaymentDataDecrypted}
      />
    ),
  },
];

const FioRecordDetailedTabs: React.FC<Props> = props => {
  const { fioRecordDecrypted } = props;
  if (!fioRecordDecrypted) return null;

  if (fioRecordDecrypted.fioRecord.status !== RequestStatus.paid)
    return (
      <>
        <h5 className={classes.subtitle}>{DetailedTabsList[0].title}</h5>
        <FioRecordDetailedItem
          {...props}
          fieldsList={props.requestFieldsList}
          fioRecordDetailedType={FIO_RECORD_DETAILED_TYPE.REQUEST}
        />
      </>
    );

  return (
    <div>
      <TabsContainer defaultActiveKey={DetailedTabsList[0].eventKey}>
        <Tabs
          list={DetailedTabsList}
          showTabBorder={true}
          tabProps={{ ...props }}
        />
      </TabsContainer>
    </div>
  );
};

export default FioRecordDetailedTabs;
