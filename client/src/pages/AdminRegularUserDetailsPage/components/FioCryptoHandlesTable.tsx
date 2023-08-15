import React from 'react';

import { TableWrapper } from './TableWrapper/TableWrapper';

import { FioAddressDoublet } from '../../../types';

type Props = {
  fioAddresses: FioAddressDoublet[];
};

export const FioCryptoHandlesTable: React.FC<Props> = props => {
  const { fioAddresses } = props;
  return (
    <TableWrapper title="FIO Addresses">
      <thead>
        <tr>
          <th scope="col">FIO Handle</th>
          <th scope="col">Bundled tx</th>
          <th scope="col">Wallet</th>
        </tr>
      </thead>
      <tbody>
        {fioAddresses?.length ? (
          fioAddresses.map(fioAddress => (
            <tr key={fioAddress.name}>
              <th>{fioAddress.name}</th>
              <th>{fioAddress.remaining}</th>
              <th>{fioAddress.walletName}</th>
            </tr>
          ))
        ) : (
          <tr>
            <th className="mt-3 ml-3">No FCH</th>
            <th></th>
            <th></th>
          </tr>
        )}
      </tbody>
    </TableWrapper>
  );
};
