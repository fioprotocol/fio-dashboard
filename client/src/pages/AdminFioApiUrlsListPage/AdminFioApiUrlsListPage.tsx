import React, { useCallback, useState, useEffect, ChangeEvent } from 'react';

import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DragHandleIcon from '@mui/icons-material/DragHandle';

import Loader from '../../components/Loader/Loader';
import FioApiUrlModal from './components/createNewFioApiUrl/FioApiUrlModal';
import FioApiUrlMinVersionModal from './components/MinVersion/FioApiUrlMinVersionModal';

import apis from '../../admin/api';
import { log } from '../../util/general';
import { formatDateToLocale } from '../../helpers/stringFormatters';
import usePagination from '../../hooks/usePagination';
import { reorder } from '../../util/general';

import { FIO_API_URLS_TYPES } from '../../constants/fio';
import { VARS_KEYS } from '../../constants/vars';

import {
  FormValuesProps,
  FormValuesEditProps,
  PageProps,
  MinVersionFormValuesProps,
} from './types';
import { FioApiUrl } from '../../types';

import classes from './AdminFioApiUrlsListPage.module.scss';

const HEAD_ITEMS = ['', '#', 'Url', 'Created', 'Action'];

const updateApiUrlVar = async (key: string, value: string) => {
  try {
    return apis.admin.updateFioApiUrlsVar({ [key]: value });
  } catch (err) {
    log.error(err);
  }
};

