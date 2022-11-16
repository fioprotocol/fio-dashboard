import { useSelector } from 'react-redux';

import { pathname as pathnameSelector } from '../../../../redux/navigation/selectors';

import { useGTMGlobalTags } from '../../../../hooks/googleTagManager';
import { getObjKeyByValue } from '../../../../utils';

import { ROUTES } from '../../../../constants/routes';

type UseContextProps = {
  routeName: string;
};

export const useContext = (): UseContextProps => {
  const pathname = useSelector(pathnameSelector);

  useGTMGlobalTags();

  const routeName = getObjKeyByValue(ROUTES, pathname);

  return { routeName };
};
