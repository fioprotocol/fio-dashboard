import React from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './InfiniteScroll.module.scss';

type Props = {
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  maxHeight?: number;
};

const InfiniteScroll: React.FC<Props> = props => {
  const { loading, hasNextPage, children, onLoadMore, ...rest } = props;

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore,
    rootMargin: '0px 0px 20px 0px',
    ...rest,
  });

  return (
    <div className={classes.container}>
      {children}
      {(loading || hasNextPage) && (
        <div className={classes.loader} ref={sentryRef}>
          <FontAwesomeIcon
            icon="spinner"
            spin={true}
            className={classes.loaderIcon}
          />
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
