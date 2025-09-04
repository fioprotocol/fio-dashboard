import { useState, useEffect, useCallback } from 'react';

import apis from '../../../../api';

import { log } from '../../../../util/general';
import { VARS_KEYS } from '../../../../constants/vars';

import { BlockedApiUrlsComponentProps } from './BlockedApiUrlsComponent';

type FormValuesProps = {
  url: string;
};

type BlockedApiUrlsComponentContextProps = {
  blockedApiUrlsList: string[];
  itemToDelete: string;
  listLoading: boolean;
  submitLoading: boolean;
  showModal: boolean;
  showDangerModal: boolean;
  onDeleteActionClick: (url: string) => void;
  openDangerModal: (url: string) => void;
  closeDangerModal: () => void;
  openModal: () => void;
  closeModal: () => void;
  onSubmit: (values: FormValuesProps) => void;
  onDelete: () => void;
};

export const useContext = ({
  blockedApiUrlsList,
  setBlockedApiUrlsList,
}: BlockedApiUrlsComponentProps): BlockedApiUrlsComponentContextProps => {
  const [listLoading, setListLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDangerModal, setShowDangerModal] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const openDangerModal = useCallback(() => setShowDangerModal(true), []);
  const closeDangerModal = useCallback(() => {
    setShowDangerModal(false);
    setItemToDelete(null);
  }, []);

  const getBlockedApiUrlsList = useCallback(async () => {
    try {
      setListLoading(true);
      const response = await apis.vars.getVar(VARS_KEYS.API_URLS_BLOCKED);

      setBlockedApiUrlsList(JSON.parse(response.value));
    } catch (err) {
      log.error(err);
    } finally {
      setListLoading(false);
    }
  }, []);

  const onSubmit = useCallback(
    async (values: FormValuesProps) => {
      try {
        setSubmitLoading(true);
        const updatedBlockedApiUrlsList = [...blockedApiUrlsList, values.url];
        await apis.vars.update(
          VARS_KEYS.API_URLS_BLOCKED,
          JSON.stringify(updatedBlockedApiUrlsList),
        );
        setBlockedApiUrlsList(updatedBlockedApiUrlsList);
        closeModal();
      } catch (err) {
        log.error(err);
      } finally {
        setSubmitLoading(false);
      }
    },
    [blockedApiUrlsList, setBlockedApiUrlsList],
  );

  const onDelete = useCallback(async () => {
    try {
      setSubmitLoading(true);
      const updatedBlockedApiUrlsList = blockedApiUrlsList.filter(
        u => u !== itemToDelete,
      );
      if (itemToDelete) {
        await apis.vars.update(
          VARS_KEYS.API_URLS_BLOCKED,
          JSON.stringify(updatedBlockedApiUrlsList),
        );
        setBlockedApiUrlsList(updatedBlockedApiUrlsList);
        setItemToDelete(null);
        closeDangerModal();
      }
    } catch (err) {
      log.error(err);
    } finally {
      setSubmitLoading(false);
    }
  }, [
    blockedApiUrlsList,
    itemToDelete,
    setBlockedApiUrlsList,
    closeDangerModal,
  ]);

  const onDeleteActionClick = useCallback(
    (url: string) => {
      setItemToDelete(url);
      openDangerModal();
    },
    [openDangerModal],
  );

  useEffect(() => {
    getBlockedApiUrlsList();
  }, [getBlockedApiUrlsList]);

  return {
    blockedApiUrlsList,
    itemToDelete,
    listLoading,
    submitLoading,
    showModal,
    showDangerModal,
    onDeleteActionClick,
    openModal,
    openDangerModal,
    closeDangerModal,
    closeModal,
    onSubmit,
    onDelete,
  };
};
