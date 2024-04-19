import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import PlayCircleFilled from '@mui/icons-material/PlayCircleFilled';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import classes from './Fio101SliderComponent.module.scss';

type Props = {
  buttonText: string;
  imageSrc: string;
  link: string;
  title: string;
  text: string;
  useMobileView?: boolean;
  videoId?: string;
};

export const Fio101SliderComponent: React.FC<Props> = props => {
  const {
    buttonText,
    imageSrc,
    link,
    title,
    text,
    useMobileView,
    videoId,
  } = props;

  const [showVideo, toggleShowVideo] = useState<boolean>(false);

  const onClick = useCallback(() => {
    toggleShowVideo(true);
  }, []);

  return (
    <div
      className={classnames(
        classes.container,
        useMobileView && classes.useMobileView,
      )}
    >
      <>
        <div className={classes.mediaContainer}>
          {videoId ? (
            <div className={classes.videoContainer}>
              <div
                className={classnames(
                  classes.cover,
                  showVideo && classes.showVideo,
                )}
                onClick={onClick}
              >
                <PlayCircleFilled className={classes.icon} />
              </div>
              <iframe
                className={classnames(
                  classes.videoFrame,
                  showVideo && classes.showVideo,
                )}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                frameBorder="0"
              ></iframe>
            </div>
          ) : (
            <img src={imageSrc} alt={title} className={classes.img} />
          )}
        </div>
        <div className={classes.textContainer}>
          <h5 className={classes.title}>{title}</h5>
          <p className={classes.text}>{text}</p>
          <Link to={link} className={classes.link}>
            <SubmitButton
              text={<span className={classes.buttonText}>{buttonText}</span>}
              isButtonType
              hasLowHeight
            />
          </Link>
        </div>
      </>
    </div>
  );
};
