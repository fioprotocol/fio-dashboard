import React from 'react';

import { DesktopSelectionItem } from './components/DesktopSelectionItem';
import { MobileSelectionItem } from './components/MobileSelectionItem';
import { SquareShapeSelectionItem } from './components/SquareShapeSelectionItem';

import { SelectedItemProps } from '../../pages/FioAddressSelectionPage/types';

type Props = {
  isDesktop: boolean;
  isSquareShape?: boolean;
  onClick: () => void;
} & SelectedItemProps;

export const SelectionItem: React.FC<Props> = props => {
  const { isDesktop, isSquareShape } = props;

  if (isSquareShape) return <SquareShapeSelectionItem {...props} />;

  if (isDesktop) return <DesktopSelectionItem {...props} />;

  return <MobileSelectionItem {...props} />;
};
