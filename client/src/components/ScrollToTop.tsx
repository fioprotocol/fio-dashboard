import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type Props = {
  children: React.ReactElement;
};

const ScrollToTop: React.FC<Props> = props => {
  const { children } = props;
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
};

export default ScrollToTop;
