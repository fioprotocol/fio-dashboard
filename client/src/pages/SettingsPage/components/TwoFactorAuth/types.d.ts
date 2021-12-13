export type TwoFactorComponentProps = {
  securityItemProps: {
    title: string;
    subtitle: string;
    isGreen: boolean;
  };
  successModalProps: {
    onClose: () => void;
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
  toggleTwoFactorAuth: (enabled: boolean) => void;
  showGenericErrorModal: () => void;
  toggleLoading: (isLoading: boolean) => void;
  setProcessing: (isProcessing: boolean) => void;
  toggleSuccessModal: (isOpen: boolean) => void;
};
