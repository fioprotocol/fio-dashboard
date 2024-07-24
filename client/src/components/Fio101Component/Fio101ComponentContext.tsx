import { useCallback, useEffect, useState } from 'react';

import { FIO_101_SLIDER_CONTENT, Fio101SliderContentProps } from './constants';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

type UseContextProps = {
  fio101Items: Fio101SliderContentProps[];
};

export const useContext = (props: {
  firstFromListFioAddressName: string;
  hasFCH: boolean;
  hasOneFCH: boolean;
  hasDomains: boolean;
  noMappedPubAddresses: boolean;
}): UseContextProps => {
  const {
    firstFromListFioAddressName,
    hasFCH,
    hasOneFCH,
    hasDomains,
    noMappedPubAddresses,
  } = props;

  const prepareSlides = useCallback(() => {
    let fio101ItemsArr = [
      FIO_101_SLIDER_CONTENT.DEFAULT,
      FIO_101_SLIDER_CONTENT.NO_FCH,
      FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
      FIO_101_SLIDER_CONTENT.NO_DOMAINS,
    ];

    if (hasFCH && !hasDomains) {
      fio101ItemsArr = [
        FIO_101_SLIDER_CONTENT.NO_DOMAINS,
        FIO_101_SLIDER_CONTENT.DEFAULT,
        FIO_101_SLIDER_CONTENT.NO_FCH,
        FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
      ];
    }

    if (hasFCH && noMappedPubAddresses) {
      if (hasOneFCH) {
        fio101ItemsArr = [
          {
            ...FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
            link:
              FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES.oneItemLink +
              `?${QUERY_PARAMS_NAMES.FIO_HANDLE}=${firstFromListFioAddressName}`,
          },
          FIO_101_SLIDER_CONTENT.NO_DOMAINS,
          FIO_101_SLIDER_CONTENT.DEFAULT,
          FIO_101_SLIDER_CONTENT.NO_FCH,
        ];
      } else {
        fio101ItemsArr = [
          FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
          FIO_101_SLIDER_CONTENT.NO_DOMAINS,
          FIO_101_SLIDER_CONTENT.DEFAULT,
          FIO_101_SLIDER_CONTENT.NO_FCH,
        ];
      }
    }

    if (!hasFCH) {
      fio101ItemsArr = [
        FIO_101_SLIDER_CONTENT.NO_FCH,
        FIO_101_SLIDER_CONTENT.NO_MAPPED_PUBLIC_ADDRESSES,
        FIO_101_SLIDER_CONTENT.NO_DOMAINS,
        FIO_101_SLIDER_CONTENT.DEFAULT,
      ];
    }

    return fio101ItemsArr;
  }, [
    firstFromListFioAddressName,
    hasDomains,
    hasFCH,
    hasOneFCH,
    noMappedPubAddresses,
  ]);

  const [fio101Items, setFio101Items] = useState<Fio101SliderContentProps[]>(
    [],
  );

  useEffect(() => {
    const newSlides = prepareSlides();
    setFio101Items(newSlides);
  }, [prepareSlides]);

  return {
    fio101Items,
  };
};
