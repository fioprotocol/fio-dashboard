import { useDispatch, useSelector } from 'react-redux';

import { pathname as pathnameSelector } from '../../../../redux/navigation/selectors';
import { apiUrls as apiUrlsSelector } from '../../../../redux/registrations/selectors';

import { getApiUrls } from '../../../../redux/registrations/actions';

import { useGTMGlobalTags } from '../../../../hooks/googleTagManager';
import { getObjKeyByValue } from '../../../../utils';
import useEffectOnce from '../../../../hooks/general';
import apis from '../../api';

import { ROUTES } from '../../../../constants/routes';

type UseContextProps = {
  routeName: string;
};

export const useContext = (): UseContextProps => {
  const pathname = useSelector(pathnameSelector);
  const apiUrls = useSelector(apiUrlsSelector);
  const dispatch = useDispatch();

  useGTMGlobalTags();

  const routeName = getObjKeyByValue(ROUTES, pathname);

  useEffectOnce(() => {
    dispatch(getApiUrls());
  }, [getApiUrls]);

  useEffectOnce(
    () => {
      apis.fio.setApiUrls(apiUrls);
    },
    [apiUrls],
    apiUrls?.length !== 0,
  );

  return { routeName };
};
