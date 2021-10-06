import React from 'react';

import logoAnimation from '../../CreateAccountForm/logo-animation.json';

const FioLoader = () => {
  return (
    <lottie-player
      id="logo-loading"
      autoplay
      loop
      mode="normal"
      src={JSON.stringify(logoAnimation)}
    ></lottie-player>
  );
};

export default FioLoader;
