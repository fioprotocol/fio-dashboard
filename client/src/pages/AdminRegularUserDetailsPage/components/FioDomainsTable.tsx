import React from 'react';

import DomainStatusBadge from '../../../components/Badges/DomainStatusBadge/DomainStatusBadge';

import { TableWrapper } from './TableWrapper/TableWrapper';

import { formatDateToLocale } from '../../../helpers/stringFormatters';

import { DOMAIN_STATUS } from '../../../constants/common';

import { FioDomainDoublet } from '../../../types';

type Props = {
  fioDomains: FioDomainDoublet[];
};

export const FioDomainsTable: React.FC<Props> = props => {
  const { fioDomains } = props;

  return (
    <TableWrapper title="FIO Domains">
      <thead>
        <tr>
          <th scope="col">Domains</th>
          <th scope="col">Expiration</th>
          <th scope="col">Status</th>
          <th scope="col">Wallet</th>
        </tr>
      </thead>
      <tbody>
        {fioDomains?.length ? (
          fioDomains.map(fioDomain => (
            <tr key={fioDomain.name}>
              <th>{fioDomain.name}</th>
              <th>{formatDateToLocale(fioDomain.expiration.toString())}</th>
              <th>
                <DomainStatusBadge
                  status={
                    fioDomain.isPublic
                      ? DOMAIN_STATUS.PUBLIC
                      : DOMAIN_STATUS.PRIVATE
                  }
                />
              </th>
              <th>{fioDomain.walletName}</th>
            </tr>
          ))
        ) : (
          <tr>
            <th className="mt-3 ml-3">No Domains</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        )}
      </tbody>
    </TableWrapper>
  );
};
