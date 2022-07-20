import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';

export default function useQuery(): URLSearchParams {
  const { search } = useLocation();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(search),
  );

  useEffect(() => {
    setSearchParams(new URLSearchParams(search));
  }, [search]);

  return searchParams;
}
