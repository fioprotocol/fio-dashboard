import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface ContainerOwnProps extends RouteComponentProps {
  children?: React.ReactNode;
}

export type ContainerProps = ContainerOwnProps;

export type Partner = {
  name: string;
  link: string;
  image: string;
};
