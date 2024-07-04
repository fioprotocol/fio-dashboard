import React, { useCallback, useState } from 'react';

import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DragHandleIcon from '@mui/icons-material/DragHandle';

import Loader from '../../components/Loader/Loader';
import FioApiUrlModal from './components/createNewFioApiUrl/FioApiUrlModal';

import apis from '../../admin/api';
import { log } from '../../util/general';
import { formatDateToLocale } from '../../helpers/stringFormatters';
import usePagination from '../../hooks/usePagination';
import { reorder } from '../../util/general';

import { FormValuesProps, FormValuesEditProps, PageProps } from './types';
import { FioApiUrl } from '../../types';

import classes from './AdminFioApiUrlsListPage.module.scss';

const HEAD_ITEMS = ['', '#', 'Url', 'Created', 'Action'];

const AdminFioApiUrlsListPage: React.FC<PageProps> = props => {
  const { loading, fioApiUrlsList, getFioApiUrlsList } = props;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [apiUrlData, setApiUrlData] = useState<FioApiUrl | null>(null);
  const [isUpdating, toggleIsUpdating] = useState<boolean>(false);

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

  const updateFioApiUrlList = useCallback(
    (updatedApiUrls: FioApiUrl[]) => {
      const updateFioApiUrls = async () => {
        try {
          toggleIsUpdating(true);
          await apis.admin.updateFioApiUrls(updatedApiUrls).then(async () => {
            await refresh();
            toggleIsUpdating(false);
          });
        } catch (err) {
          log.error(err);
          toggleIsUpdating(false);
        }
      };
      updateFioApiUrls();
    },
    [refresh],
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

  const onDragEnd = useCallback(
    result => {
      if (!result.destination) {
        return;
      }

      const reorderedApiUrls: FioApiUrl[] = reorder(
        fioApiUrlsList,
        result.source.index,
        result.destination.index,
      );

      const updatedApiUrls = reorderedApiUrls.map((reordered, i) => ({
        ...reordered,
        rank: i + 1,
      }));

      updateFioApiUrlList(updatedApiUrls);
    },
    [fioApiUrlsList, updateFioApiUrlList],
  );

  return (
    <>
      <div className={classes.tableContainer}>
        <Button className="mb-4" onClick={openFioApiUrlModal}>
          <FontAwesomeIcon icon="plus-square" className="mr-2" /> Add New Api
          Url
        </Button>
        <div className={classes.itemsContainer}>
          <div className={classes.head}>
            {HEAD_ITEMS.map(headItem => (
              <div className={classes.headItem} key={headItem}>
                {headItem}
              </div>
            ))}
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {loading || isUpdating ? (
                    <Loader />
                  ) : fioApiUrlsList?.length ? (
                    fioApiUrlsList.map((fioApiUrl, i) => (
                      <Draggable
                        key={fioApiUrl.id}
                        draggableId={fioApiUrl.id}
                        index={i}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={classes.dragItemContainer}
                          >
                            <div
                              key={fioApiUrl.id}
                              onClick={() => openApiUrl(fioApiUrl)}
                              className={classes.userItem}
                            >
                              <DragHandleIcon />
                              <div>{i + 1}</div>
                              <div>{fioApiUrl.url}</div>
                              <div>
                                {fioApiUrl.createdAt
                                  ? formatDateToLocale(fioApiUrl.createdAt)
                                  : null}
                              </div>
                              <div>
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
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : null}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {paginationComponent}

        {loading && <Loader />}
      </div>

      <FioApiUrlModal
        initialValues={apiUrlData || { rank: fioApiUrlsList?.length + 1 }}
        show={showModal}
        onSubmit={updateFioApiUrl}
        loading={loading}
        onClose={closeFioApiUrlModal}
      />
    </>
  );
};

export default AdminFioApiUrlsListPage;
