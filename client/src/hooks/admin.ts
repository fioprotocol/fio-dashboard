import { useLocation } from 'react-router';

export function useIsAdminRoute(): boolean {
  const { pathname } = useLocation();

  return /admin/.test(pathname);
}
