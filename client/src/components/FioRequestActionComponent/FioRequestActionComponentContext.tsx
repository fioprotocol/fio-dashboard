type UseContextProps = {
  hasFioRequest: boolean;
};

export const useContext = (): UseContextProps => {
  return {
    hasFioRequest: true,
  };
};
