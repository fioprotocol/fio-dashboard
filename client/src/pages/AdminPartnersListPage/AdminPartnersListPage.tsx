import React, { useState, useCallback } from 'react';
import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from '../../components/Loader/Loader';
import { PartnerModal } from './components/updatePartner/PartnerModal';

import { REF_PROFILE_TYPE } from '../../constants/common';

import { formatDateToLocale } from '../../helpers/stringFormatters';
import usePagination from '../../hooks/usePagination';
import apis from '../../api';
import { log } from '../../util/general';

import { Props } from './types';
import { RefProfile } from '../../types';

import classes from './AdminPartnersListPage.module.scss';

const AdminPartnersListPage: React.FC<Props> = props => {
  const { loading, partnersList, getPartnersList } = props;
  const [showPartnerModal, setShowPartnerModal] = useState<boolean>(false);
  const [selectedPartner, setSelectedPartner] = useState<Partial<RefProfile>>(
    null,
  );
  const [partnerActionLoading, setPartnerActionLoading] = useState<boolean>(
    false,
  );

  const { paginationComponent, refresh } = usePagination(getPartnersList);

  const onAddPartner = useCallback(() => {
    setSelectedPartner({
      type: REF_PROFILE_TYPE.REF,
      regRefCode: '',
      regRefApiToken: '',
      settings: {
        domains: [''],
        premiumDomains: [],
        allowCustomDomain: false,
        actions: {
          SIGNNFT: {},
          REG: {},
        },
        img: '',
        link: '',
      },
    });
    setShowPartnerModal(true);
  }, []);
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
          if (
            !partner.settings.domains.includes(
              partner.settings.preselectedDomain,
            )
          ) {
            partner.settings.preselectedDomain = partner.settings.domains[0];
          }
        } else {
          partner.settings.preselectedDomain = null;
        }
        if (partner.type === REF_PROFILE_TYPE.AFFILIATE) {
          partner.settings = {
            domains: [],
            premiumDomains: [],
            allowCustomDomain: true,
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

  return (
    <>
      <div className={classes.tableContainer}>
        <Button className="mb-4" onClick={onAddPartner}>
          <FontAwesomeIcon icon="plus-square" className="mr-2" /> Add New
          Partner
        </Button>
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

        {loading && <Loader />}
      </div>

      <PartnerModal
        initialValues={selectedPartner}
        show={showPartnerModal}
        onSubmit={savePartner}
        loading={partnerActionLoading}
        onClose={closeModal}
      />
    </>
  );
};

export default AdminPartnersListPage;
