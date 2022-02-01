import React from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './InfiniteScroll.module.scss';
import classnames from 'classnames';

type Props = {
  loading: boolean;
  hasNextPage: boolean;
  isContentScrollable: boolean;
  onLoadMore: () => void;
};

const InfiniteScroll: React.FC<Props> = props => {
  const {
    loading,
    hasNextPage,
    isContentScrollable,
    children,
    onLoadMore,
    ...rest
  } = props;

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore,
    rootMargin: '0px 0px 20px 0px',
    ...rest,
  });

  return (
    <div
      className={classnames(
        classes.container,
        isContentScrollable && classes.scrollable,
      )}
    >
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
