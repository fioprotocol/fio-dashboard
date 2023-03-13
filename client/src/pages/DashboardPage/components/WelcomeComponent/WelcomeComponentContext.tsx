import { ReactElement } from 'react';

import { WelcomeComponentItem } from '../WelcomeComponentItem';

import { WELCOME_COMPONENT_ITEM_CONTENT } from '../WelcomeComponentItem/constants';

const MAIN_CONTENT = {
  USER_IS_BACK: {
    title: 'Welcome!',
    text: 'Here are a few important actions.',
  },
  USER_IS_FIRST_TIME: {
    title: 'Your FIO journey starts here.',
    text:
      'There’s loads that you can do with FIO, here are just a few things to start with.',
  },
};

type UseContextProps = {
  firstWelcomeItem: ReactElement;
  secondWelcomeItem: ReactElement;
  text: string;
  title: string;
};

export const useContext = (): UseContextProps => {
  const title = MAIN_CONTENT.USER_IS_BACK.title;
  const text = MAIN_CONTENT.USER_IS_BACK.text;

  const firstWelcomeItem = (
    <WelcomeComponentItem {...WELCOME_COMPONENT_ITEM_CONTENT.FIO_BALANCE} />
  );
  const secondWelcomeItem = (
    <WelcomeComponentItem {...WELCOME_COMPONENT_ITEM_CONTENT.OPEN_SEA} />
  );

  return {
    firstWelcomeItem,
    secondWelcomeItem,
    text,
    title,
  };
};
