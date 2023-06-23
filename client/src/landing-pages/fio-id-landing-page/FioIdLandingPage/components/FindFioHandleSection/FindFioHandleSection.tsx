import React, { useEffect } from 'react';

import {
  FioProfileActionBadge,
  ACTION_BUTTONS_NAMES,
} from '../../../../../components/FioProfileActionBadge';
import { FindFioHandleForm } from '../FindFioHandleForm';

import DownMouseIconSrc from '../../../../../assets/images/fio-id-images/down-mouse.svg';
import FioCardSrc from '../../../../../assets/images/fio-id-images/fio-card.svg';
import FacebookIconSrc from '../../../../../assets/images/fio-id-images/facebook.svg';
import InstagramIconSrc from '../../../../../assets/images/fio-id-images/square-instagram.svg';
import LinkedinIconSrc from '../../../../../assets/images/fio-id-images/square-linkedin.svg';
import TwitterIconSrc from '../../../../../assets/images/fio-id-images/round-twitter.svg';
import WhatsappIconSrc from '../../../../../assets/images/fio-id-images/whatsapp.svg';

import classes from './FindFioHandleSection.module.scss';

const socialIcons = [
  { alt: 'Facebook icon', imageSrc: FacebookIconSrc },
  { alt: 'Instagram icon', imageSrc: InstagramIconSrc },
  { alt: 'LinkedIn icon', imageSrc: LinkedinIconSrc },
  { alt: 'Twitter icon', imageSrc: TwitterIconSrc },
  { alt: 'Whatsapp icon', imageSrc: WhatsappIconSrc },
];

type Props = {
  fioBaseUrl: string;
  isDesktop: boolean;
  setFch: (fch: string) => void;
};

export const FindFioHandleSection: React.FC<Props> = props => {
  const { fioBaseUrl, isDesktop, setFch } = props;

  useEffect(() => {
    function parallax() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const parallaxLayers = document.querySelectorAll<HTMLElement>(
        '[data-img]',
      );
      for (let i = 0; i < parallaxLayers.length; i++) {
        const layer = parallaxLayers[i];
        const depth = 0.07 * i || 0.07;

        const movement = scrollTop * depth;
        let moveY = movement;
        let moveX = 0;

        switch (i) {
          case 0: {
            moveX = moveY * 2;
            break;
          }
          case 1: {
            moveX = moveY / 5;
            break;
          }
          case 2: {
            moveX = -moveY / 10;
            break;
          }
          case 3: {
            moveY = -moveY;
            moveX = -moveY / 5;
            break;
          }
          case 4: {
            moveY = moveY / 3;
            break;
          }
          default: {
            break;
          }
        }
        layer.style.transform = `translateY(${moveY}px) translateX(${moveX}px)`;
      }
    }

    window.addEventListener('scroll', parallax);

    return () => window.removeEventListener('scroll', parallax);
  }, []);

  return (
    <div className={classes.container}>
      <FioProfileActionBadge
        fioBaseUrl={fioBaseUrl}
        actionButtons={[
          ACTION_BUTTONS_NAMES.GET_FIO_HANDLE,
          ACTION_BUTTONS_NAMES.MANAGE_FIO_HANDLE,
        ]}
        hasButtonMenu={!isDesktop}
      />
      <div className={classes.contentContainer}>
        <FindFioHandleForm fioBaseUrl={fioBaseUrl} setFch={setFch} />
        {isDesktop && (
          <div className={classes.imageContainer}>
            <div className={classes.parallax}>
              <div className={classes.parallaxLayer}>
                <img
                  src={FioCardSrc}
                  alt="FIO card"
                  className={classes.fioCard}
                />
                {socialIcons.map(socialIcon => (
                  <img
                    key={socialIcon.alt}
                    src={socialIcon.imageSrc}
                    alt={socialIcon.alt}
                    data-img="true"
                    className={classes.socialIcon}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <img
        src={DownMouseIconSrc}
        alt="Down mouse icon"
        className={classes.mouseDown}
      />
    </div>
  );
};
