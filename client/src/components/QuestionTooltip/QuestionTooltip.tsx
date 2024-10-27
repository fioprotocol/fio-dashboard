import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Placement } from 'react-bootstrap/esm/Overlay';
import { FC, PropsWithChildren, useEffect, useState, MouseEvent } from 'react';

import QuestionSvg from '../../assets/images/question.svg';

type Props = PropsWithChildren<{
  placement?: Placement;
}>;

const HIDE_DELAY = 500;

export const QuestionTooltip: FC<Props> = ({ placement, children }) => {
  const [isShow, setIsShow] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<number>();

  const handleToggle = (e: MouseEvent<HTMLElement>) => {
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
    if (hideTimeout) clearTimeout(hideTimeout);
    setIsShow(isShow => !isShow);
  };

  const handleShow = () => {
    if (isShow) {
      return;
    }
    if (hideTimeout) clearTimeout(hideTimeout);
    setIsShow(true);
  };

  const handleHide = () => {
    if (!isShow) {
      return;
    }
    setHideTimeout(
      window.setTimeout(() => {
        setIsShow(false);
        setHideTimeout(undefined);
      }, HIDE_DELAY),
    );
  };

  useEffect(() => {
    const handler = () => {
      if (!isShow) {
        return;
      }
      setIsShow(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [isShow]);

  return (
    <OverlayTrigger
      show={isShow}
      placement={placement || 'top-start'}
      overlay={
        <Tooltip id="question">
          <span onMouseEnter={handleShow} onMouseLeave={handleHide}>
            {children}
          </span>
        </Tooltip>
      }
    >
      <img
        src={QuestionSvg}
        alt="question"
        onClick={handleToggle}
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
      />
    </OverlayTrigger>
  );
};
