import { useSelector } from 'react-redux';

import { isNewUser as isNewUserSelector } from '../../../../redux/profile/selectors';

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
  text: string;
  title: string;
};

export const useContext = (): UseContextProps => {
  const isNewUser = useSelector(isNewUserSelector);

  const content = isNewUser
    ? MAIN_CONTENT.USER_IS_FIRST_TIME
    : MAIN_CONTENT.USER_IS_BACK;
  const { text, title } = content;

  return {
    text,
    title,
  };
};
