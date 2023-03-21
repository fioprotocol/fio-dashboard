import React from 'react';
import Slider, { CustomArrowProps } from 'react-slick';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

import { ItemWrapper } from '../ItemWrapper';
import { Fio101SliderComponent } from '../Fio101SliderComponent';

import { Fio101SliderContentProps } from './constants';

import classes from './Fio101Component.module.scss';

type Props = {
  fio101Items: Fio101SliderContentProps[];
  isDesktop?: boolean;
  loading: boolean;
};

const PrevArrow = (props: CustomArrowProps) => (
  <div
    className={classes.arrowLeft}
    style={props.style}
    onClick={props.onClick}
  >
    <ChevronLeft className={classes.arrowIcon} />
  </div>
);

const NextArrow = (props: CustomArrowProps) => (
  <div
    className={classes.arrowRight}
    style={props.style}
    onClick={props.onClick}
  >
    <ChevronRight className={classes.arrowIcon} />
  </div>
);

export const Fio101Component: React.FC<Props> = props => {
  const { isDesktop, fio101Items, loading } = props;

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>FIO 101</h2>
      <p className={classes.subtitle}>Get comfortable with the basics.</p>
      <div className={classes.sliderContainer}>
        <ItemWrapper>
          <div className={classes.sliderComponentContainer}>
            <Slider
              arrows
              dots={isDesktop}
              appendDots={dots => (
                <ul className={classes.sliderDots}>{dots}</ul>
              )}
              dotsClass={classes.sliderDots}
              customPaging={() => <div className={classes.dot}></div>}
              prevArrow={<PrevArrow />}
              nextArrow={<NextArrow />}
              infinite
            >
              {fio101Items.map(fio101Item => (
                <Fio101SliderComponent
                  {...fio101Item}
                  key={fio101Item.title}
                  loading={loading}
                />
              ))}
            </Slider>
          </div>
        </ItemWrapper>
      </div>
    </div>
  );
};
