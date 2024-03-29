export type TwoFactorComponentProps = {
  securityItemProps: {
    title: string;
    subtitle: string;
    isGreen: boolean;
  };
  successModalProps: {
    showModal: boolean;
  };
  edgeConfirmActionProps: {
    setProcessing: (isProcessing: boolean) => void;
    processing: boolean;
    hideProcessing: boolean;
  };
  genericErrorIsShowing?: boolean;
  loading: boolean;
  processing: boolean;
  showGenericErrorModal: () => void;
  toggleLoading: (isLoading: boolean) => void;
  setProcessing: (isProcessing: boolean) => void;
  toggleSuccessModal: (isOpen: boolean) => void;
  onSuccessClose: (enabledTwoFactor: boolean) => void;
};
