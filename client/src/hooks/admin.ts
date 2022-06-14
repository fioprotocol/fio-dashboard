import { useLocation } from 'react-router';

export function useIsAdminRoute() {
  const { pathname } = useLocation();

  return /admin/.test(pathname);
}
