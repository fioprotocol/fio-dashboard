import React from 'react';

import { TableWrapper } from './TableWrapper/TableWrapper';

import { FioWalletDoublet } from '../../../types';

type Props = {
  fioWallets: FioWalletDoublet[];
};

export const WalletsTable: React.FC<Props> = props => {
  const { fioWallets } = props;

  return (
    <TableWrapper title="FIO Wallets">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Public Key</th>
          <th scope="col">Balance</th>
          <th scope="col">Failed Edge Sync</th>
        </tr>
      </thead>
      <tbody>
        {fioWallets?.length ? (
          fioWallets.map(fioWallet => (
            <tr key={fioWallet.publicKey}>
              <th>{fioWallet.name}</th>
              <th>
                <a
                  href={`${process.env.REACT_APP_FIO_BLOCKS_BASE_URL}key/${fioWallet.publicKey}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {fioWallet.publicKey}
                </a>
              </th>
              <th>{fioWallet.balance}</th>
              <th
                className={
                  fioWallet.failedSyncedWithEdge
                    ? 'text-danger'
                    : 'text-success'
                }
              >
                {fioWallet.failedSyncedWithEdge ? 'FAILED SYNC' : 'OK'}
              </th>
            </tr>
          ))
        ) : (
          <tr>
            <th className="mt-3 ml-3">No Wallets</th>
            <th></th>
            <th></th>
          </tr>
        )}
      </tbody>
    </TableWrapper>
  );
};
