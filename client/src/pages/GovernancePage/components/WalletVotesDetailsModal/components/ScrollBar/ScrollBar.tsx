import React, { useEffect, useRef, useState } from 'react';
import Scrollbar from 'react-scrollbars-custom';

import classes from './ScrollBar.module.scss';

const TAB_SCROLL_BAR_STYLES = {
  height: 'auto',
  maxHeight: 350,
};

type Props = {
  maxHeight?: number;
};

export const ScrollBar: React.FC<Props> = props => {
  const [contentHeight, setContentHeight] = useState(0);

  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // Get the actual content height
      const height = contentRef.current.scrollHeight;
      // Update the height state, capped at maxHieght
      setContentHeight(
        Math.min(height, props.maxHeight || TAB_SCROLL_BAR_STYLES.maxHeight),
      );
    }
  }, [props.children, props.maxHeight]);

  return (
    <Scrollbar
      style={{ ...TAB_SCROLL_BAR_STYLES, height: contentHeight, ...props }}
      thumbYProps={{ className: classes.scrollThumbY }}
      trackYProps={{ className: classes.scrollTrackY }}
      momentum
    >
      <div ref={contentRef}>{props.children}</div>
    </Scrollbar>
  );
};
