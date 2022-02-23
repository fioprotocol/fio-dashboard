import React, { useState } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Placement } from 'react-bootstrap/esm/Overlay';

const TOOLTIP_TEXT = {
  default: 'Click to copy',
  copied: 'Copied!',
};

type Props = {
  children: React.ReactNode;
  placement?: Placement;
};

const CopyTooltip: React.FC<Props> = props => {
  const { children, placement } = props;
  const [copyText, changeText] = useState(TOOLTIP_TEXT.default);

  const onClick = () => changeText(TOOLTIP_TEXT.copied);
  const setDefaultTooltipText = () => changeText(TOOLTIP_TEXT.default);

  return (
    <OverlayTrigger
      placement={placement || 'top-start'}
      overlay={
        <Tooltip id="copy">
          <span>{copyText}</span>
        </Tooltip>
      }
    >
      <div onMouseLeave={setDefaultTooltipText} onClick={onClick}>
        {children}
      </div>
    </OverlayTrigger>
  );
};

export default CopyTooltip;
