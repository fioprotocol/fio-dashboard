import { MutableRefObject, useState, useCallback, useRef } from 'react';
import { FormApi } from 'final-form';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { EdgeAccount } from 'edge-core-js';

import { setPinEnabled } from '../../redux/edge/actions';

import { PIN_LENGTH } from '../../constants/form';
import { ROUTES } from '../../constants/routes';
import { FIELD_NAMES } from '../../components/PinForm/PinForm';

import { log } from '../../util/general';

type UseContextProps = {
  formRef: MutableRefObject<FormApi>;
  isConfirm: boolean;
  hasError: boolean;
  loading: boolean;
  processing: boolean;
  showWarningModal: boolean;
  submitData: boolean | null;
  handleForcedSkip: () => void;
  onBack: () => void;
  onCancel: () => void;
  onCloseDangerModal: () => void;
  onEdgeConfirmCancel: () => void;
  onPinChange: () => void;
  onSuccess: () => void;
  setProcessing: (processing: boolean) => void;
  startOver: () => void;
  submit: ({ edgeAccount }: { edgeAccount: EdgeAccount }) => void;
};

export const useContext = (): UseContextProps => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [loading, toggleLoading] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [showWarningModal, toggleWarningModal] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<boolean | null>(null);

  const dispatch = useDispatch();

  const history = useHistory();

  const formRef: MutableRefObject<FormApi> = useRef(null);

  const onBack = useCallback(() => {
    setIsConfirm(false);
    formRef.current?.change(FIELD_NAMES.PIN, undefined);
  }, []);

  const onCancel = useCallback(() => {
    toggleWarningModal(true);
  }, []);

  const onCloseDangerModal = useCallback(() => {
    toggleWarningModal(false);
  }, []);

  const handleForcedSkip = useCallback(() => {
    history.push(ROUTES.HOME);
    toggleWarningModal(false);
    toggleLoading(false);
  }, [history]);

  const onEdgeConfirmCancel = useCallback(() => {
    setSubmitData(null);
    setProcessing(false);
  }, []);

  const onSuccess = () => {
    setProcessing(false);
  };

  const onPinChange = useCallback(() => {
    const form = formRef.current;

    const { values } = form.getState();

    if (values.pin?.length < PIN_LENGTH) return;

    if (values.pin?.length === PIN_LENGTH && !values.confirmPin && !isConfirm) {
      setIsConfirm(true);
      return;
    }

    if (values.confirmPin?.length === PIN_LENGTH) {
      if (values.confirmPin !== values.pin) {
        form.mutators.setDataMutator(FIELD_NAMES.CONFIRM_PIN, {
          error: 'Invalid PIN Entry - Try again or start over',
        });
        setHasError(true);
        return;
      }

      setSubmitData(true);
    }

    if (values.confirmPin?.length < PIN_LENGTH && hasError) {
      form.mutators.setDataMutator(FIELD_NAMES.CONFIRM_PIN, {
        error: false,
      });
      setHasError(false);
      return;
    }
  }, [hasError, isConfirm]);

  const submit = useCallback(
    async ({ edgeAccount }: { edgeAccount: EdgeAccount }) => {
      toggleLoading(true);
      const { value: pin } = formRef.current.getFieldState(
        FIELD_NAMES.CONFIRM_PIN,
      );

      if (pin) {
        try {
          const res = await edgeAccount.changePin({ pin });
          if (res) {
            dispatch(setPinEnabled(edgeAccount.username));
          }
          await edgeAccount.logout();
          history.push(ROUTES.HOME);
        } catch (err) {
          log.error(err);
          toggleLoading(false);
        }
      }
      toggleLoading(false);
    },
    [dispatch, history],
  );

  const startOver = useCallback(() => {
    const form = formRef.current;
    if (form) {
      form.change(FIELD_NAMES.CONFIRM_PIN, undefined);
      form.mutators.setDataMutator(FIELD_NAMES.CONFIRM_PIN, {
        error: false,
      });
      setHasError(false);
    }
  }, []);

  return {
    formRef,
    isConfirm,
    hasError,
    loading,
    processing,
    showWarningModal,
    submitData,
    handleForcedSkip,
    onBack,
    onCancel,
    onCloseDangerModal,
    onEdgeConfirmCancel,
    onPinChange,
    onSuccess,
    setProcessing,
    startOver,
    submit,
  };
};