const AdminFioApiUrlsListPage: React.FC<PageProps> = props => {
  const { loading, fioApiUrlsList, getFioApiUrlsList } = props;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMinVerModal, setShowMinVerModal] = useState<boolean>(false);
  const [apiUrlData, setApiUrlData] = useState<FioApiUrl | null>(null);
  const [isUpdating, toggleIsUpdating] = useState<boolean>(false);
  const [isVarUpdating, toggleIsVarUpdating] = useState<boolean>(false);
  const [fioApiUrlsMinVersion, setMinVersion] = useState<string>('');
  const [fioApiUrlsDynamicFetch, setDynamicFetch] = useState<number>(0);

  const { paginationComponent, refresh } = usePagination(getFioApiUrlsList);

  const openFioApiUrlModal = useCallback(() => setShowModal(true), []);
  const closeFioApiUrlModal = useCallback(() => {
    setShowModal(false);
    setApiUrlData(null);
  }, []);
  const openFioApiUrlMinVersionModal = useCallback(
    () => setShowMinVerModal(true),
    [],
  );
  const closeFioApiUrlMinVersionModal = useCallback(
    () => setShowMinVerModal(false),
    [],
  );

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

  const updateFioApiUrlMinVersion = useCallback(
    async (values: MinVersionFormValuesProps) => {
      toggleIsVarUpdating(true);
      await updateApiUrlVar(VARS_KEYS.API_URLS_MIN_VERSION, values.minVersion);
      setMinVersion(values.minVersion);
      closeFioApiUrlMinVersionModal();
      toggleIsVarUpdating(false);
    },
    [closeFioApiUrlMinVersionModal],
  );

  const updateDynamicFetch = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      toggleIsVarUpdating(true);
      const { value } = event.target;
      const newVal = value === '0' ? '1' : '0';
      await updateApiUrlVar(VARS_KEYS.API_URLS_DYNAMIC_FETCH, `${newVal}`);
      setDynamicFetch(Number(newVal));
      toggleIsVarUpdating(false);
    },
    [],
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

  const getFioApiUrlsVar = async () => {
    try {
      const data = await apis.admin.getFioApiUrlsVar();
      setMinVersion(data[VARS_KEYS.API_URLS_MIN_VERSION]);
      setDynamicFetch(Number(data[VARS_KEYS.API_URLS_DYNAMIC_FETCH]));
    } catch (err) {
      log.error(err);
    }
  };

  useEffect(() => {
    getFioApiUrlsVar();
  }, []);

  const dashaboardApiUrlsList = fioApiUrlsList.filter(
    fioApiUrlItem => fioApiUrlItem.type === FIO_API_URLS_TYPES.DASHBOARD_API,
  );
  const dashboardHistoryUrlsList = fioApiUrlsList.filter(
    fioApiUrlItem =>
      fioApiUrlItem.type === FIO_API_URLS_TYPES.DASHBOARD_HISTORY_URL,
  );
  const wrapStatusPageApiUrls = fioApiUrlsList.filter(
    fioApiUrlItem =>
      fioApiUrlItem.type === FIO_API_URLS_TYPES.WRAP_STATUS_PAGE_API,
  );
  const wrapStatusPageHistoryV2ApiUrls = fioApiUrlsList.filter(
    fioApiUrlItem =>
      fioApiUrlItem.type === FIO_API_URLS_TYPES.WRAP_STATUS_PAGE_HISTORY_V2_URL,
  );

  const DragDropComponent = ({ apiUrlsList }: { apiUrlsList: FioApiUrl[] }) => (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {loading || isUpdating ? (
              <Loader />
            ) : apiUrlsList?.length ? (
              apiUrlsList.map((fioApiUrl, i) => (
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
  );

  return (
    <>
      <div className={classes.tableContainer}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button onClick={openFioApiUrlModal}>
            <FontAwesomeIcon icon="plus-square" className="mr-2" /> Add New Api
            Url
          </Button>
          <div className="d-flex justify-content-between align-items-center">
            <Button
              className="mr-4"
              disabled={isVarUpdating}
              onClick={openFioApiUrlMinVersionModal}
            >
              <FontAwesomeIcon icon="pen" className="mr-2" />
              {fioApiUrlsMinVersion}
            </Button>
            <Form.Check
              id="dynamicFetch"
              type="switch"
              className="mr-3"
              label="Dynamic Fetch"
              name="dynamicFetch"
              disabled={isVarUpdating}
              value={fioApiUrlsDynamicFetch}
              checked={!!fioApiUrlsDynamicFetch}
              onChange={updateDynamicFetch}
            />
          </div>
        </div>
        <div className={classes.itemsContainer}>
          <div className={classes.head}>
            {HEAD_ITEMS.map(headItem => (
              <div className={classes.headItem} key={headItem}>
                {headItem}
              </div>
            ))}
          </div>
        </div>

        <p className={classes.apiTitles}>DASHBOARD API URLS:</p>
        <DragDropComponent apiUrlsList={dashaboardApiUrlsList} />
        <p className={classes.apiTitles}>DASHBOARD HISTORY V2 URLS:</p>
        <DragDropComponent apiUrlsList={dashboardHistoryUrlsList} />
        <br />
        <hr />
        <p className={classes.apiTitles}>WRAP STATUS PAGE API URLS:</p>
        <DragDropComponent apiUrlsList={wrapStatusPageApiUrls} />
        <p className={classes.apiTitles}>WRAP STATUS PAGE HISTORY V2 URLS:</p>
        <DragDropComponent apiUrlsList={wrapStatusPageHistoryV2ApiUrls} />

        <div className={classes.paginationContainer}>{paginationComponent}</div>

        {loading && <Loader />}
      </div>

      <FioApiUrlModal
        initialValues={apiUrlData || { rank: fioApiUrlsList?.length + 1 }}
        show={showModal}
        onSubmit={updateFioApiUrl}
        loading={loading}
        onClose={closeFioApiUrlModal}
      />
      <FioApiUrlMinVersionModal
        initialValues={{ minVersion: fioApiUrlsMinVersion || '' }}
        show={showMinVerModal}
        onSubmit={updateFioApiUrlMinVersion}
        loading={loading}
        onClose={closeFioApiUrlMinVersionModal}
      />
    </>
  );
};

export default AdminFioApiUrlsListPage;
