import React, { useState, useEffect, useRef } from 'react';

import classes from './Counter.module.scss';

type Props = {
  initialTime: number;
  prefix?: string;
  classname?: string;
  toggleDisabled?: (disabled: boolean) => void;
};

const RenderTime = (time: number) => {
  const days = Math.floor(time / (3600 * 24));
  time -= days * 3600 * 24;

  const hours = Math.floor(time / 3600);
  time -= hours * 3600;

  const minutes = Math.floor(time / 60);
  time -= minutes * 60;

  const seconds = time;

  const formatTime = (timeToFormat: number) =>
    timeToFormat < 10 ? `0${timeToFormat}` : timeToFormat;

  const renderDays = () => {
    if (days <= 0) return '';
    return `${days} day${days !== 1 ? 's' : ''} `;
  };

  const renderHours = () => {
    if (days <= 0 && hours <= 0) return '';
    return <>{formatTime(hours)}:</>;
  };

  const renderDigitalTimer = () => {
    return (
      <span className={classes.digital}>
        {renderHours()}
        {formatTime(minutes)}:{formatTime(seconds)}
      </span>
    );
  };

  return (
    <>
      {renderDays()}
      {renderDigitalTimer()}
    </>
  );
};

const Counter: React.FC<Props> = props => {
  const { initialTime = 0, prefix, toggleDisabled, classname } = props;
  const initialTimeNumber = parseInt(initialTime.toFixed(0), 10);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [time, setTime] = useState(initialTimeNumber);
  const timeIsOver = time === 0;

  useEffect(() => {
    const decrementTime = time - 1;
    timerRef.current = setTimeout(() => {
      if (decrementTime >= 0) {
        setTime(decrementTime);
      }
    }, 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [initialTimeNumber, time, setTime]);

  useEffect(() => {
    if (toggleDisabled) {
      toggleDisabled(!timeIsOver);
    }
  }, [timeIsOver, toggleDisabled]);

  if (timeIsOver) return null;

  return (
    <div className={classes.container || classname}>
      {prefix} {RenderTime(time)}
    </div>
  );
};

export default Counter;
