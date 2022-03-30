import React from 'react';

export type ClickEventTypes = React.MouseEvent<HTMLElement, MouseEvent> & {
  target: { blur: () => void };
};
