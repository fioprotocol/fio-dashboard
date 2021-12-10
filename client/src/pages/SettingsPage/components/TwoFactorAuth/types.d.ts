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
    setProcessing: (flag: boolean) => void;
    processing: boolean;
    hideProcessing: boolean;
  };
  genericErrorIsShowing?: boolean;
  loading: boolean;
  processing: boolean;
  toggleTwoFactorAuth: (enabled: boolean) => void;
  showGenericErrorModal: () => void;
  toggleLoading: (flag: boolean) => void;
  setProcessing: (flag: boolean) => void;
  toggleSuccessModal: (flag: boolean) => void;
};
