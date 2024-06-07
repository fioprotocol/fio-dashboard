import { useSelector } from 'react-redux';

import { refProfileInfo } from '../../redux/refProfile/selectors';

type UseContext = {
  isBranded: boolean;
};

export const useContext = (): UseContext => {
  const refProfile = useSelector(refProfileInfo);

  const isBranded = refProfile?.settings?.isBranded;

  return { isBranded };
};
