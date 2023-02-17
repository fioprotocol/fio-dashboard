import React, { useCallback, useState } from 'react';

import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from '../../components/Loader/Loader';
import FioApiUrlModal from './components/createNewFioApiUrl/FioApiUrlModal';

import apis from '../../api';
import { log } from '../../util/general';
import { formatDateToLocale } from '../../helpers/stringFormatters';
import usePagination from '../../hooks/usePagination';

import { FormValuesProps, FormValuesEditProps, PageProps } from './types';
import { FioApiUrl } from '../../types';

import classes from './AdminFioApiUrlsListPage.module.scss';

const AdminFioApiUrlsListPage: React.FC<PageProps> = props => {
  const { loading, fioApiUrlsList, getFioApiUrlsList } = props;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [apiUrlData, setApiUrlData] = useState<FioApiUrl | null>(null);

  const { paginationComponent, refresh } = usePagination(getFioApiUrlsList);

  const openFioApiUrlModal = useCallback(() => setShowModal(true), []);
  const closeFioApiUrlModal = useCallback(() => {
    setShowModal(false);
    setApiUrlData(null);
  }, []);

  const updateFioApiUrl = useCallback(
    (values: FormValuesProps) => {
      const updateApiUrl = async () => {
        try {
          await (values.id
            ? apis.admin.editFioApiUrl(values as FormValuesEditProps)
            : apis.admin.createFioApiUrl(values)
          ).then(async () => {
            await refresh();
          });
          closeFioApiUrlModal();
        } catch (err) {
          log.error(err);
        }
      };
      updateApiUrl();
    },
    [refresh, closeFioApiUrlModal],
  );

  const openApiUrl = useCallback(
    (fioApiUrl: FioApiUrl) => {
      setApiUrlData(fioApiUrl);
      openFioApiUrlModal();
    },
    [openFioApiUrlModal],
  );

  const deleteApiUrl = useCallback(
    (fioApiUrl: FioApiUrl) => {
      const deleteApiUrl = async () => {
        try {
          await apis.admin.deleteFioApiUrl(fioApiUrl);
          await refresh();
        } catch (err) {
          log.error(err);
        }
      };
      deleteApiUrl();
    },
    [refresh],
  );

  return (
    <>
      <div className={classes.tableContainer}>
        <Button className="mb-4" onClick={openFioApiUrlModal}>
          <FontAwesomeIcon icon="plus-square" className="mr-2" /> Add New Api
          Url
        </Button>
        <Table className="table" striped={true}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Url</th>
              <th scope="col">Created</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {fioApiUrlsList?.length
              ? fioApiUrlsList.map((fioApiUrl, i) => (
                  <tr
                    key={fioApiUrl.id}
                    onClick={() => openApiUrl(fioApiUrl)}
                    className={classes.userItem}
                  >
                    <th>{i + 1}</th>
                    <th>{fioApiUrl.url}</th>
                    <th>
                      {fioApiUrl.createdAt
                        ? formatDateToLocale(fioApiUrl.createdAt)
                        : null}
                    </th>
                    <th>
                      <Button
                        onClick={event => {
                          event.preventDefault();
                          event.stopPropagation();
                          deleteApiUrl(fioApiUrl);
                        }}
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </th>
                  </tr>
                ))
              : null}
          </tbody>
        </Table>

        {paginationComponent}

        {loading && <Loader />}
      </div>

      <FioApiUrlModal
        initialValues={apiUrlData}
        show={showModal}
        onSubmit={updateFioApiUrl}
        loading={loading}
        onClose={closeFioApiUrlModal}
      />
    </>
  );
};

export default AdminFioApiUrlsListPage;
