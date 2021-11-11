export type ResultsData = {
  feeCollected?: {
    costFio: number;
    costUsdc: number;
  };
  name: string;
  publicKey?: string;
  changedStatus?: string;
  other?: any;
  error?: string;
};

export type ResultsProps = {
  title: string;
  hasAutoWidth?: boolean;
  pageName?: string;
  errorType?: string;
  results: ResultsData;
  onClose: () => void;
  onRetry?: () => void;
};

export type ResultsContainerProps = ResultsProps & {
  children: React.ReactNode;
  resetTransactionResult: () => void;
};
