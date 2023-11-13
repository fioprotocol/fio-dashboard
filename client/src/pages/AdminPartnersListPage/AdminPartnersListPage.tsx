import React, { useState, useCallback } from 'react';
import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from '../../components/Loader/Loader';
import { PartnerModal } from './components/updatePartner/PartnerModal';
import CustomDropdown from '../../components/CustomDropdown';

import {
  REF_PROFILE_TYPE,
  REF_PROFILE_TYPES_FILTER_OPTIONS,
} from '../../constants/common';
import { FIO_ACCOUNT_TYPES } from '../../constants/fio';
import { DEFAULT_LIMIT } from '../../hooks/usePagination';

import useEffectOnce from '../../hooks/general';
import { formatDateToLocale } from '../../helpers/stringFormatters';
import usePagination from '../../hooks/usePagination';
import apis from '../../api';
import { log } from '../../util/general';

import { Props } from './types';
import { RefProfile } from '../../types';

import classes from './AdminPartnersListPage.module.scss';

const AdminPartnersListPage: React.FC<Props> = props => {
  const {
    fioAccountLoading,
    fioAccountsProfilesList,
    loading,
    partnersList,
    getFioAccountsProfilesList,
    getPartnersList,
  } = props;

  const [filters, setFilters] = useState<Partial<RefProfile>>({ type: '' });
  const [showPartnerModal, setShowPartnerModal] = useState<boolean>(false);
  const [selectedPartner, setSelectedPartner] = useState<Partial<RefProfile>>(
    null,
  );
  const [partnerActionLoading, setPartnerActionLoading] = useState<boolean>(
    false,
  );

  const { paginationComponent, refresh } = usePagination(
    getPartnersList,
    DEFAULT_LIMIT,
    filters,
  );

  const handleChangeTypeFilter = useCallback((newValue: string) => {
    setFilters(filters => ({
      ...filters,
      type: newValue,
    }));
  }, []);

  const onAddPartner = useCallback(() => {
    setSelectedPartner({
      type: REF_PROFILE_TYPE.REF,
      settings: {
        domains: [
          {
            name: '',
            isPremium: false,
            rank: 1,
            isFirstRegFree: false,
          },
        ],
        gatedRegistration: {
          isOn: false,
          params: {
            asset: 'NFT',
            chainId: '5',
            contractAddress: '',
          },
        },
        actions: {
          SIGNNFT: {},
          REG: {},
        },
        img: '',
        link: '',
      },
      freeFioAccountProfileId: fioAccountsProfilesList.find(
        fioAccountsProfile =>
          fioAccountsProfile.accountType === FIO_ACCOUNT_TYPES.FREE,
      )?.id,
      paidFioAccountProfileId: fioAccountsProfilesList.find(
        fioAccountsProfile =>
          fioAccountsProfile.accountType === FIO_ACCOUNT_TYPES.PAID,
      )?.id,
    });
    setShowPartnerModal(true);
  }, [fioAccountsProfilesList]);
  const onEditPartner = useCallback((partner: RefProfile) => {
    setSelectedPartner(partner);
    setShowPartnerModal(true);
  }, []);
  const closeModal = useCallback(() => {
    setShowPartnerModal(false);
    setSelectedPartner(null);
  }, []);
  const savePartner = useCallback(
    async (partner: RefProfile) => {
      setPartnerActionLoading(true);
      try {
        // image it's temporary field that used for image upload
        // @ts-ignore
        delete partner.image;
        if (partner.settings?.domains.length) {
          const hasPreselectedDomain = partner.settings.domains.find(
            domain => domain.name === partner.settings.preselectedDomain,
          );
          if (!hasPreselectedDomain) {
            partner.settings.preselectedDomain =
              partner.settings.domains[0].name;
          }
        } else {
          partner.settings.preselectedDomain = null;
        }
        if (partner.type === REF_PROFILE_TYPE.AFFILIATE) {
          partner.settings = {
            domains: [],
          };
        }
        partner.title = partner.title || '';
        partner.subTitle = partner.subTitle || '';
        partner.tpid = partner.tpid || '';
        if (partner.id) {
          await apis.admin.editPartner(partner);
        } else {
          await apis.admin.createPartner(partner);
        }
        await refresh();
        closeModal();
      } catch (err) {
        if (err.fields) {
          return err.fields;
        } else {
          log.error(err);
        }
      } finally {
        setPartnerActionLoading(false);
      }
    },
    [refresh, closeModal],
  );

  useEffectOnce(() => {
    getFioAccountsProfilesList();
  }, []);

  return (
    <>
      <div className={classes.tableContainer}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="mr-4">
            <Button onClick={onAddPartner}>
              <FontAwesomeIcon icon="plus-square" className="mr-2" /> Add New
              Partner
            </Button>
          </div>

          <div>
            <div className="d-flex align-items-center">
              Filter Type:&nbsp;
              <CustomDropdown
                value={filters.type}
                options={REF_PROFILE_TYPES_FILTER_OPTIONS}
                onChange={handleChangeTypeFilter}
                isDark
                withoutMarginBottom
                fitContentWidth
                isSmall
                placeholder="All"
              />
            </div>
          </div>
        </div>
        <Table className="table" striped={true}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Referral Code</th>
              <th scope="col">Created</th>
            </tr>
          </thead>
          <tbody>
            {partnersList?.length
              ? partnersList.map((partner, i) => (
                  <tr
                    key={partner.id}
                    className={classes.userItem}
                    onClick={() => onEditPartner(partner)}
                  >
                    <th>{i + 1}</th>
                    <th>{partner.label}</th>
                    <th>{partner.code}</th>
                    <th>
                      {partner.createdAt
                        ? formatDateToLocale(partner.createdAt)
                        : null}
                    </th>
                  </tr>
                ))
              : null}
          </tbody>
        </Table>

        {paginationComponent}

        {(loading || fioAccountLoading) && <Loader />}
      </div>

      <PartnerModal
        initialValues={selectedPartner}
        show={showPartnerModal}
        fioAccountsProfilesList={fioAccountsProfilesList}
        onSubmit={savePartner}
        loading={partnerActionLoading}
        onClose={closeModal}
      />
    </>
  );
};

export default AdminPartnersListPage;
