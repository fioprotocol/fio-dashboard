export type FormValues = {
  recoveryAnswerOne?: string;
  recoveryAnswerTwo?: string;
  password?: string;
  confirmPassword?: string;
};

export type AccountRecoveryTypes = {
  loading: boolean;
  questions: string[];
  questionsLoading: boolean;
  username: string;
  token: string;
  recoveryAccount: ({}) => void;
  recoveryAccountResults: { status?: number; error: any };
  showLoginModal: () => void;
  clearRecoveryResults: () => void;
};
