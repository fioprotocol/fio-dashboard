import React from 'react';
import Slider, { CustomArrowProps } from 'react-slick';
import classnames from 'classnames';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

import { Fio101SliderComponent } from './components/Fio101SliderComponent';
import { useContext } from './Fio101ComponentContext';

import classes from './Fio101Component.module.scss';

type Props = {
  firstFromListFioAddressName: string;
  hasFCH: boolean;
  hasOneFCH: boolean;
  hasDomains: boolean;
  hideTitle?: boolean;
  isDesktop: boolean;
  loading: boolean;
  noMappedPubAddresses: boolean;
  useMobileView?: boolean;
};

const PrevArrow = (props: CustomArrowProps & { useMobileView: boolean }) => (
  <div
    className={classnames(
      classes.arrowLeft,
      props.useMobileView && classes.useMobileView,
    )}
    style={props.style}
    onClick={props.onClick}
  >
    <ChevronLeft className={classes.arrowIcon} />
  </div>
);

const NextArrow = (props: CustomArrowProps & { useMobileView: boolean }) => (
  <div
    className={classnames(
      classes.arrowRight,
      props.useMobileView && classes.useMobileView,
    )}
    style={props.style}
    onClick={props.onClick}
  >
    <ChevronRight className={classes.arrowIcon} />
  </div>
);

export const Fio101Component: React.FC<Props> = props => {
  const { hideTitle, isDesktop, loading, useMobileView } = props;
  const { fio101Items } = useContext(props);

  return (
    <div
      className={classnames(classes.container, hideTitle && classes.hideTitle)}
    >
      {!hideTitle && (
        <>
          <h2 className={classes.title}>FIO 101</h2>
          <p className={classes.subtitle}>Get comfortable with the basics.</p>
        </>
      )}
      <div className={classes.sliderContainer}>
        <div className={classes.sliderComponentContainer}>
          <Slider
            arrows
            dots={isDesktop && !useMobileView}
            appendDots={dots => <ul className={classes.sliderDots}>{dots}</ul>}
            dotsClass={classes.sliderDots}
            customPaging={() => <div className={classes.dot}></div>}
            prevArrow={<PrevArrow useMobileView={useMobileView} />}
            nextArrow={<NextArrow useMobileView={useMobileView} />}
            infinite
          >
            {fio101Items.map(fio101Item => (
              <Fio101SliderComponent
                {...fio101Item}
                key={fio101Item.title}
                useMobileView={useMobileView}
                loading={loading}
              />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};
